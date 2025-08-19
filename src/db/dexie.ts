import Dexie, { Table } from 'dexie'
import { Capsule, Project, Session, Artifact, TABLES } from './types'

export class ContextBridgeDB extends Dexie {
    // Tables
    capsules!: Table<Capsule>
    projects!: Table<Project>
    sessions!: Table<Session>
    artifacts!: Table<Artifact>

    constructor() {
        super('ContextBridgeDB')

        this.version(1).stores({
            [TABLES.CAPSULES]: '++id, projectId, createdAt, updatedAt, sourceProvider, estimatedTokens, *tags',
            [TABLES.PROJECTS]: '++id, name, createdAt, updatedAt, defaultProvider, isArchived, *tags',
            [TABLES.SESSIONS]: '++id, projectId, provider, timestamp, url, isBookmarked',
            [TABLES.ARTIFACTS]: '++id, projectId, type, priority, createdAt, updatedAt, sourceSessionId, *tags'
        })

        // Hooks for automatic timestamps
        this.capsules.hook('creating', function (_primKey, obj, _trans) {
            obj.createdAt = new Date()
            obj.updatedAt = new Date()
        })

        this.capsules.hook('updating', function (modifications, _primKey, _obj, _trans) {
            (modifications as any).updatedAt = new Date()
        })

        this.projects.hook('creating', function (_primKey, obj, _trans) {
            obj.createdAt = new Date()
            obj.updatedAt = new Date()
        })

        this.projects.hook('updating', function (modifications, _primKey, _obj, _trans) {
            (modifications as any).updatedAt = new Date()
        })

        this.artifacts.hook('creating', function (_primKey, obj, _trans) {
            obj.createdAt = new Date()
            obj.updatedAt = new Date()
        })

        this.artifacts.hook('updating', function (modifications, _primKey, _obj, _trans) {
            (modifications as any).updatedAt = new Date()
        })
    }

    // Utility method to clear all data (for development/testing)
    async clearAll() {
        await this.transaction('rw', this.capsules, this.projects, this.sessions, this.artifacts, () => {
            this.capsules.clear()
            this.projects.clear()
            this.sessions.clear()
            this.artifacts.clear()
        })
    }

    // Get database info
    async getDbInfo() {
        const [capsulesCount, projectsCount, sessionsCount, artifactsCount] = await Promise.all([
            this.capsules.count(),
            this.projects.count(),
            this.sessions.count(),
            this.artifacts.count()
        ])

        return {
            capsules: capsulesCount,
            projects: projectsCount,
            sessions: sessionsCount,
            artifacts: artifactsCount,
            total: capsulesCount + projectsCount + sessionsCount + artifactsCount
        }
    }
}

// Export singleton instance
export const db = new ContextBridgeDB()
