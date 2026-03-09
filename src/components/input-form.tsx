"use client"

import { Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Select } from "@/components/ui/select"
import type { DifficultyLevel, ProjectInput, ProjectType, Skill } from "@/types/project"
import { DIFFICULTY_LEVELS, PROJECT_TYPES, SKILLS } from "@/types/project"

type InputFormProps = {
  value: ProjectInput
  isGenerating: boolean
  onChange: (next: ProjectInput) => void
  onSubmit: () => void
}

export function InputForm({
  value,
  isGenerating,
  onChange,
  onSubmit,
}: InputFormProps) {
  return (
    <Card className="border-white/30 bg-white/85 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-xl">Build Your Next Project</CardTitle>
        <CardDescription>
          Pick your stack profile and let AI generate a complete project roadmap.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="skill" className="text-sm font-medium">
            Skill
          </label>
          <Select
            id="skill"
            value={value.skill}
            disabled={isGenerating}
            onValueChange={(skill) =>
              onChange({ ...value, skill: skill as Skill })
            }
            options={SKILLS.map((skill) => ({ label: skill, value: skill }))}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="level" className="text-sm font-medium">
            Difficulty Level
          </label>
          <Select
            id="level"
            value={value.level}
            disabled={isGenerating}
            onValueChange={(level) =>
              onChange({ ...value, level: level as DifficultyLevel })
            }
            options={DIFFICULTY_LEVELS.map((level) => ({
              label: level,
              value: level,
            }))}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="projectType" className="text-sm font-medium">
            Project Type
          </label>
          <Select
            id="projectType"
            value={value.projectType}
            disabled={isGenerating}
            onValueChange={(projectType) =>
              onChange({ ...value, projectType: projectType as ProjectType })
            }
            options={PROJECT_TYPES.map((projectType) => ({
              label: projectType,
              value: projectType,
            }))}
          />
        </div>

        <Button className="w-full" size="lg" disabled={isGenerating} onClick={onSubmit}>
          <Sparkles className="size-4" />
          {isGenerating ? "Generating..." : "Generate Project"}
        </Button>
      </CardContent>
    </Card>
  )
}

