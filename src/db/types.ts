import { z } from 'zod'

// Priority levels for capsule content
export enum Priority {
    CRITICAL = 'critical',
    HIGH = 'high',
    MEDIUM = 'medium',
    LOW = 'low'
}

// AI Provider types
export enum Provider {
    GPT = 'gpt',
    CLAUDE = 'claude',
    GEMINI = 'gemini'
}

// Artifact types for different use cases
export enum ArtifactType {
    CODEBASE_CAPSULE = 'codebase_capsule',
    DIFF_CAPSULE = 'diff_capsule',
    FIX_CAPSULE = 'fix_capsule',
    CITATION_CAPSULE = 'citation_capsule',
    BRAND_RULES = 'brand_rules',
    CONTENT_ATOMIZER = 'content_atomizer',
    GENERAL = 'general'
}

// Zod schemas for validation
export const CapsuleSchema = z.object({
    id: z.string(),
    projectId: z.string().optional(),
    createdAt: z.date(),
    updatedAt: z.date(),

    // Core capsule content
    persona: z.string().optional(),
    constraints: z.array(z.string()),
    decisions: z.array(z.string()),
    openLoops: z.array(z.string()),
    terminology: z.record(z.string(), z.string()), // key-value pairs for custom terms
    lastK: z.array(z.object({
        role: z.enum(['user', 'assistant', 'system']),
        content: z.string(),
        timestamp: z.date().optional()
    })),

    // Segmentation and prioritization
    segments: z.array(z.object({
        id: z.string(),
        content: z.string(),
        priority: z.nativeEnum(Priority),
        type: z.string().optional(), // 'code', 'discussion', 'decision', etc.
        tokens: z.number().optional()
    })),

    // Provider-specific hints
    providerHints: z.record(z.nativeEnum(Provider), z.object({
        maxTokens: z.number(),
        temperature: z.number().optional(),
        topP: z.number().optional(),
        frequencyPenalty: z.number().optional(),
        presencePenalty: z.number().optional()
    })).optional(),

    // Final packed output
    packedOutput: z.record(z.nativeEnum(Provider), z.string()).optional(),

    // Metadata
    sourceUrl: z.string().optional(),
    sourceProvider: z.nativeEnum(Provider).optional(),
    tags: z.array(z.string()).default([]),
    estimatedTokens: z.number().optional()
})

export const ProjectSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().optional(),
    createdAt: z.date(),
    updatedAt: z.date(),

    // Project settings
    defaultProvider: z.nativeEnum(Provider).optional(),
    brandRules: z.string().optional(), // Pinned brand rules for creators
    pinnedPersona: z.string().optional(), // Pinned persona for consistency

    // Metadata
    tags: z.array(z.string()).default([]),
    isArchived: z.boolean().default(false)
})

export const SessionSchema = z.object({
    id: z.string(),
    projectId: z.string(),
    provider: z.nativeEnum(Provider),
    url: z.string(),
    title: z.string().optional(),
    timestamp: z.date(),

    // Session content
    continuityCapsule: z.string().optional(), // Reference to capsule ID
    originalText: z.string().optional(), // Original selected text

    // Metadata
    isBookmarked: z.boolean().default(false),
    notes: z.string().optional()
})

export const ArtifactSchema = z.object({
    id: z.string(),
    projectId: z.string(),
    type: z.nativeEnum(ArtifactType),
    title: z.string(),
    content: z.string(), // JSON or Markdown content

    // Metadata
    sourceSessionId: z.string().optional(),
    priority: z.nativeEnum(Priority).default(Priority.MEDIUM),
    tags: z.array(z.string()).default([]),
    createdAt: z.date(),
    updatedAt: z.date(),

    // Artifact-specific metadata
    metadata: z.record(z.any()).optional()
})

// TypeScript types derived from Zod schemas
export type Capsule = z.infer<typeof CapsuleSchema>
export type Project = z.infer<typeof ProjectSchema>
export type Session = z.infer<typeof SessionSchema>
export type Artifact = z.infer<typeof ArtifactSchema>

// Helper types for creating new records
export type CreateCapsule = Omit<Capsule, 'id' | 'createdAt' | 'updatedAt'>
export type CreateProject = Omit<Project, 'id' | 'createdAt' | 'updatedAt'>
export type CreateSession = Omit<Session, 'id'>
export type CreateArtifact = Omit<Artifact, 'id' | 'createdAt' | 'updatedAt'>

// Database table names
export const TABLES = {
    CAPSULES: 'capsules',
    PROJECTS: 'projects',
    SESSIONS: 'sessions',
    ARTIFACTS: 'artifacts'
} as const
