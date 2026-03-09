export const SKILLS = ["React", "Python", "Java", "AI", "Node.js"] as const
export const DIFFICULTY_LEVELS = [
  "Beginner",
  "Intermediate",
  "Advanced",
] as const
export const PROJECT_TYPES = ["Web App", "Mobile App", "AI Tool"] as const

export type Skill = (typeof SKILLS)[number]
export type DifficultyLevel = (typeof DIFFICULTY_LEVELS)[number]
export type ProjectType = (typeof PROJECT_TYPES)[number]

export type ProjectInput = {
  skill: Skill
  level: DifficultyLevel
  projectType: ProjectType
}

export type GeneratedIdea = {
  id: string
  createdAt: string
  title: string
  input: ProjectInput
  markdown: string
}

