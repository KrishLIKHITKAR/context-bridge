import { db } from './dexie'
import { 
  Capsule, 
  Project, 
  Session, 
  Artifact,
  CreateCapsule,
  CreateProject,
  CreateSession,
  CreateArtifact,
  CapsuleSchema,
  ProjectSchema,
  SessionSchema,
  ArtifactSchema,
  Provider,
  Priority
} from './types'

// Generate unique IDs
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// Capsule helpers
export const capsuleHelpers = {
  async create(data: CreateCapsule): Promise<Capsule> {
    const capsule: Capsule = {
      ...data,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    // Validate with Zod
    const validated = CapsuleSchema.parse(capsule)
    
    await db.capsules.add(validated)
    return validated
  },

  async getById(id: string): Promise<Capsule | undefined> {
    return await db.capsules.get(id)
  },

  async getByProject(projectId: string): Promise<Capsule[]> {
    return await db.capsules
      .where('projectId')
      .equals(projectId)
      .reverse()
      .sortBy('createdAt')
  },

  async getRecent(limit: number = 10): Promise<Capsule[]> {
    return await db.capsules
      .orderBy('createdAt')
      .reverse()
      .limit(limit)
      .toArray()
  },

  async update(id: string, updates: Partial<Capsule>): Promise<void> {
    await db.capsules.update(id, updates)
  },

  async delete(id: string): Promise<void> {
    await db.capsules.delete(id)
  },

  async searchByTags(tags: string[]): Promise<Capsule[]> {
    return await db.capsules
      .where('tags')
      .anyOf(tags)
      .toArray()
  }
}

// Project helpers
export const projectHelpers = {
  async create(data: CreateProject): Promise<Project> {
    const project: Project = {
      ...data,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    const validated = ProjectSchema.parse(project)
    await db.projects.add(validated)
    return validated
  },

  async getById(id: string): Promise<Project | undefined> {
    return await db.projects.get(id)
  },

  async getAll(): Promise<Project[]> {
    return await db.projects
      .where('isArchived')
      .equals(0) // false as number
      .reverse()
      .sortBy('updatedAt')
  },

  async getArchived(): Promise<Project[]> {
    return await db.projects
      .where('isArchived')
      .equals(1) // true as number
      .reverse()
      .sortBy('updatedAt')
  },

  async update(id: string, updates: Partial<Project>): Promise<void> {
    await db.projects.update(id, updates)
  },

  async archive(id: string): Promise<void> {
    await db.projects.update(id, { isArchived: true })
  },

  async unarchive(id: string): Promise<void> {
    await db.projects.update(id, { isArchived: false })
  },

  async delete(id: string): Promise<void> {
    // Also delete related capsules, sessions, and artifacts
    await db.transaction('rw', db.projects, db.capsules, db.sessions, db.artifacts, async () => {
      await db.projects.delete(id)
      await db.capsules.where('projectId').equals(id).delete()
      await db.sessions.where('projectId').equals(id).delete()
      await db.artifacts.where('projectId').equals(id).delete()
    })
  }
}

// Session helpers
export const sessionHelpers = {
  async create(data: CreateSession): Promise<Session> {
    const session: Session = {
      ...data,
      id: generateId()
    }
    
    const validated = SessionSchema.parse(session)
    await db.sessions.add(validated)
    return validated
  },

  async getById(id: string): Promise<Session | undefined> {
    return await db.sessions.get(id)
  },

  async getByProject(projectId: string): Promise<Session[]> {
    return await db.sessions
      .where('projectId')
      .equals(projectId)
      .reverse()
      .sortBy('timestamp')
  },

  async getByProvider(provider: Provider): Promise<Session[]> {
    return await db.sessions
      .where('provider')
      .equals(provider)
      .reverse()
      .sortBy('timestamp')
  },

  async getBookmarked(): Promise<Session[]> {
    return await db.sessions
      .where('isBookmarked')
      .equals(1) // true as number
      .reverse()
      .sortBy('timestamp')
  },

  async update(id: string, updates: Partial<Session>): Promise<void> {
    await db.sessions.update(id, updates)
  },

  async bookmark(id: string): Promise<void> {
    await db.sessions.update(id, { isBookmarked: true })
  },

  async unbookmark(id: string): Promise<void> {
    await db.sessions.update(id, { isBookmarked: false })
  },

  async delete(id: string): Promise<void> {
    await db.sessions.delete(id)
  }
}

// Artifact helpers
export const artifactHelpers = {
  async create(data: CreateArtifact): Promise<Artifact> {
    const artifact: Artifact = {
      ...data,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    const validated = ArtifactSchema.parse(artifact)
    await db.artifacts.add(validated)
    return validated
  },

  async getById(id: string): Promise<Artifact | undefined> {
    return await db.artifacts.get(id)
  },

  async getByProject(projectId: string): Promise<Artifact[]> {
    return await db.artifacts
      .where('projectId')
      .equals(projectId)
      .reverse()
      .sortBy('updatedAt')
  },

  async getByType(type: string): Promise<Artifact[]> {
    return await db.artifacts
      .where('type')
      .equals(type)
      .reverse()
      .sortBy('updatedAt')
  },

  async getByPriority(priority: Priority): Promise<Artifact[]> {
    return await db.artifacts
      .where('priority')
      .equals(priority)
      .reverse()
      .sortBy('updatedAt')
  },

  async update(id: string, updates: Partial<Artifact>): Promise<void> {
    await db.artifacts.update(id, updates)
  },

  async delete(id: string): Promise<void> {
    await db.artifacts.delete(id)
  },

  async searchByTags(tags: string[]): Promise<Artifact[]> {
    return await db.artifacts
      .where('tags')
      .anyOf(tags)
      .toArray()
  }
}

// General database utilities
export const dbUtils = {
  async getStats() {
    return await db.getDbInfo()
  },

  async clearAll() {
    await db.clearAll()
  },

  async exportData() {
    const [capsules, projects, sessions, artifacts] = await Promise.all([
      db.capsules.toArray(),
      db.projects.toArray(),
      db.sessions.toArray(),
      db.artifacts.toArray()
    ])

    return {
      version: 1,
      timestamp: new Date().toISOString(),
      data: {
        capsules,
        projects,
        sessions,
        artifacts
      }
    }
  },

  async importData(exportData: any) {
    if (exportData.version !== 1) {
      throw new Error('Unsupported export version')
    }

    await db.transaction('rw', db.capsules, db.projects, db.sessions, db.artifacts, async () => {
      await db.clearAll()
      
      if (exportData.data.projects) {
        await db.projects.bulkAdd(exportData.data.projects)
      }
      if (exportData.data.capsules) {
        await db.capsules.bulkAdd(exportData.data.capsules)
      }
      if (exportData.data.sessions) {
        await db.sessions.bulkAdd(exportData.data.sessions)
      }
      if (exportData.data.artifacts) {
        await db.artifacts.bulkAdd(exportData.data.artifacts)
      }
    })
  }
}
