"use client"

import { BookmarkPlus, Copy, Download, Linkedin, Twitter } from "lucide-react"
import { useMemo, useState } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import type { GeneratedIdea } from "@/types/project"

type ResultCardProps = {
  idea: GeneratedIdea
  onSave: () => void
  isSaved: boolean
}

function extractReadmeSection(markdown: string): string {
  const headingPattern = /^#{1,6}\s*Complete GitHub README\.md\s*$/gim
  const headingMatch = headingPattern.exec(markdown)

  if (!headingMatch) {
    return markdown.trim()
  }

  const startIndex = headingMatch.index + headingMatch[0].length
  const after = markdown.slice(startIndex).trim()
  const headingLevel = headingMatch[0].match(/^#+/)?.[0].length ?? 2
  const siblingHeadingPattern = new RegExp(`^#{${headingLevel}}\\s+`, "m")
  const nextHeadingFromStart = after.search(siblingHeadingPattern)
  const nextHeading =
    nextHeadingFromStart === 0
      ? after.slice(1).search(siblingHeadingPattern) + 1
      : nextHeadingFromStart

  if (nextHeading === -1) {
    return after
  }

  return after.slice(0, nextHeading).trim()
}

export function ResultCard({ idea, onSave, isSaved }: ResultCardProps) {
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">("idle")
  const readmeText = useMemo(() => extractReadmeSection(idea.markdown), [idea.markdown])

  const copyReadme = async () => {
    try {
      await navigator.clipboard.writeText(readmeText)
      setCopyStatus("copied")
      setTimeout(() => setCopyStatus("idle"), 1800)
    } catch {
      setCopyStatus("error")
      setTimeout(() => setCopyStatus("idle"), 2200)
    }
  }

  const downloadReadme = () => {
    const blob = new Blob([readmeText], { type: "text/markdown;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement("a")
    anchor.href = url
    anchor.download = "README.md"
    anchor.click()
    URL.revokeObjectURL(url)
  }

  const share = (platform: "twitter" | "linkedin") => {
    const url = window.location.href
    const text = `I generated a new project idea on DevSpark: ${idea.title}`

    if (platform === "twitter") {
      window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
        "_blank",
        "noopener,noreferrer"
      )
      return
    }

    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&summary=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer"
    )
  }

  return (
    <Card className="border-white/30 bg-white/90 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-xl">Generated Idea</CardTitle>
        <CardDescription>
          {idea.input.skill} • {idea.input.level} • {idea.input.projectType}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="max-w-none space-y-4 text-sm leading-relaxed text-slate-700 [&_h1]:mt-8 [&_h1]:text-3xl [&_h1]:font-semibold [&_h2]:mt-7 [&_h2]:text-2xl [&_h2]:font-semibold [&_h3]:mt-6 [&_h3]:text-xl [&_h3]:font-semibold [&_li]:ml-4 [&_li]:list-disc [&_ol]:ml-4 [&_ol]:list-decimal [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:border [&_pre]:border-zinc-200 [&_pre]:bg-zinc-950 [&_pre]:p-4 [&_pre]:text-xs [&_pre]:text-zinc-100 [&_code]:rounded [&_code]:bg-zinc-100 [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-xs [&_code]:text-zinc-900 [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-zinc-100">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{idea.markdown}</ReactMarkdown>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">README Quick Preview</p>
          <Textarea readOnly value={readmeText} className="min-h-44 font-mono text-xs" />
          <p className="text-xs text-muted-foreground">
            {copyStatus === "copied"
              ? "README copied to clipboard."
              : copyStatus === "error"
                ? "Clipboard access failed in this browser context."
                : "Use copy or download to export your README.md instantly."}
          </p>
        </div>
      </CardContent>

      <CardFooter className="flex flex-wrap gap-2">
        <Button variant="secondary" onClick={copyReadme}>
          <Copy className="size-4" />
          Copy README
        </Button>
        <Button variant="secondary" onClick={downloadReadme}>
          <Download className="size-4" />
          Download README
        </Button>
        <Button variant={isSaved ? "outline" : "default"} onClick={onSave}>
          <BookmarkPlus className="size-4" />
          {isSaved ? "Saved" : "Save Idea"}
        </Button>
        <Button variant="outline" onClick={() => share("twitter")}>
          <Twitter className="size-4" />
          Share on Twitter
        </Button>
        <Button variant="outline" onClick={() => share("linkedin")}>
          <Linkedin className="size-4" />
          Share on LinkedIn
        </Button>
      </CardFooter>
    </Card>
  )
}
