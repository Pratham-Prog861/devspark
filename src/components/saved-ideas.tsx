"use client"

import { Bookmark, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { GeneratedIdea } from "@/types/project"

type SavedIdeasProps = {
  ideas: GeneratedIdea[]
  onLoad: (idea: GeneratedIdea) => void
  onDelete: (id: string) => void
}

export function SavedIdeas({ ideas, onLoad, onDelete }: SavedIdeasProps) {
  return (
    <Card className="border-white/80 bg-white/85 dark:border-slate-700 dark:bg-slate-900/70">
      <CardHeader className="pb-1">
        <CardTitle className="text-xl text-slate-900 dark:text-slate-100">Saved Ideas</CardTitle>
        <CardDescription className="text-slate-600 dark:text-slate-300">
          {ideas.length === 0
            ? "You have no saved ideas yet."
            : `${ideas.length} idea${ideas.length > 1 ? "s" : ""} saved locally.`}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3">
        {ideas.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 p-5 text-sm text-slate-500 dark:text-slate-400 dark:border-slate-700 dark:bg-slate-800/60">
            Save generated ideas to quickly revisit, compare, and share later.
          </div>
        ) : (
          ideas.map((idea) => (
            <div
              key={idea.id}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800/70"
            >
              <p className="line-clamp-1 font-semibold text-slate-900 dark:text-slate-100">{idea.title}</p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {idea.input.skill} - {idea.input.level} - {idea.input.projectType}
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                <Button size="sm" variant="outline" onClick={() => onLoad(idea)}>
                  <Bookmark className="size-4" />
                  Load
                </Button>
                <Button size="sm" variant="destructive" onClick={() => onDelete(idea.id)}>
                  <Trash2 className="size-4" />
                  Delete
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}