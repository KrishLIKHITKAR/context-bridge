// Simple database test functions
import { capsuleHelpers, projectHelpers, sessionHelpers, artifactHelpers, dbUtils } from './helpers'
import { Provider, Priority, ArtifactType } from './types'

export async function testDatabase() {
  console.log('🧪 Testing Context Bridge Database...')
  
  try {
    // Clear any existing data
    await dbUtils.clearAll()
    console.log('✅ Database cleared')

    // Test project creation
    const testProject = await projectHelpers.create({
      name: 'Test Project',
      description: 'A test project for Context Bridge',
      defaultProvider: Provider.GPT,
      tags: ['test', 'demo'],
      isArchived: false
    })
    console.log('✅ Project created:', testProject.name)

    // Test capsule creation
    const testCapsule = await capsuleHelpers.create({
      projectId: testProject.id,
      persona: 'Helpful AI assistant',
      constraints: ['Be concise', 'Stay on topic'],
      decisions: ['Use TypeScript for type safety'],
      openLoops: ['Implement token counting', 'Add error handling'],
      terminology: {
        'capsule': 'A portable context container',
        'provider': 'AI service like GPT, Claude, or Gemini'
      },
      lastK: [
        {
          role: 'user',
          content: 'Please help me with this code',
          timestamp: new Date()
        },
        {
          role: 'assistant',
          content: 'I\'d be happy to help! What specific issue are you facing?',
          timestamp: new Date()
        }
      ],
      segments: [
        {
          id: 'seg-1',
          content: 'Initial problem description',
          priority: Priority.HIGH,
          type: 'problem',
          tokens: 25
        },
        {
          id: 'seg-2',
          content: 'Technical context and constraints',
          priority: Priority.MEDIUM,
          type: 'context',
          tokens: 45
        }
      ],
      providerHints: {
        [Provider.GPT]: {
          maxTokens: 3000,
          temperature: 0.7
        },
        [Provider.CLAUDE]: {
          maxTokens: 3000,
          temperature: 0.6
        }
      },
      sourceUrl: 'https://chat.openai.com/c/test-123',
      sourceProvider: Provider.GPT,
      tags: ['test', 'coding'],
      estimatedTokens: 70
    })
    console.log('✅ Capsule created with ID:', testCapsule.id)

    // Test session creation
    const testSession = await sessionHelpers.create({
      projectId: testProject.id,
      provider: Provider.GPT,
      url: 'https://chat.openai.com/c/test-123',
      title: 'Test debugging session',
      timestamp: new Date(),
      continuityCapsule: testCapsule.id,
      originalText: 'Selected text from the conversation...',
      isBookmarked: false
    })
    console.log('✅ Session created with ID:', testSession.id)

    // Test artifact creation
    const testArtifact = await artifactHelpers.create({
      projectId: testProject.id,
      type: ArtifactType.CODEBASE_CAPSULE,
      title: 'Project Structure Overview',
      content: JSON.stringify({
        files: ['src/main.ts', 'src/utils.ts'],
        description: 'TypeScript project with utilities'
      }),
      sourceSessionId: testSession.id,
      priority: Priority.HIGH,
      tags: ['codebase', 'structure'],
      metadata: {
        language: 'typescript',
        framework: 'vite'
      }
    })
    console.log('✅ Artifact created with ID:', testArtifact.id)

    // Test retrieval functions
    const retrievedProject = await projectHelpers.getById(testProject.id)
    const projectCapsules = await capsuleHelpers.getByProject(testProject.id)
    const projectSessions = await sessionHelpers.getByProject(testProject.id)
    const projectArtifacts = await artifactHelpers.getByProject(testProject.id)

    console.log('✅ Retrieved project:', retrievedProject?.name)
    console.log('✅ Project has', projectCapsules.length, 'capsules')
    console.log('✅ Project has', projectSessions.length, 'sessions')
    console.log('✅ Project has', projectArtifacts.length, 'artifacts')

    // Test database stats
    const stats = await dbUtils.getStats()
    console.log('✅ Database stats:', stats)

    // Test export/import
    const exportData = await dbUtils.exportData()
    console.log('✅ Data exported, size:', JSON.stringify(exportData).length, 'bytes')

    console.log('🎉 All database tests passed!')
    return {
      success: true,
      project: testProject,
      capsule: testCapsule,
      session: testSession,
      artifact: testArtifact,
      stats
    }

  } catch (error) {
    console.error('❌ Database test failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    }
  }
}

// Export for use in popup/background scripts
if (typeof window !== 'undefined') {
  (window as any).testContextBridgeDB = testDatabase
}
