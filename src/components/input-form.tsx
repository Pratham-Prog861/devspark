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
    <Card className="border-white/80 bg-white/85 dark:border-slate-700 dark:bg-slate-900/70">
      <CardHeader className="pb-1">
        <CardTitle className="text-xl text-slate-900 dark:text-slate-100">Build Your Next Project</CardTitle>
        <CardDescription className="text-slate-600 dark:text-slate-300">
          Tailor the AI to your goals and generate a practical, buildable idea.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="skill" className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Skill
          </label>
          <Select
            id="skill"
            value={value.skill}
            disabled={isGenerating}
            className="h-11 rounded-xl border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            onValueChange={(skill) => onChange({ ...value, skill: skill as Skill })}
            options={SKILLS.map((skill) => ({ label: skill, value: skill }))}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="level" className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Difficulty Level
          </label>
          <Select
            id="level"
            value={value.level}
            disabled={isGenerating}
            className="h-11 rounded-xl border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            onValueChange={(level) => onChange({ ...value, level: level as DifficultyLevel })}
            options={DIFFICULTY_LEVELS.map((level) => ({
              label: level,
              value: level,
            }))}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="projectType" className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Project Type
          </label>
          <Select
            id="projectType"
            value={value.projectType}
            disabled={isGenerating}
            className="h-11 rounded-xl border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            onValueChange={(projectType) =>
              onChange({ ...value, projectType: projectType as ProjectType })
            }
            options={PROJECT_TYPES.map((projectType) => ({
              label: projectType,
              value: projectType,
            }))}
          />
        </div>

        <Button
          className="h-11 w-full rounded-xl bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
          size="lg"
          disabled={isGenerating}
          onClick={onSubmit}
        >
          <Sparkles className="size-4" />
          {isGenerating ? "Generating..." : "Generate Project"}
        </Button>
      </CardContent>
    </Card>
  )
}