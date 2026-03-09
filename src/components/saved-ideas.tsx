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
    <Card className="border-white/30 bg-white/85 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-xl">Saved Ideas</CardTitle>
        <CardDescription>
          {ideas.length === 0
            ? "You have no saved ideas yet."
            : `${ideas.length} idea${ideas.length > 1 ? "s" : ""} saved locally.`}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3">
        {ideas.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-300 p-5 text-sm text-muted-foreground">
            Save your favorite generated ideas to quickly revisit and share them later.
          </div>
        ) : (
          ideas.map((idea) => (
            <div
              key={idea.id}
              className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-4"
            >
              <div>
                <p className="font-semibold">{idea.title}</p>
                <p className="text-xs text-muted-foreground">
                  {idea.input.skill} • {idea.input.level} • {idea.input.projectType}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" onClick={() => onLoad(idea)}>
                  <Bookmark className="size-4" />
                  Load Idea
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => onDelete(idea.id)}
                >
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

