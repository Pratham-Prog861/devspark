"use client"

import { Loader2, Sparkles } from "lucide-react"
import { useEffect, useMemo, useState } from "react"

import { InputForm } from "@/components/input-form"
import { ResultCard } from "@/components/result-card"
import { SavedIdeas } from "@/components/saved-ideas"
import { generateProject } from "@/lib/generateProject"
import {
  type GeneratedIdea,
  type ProjectInput,
  DIFFICULTY_LEVELS,
  PROJECT_TYPES,
  SKILLS,
} from "@/types/project"

const SAVED_IDEAS_STORAGE_KEY = "devspark.savedIdeas.v1"

function extractProjectTitle(markdown: string) {
  const sectionMatch = markdown.match(/#{1,6}\s*Project Title\s*[\r\n]+([^\r\n#].+)/i)
  if (sectionMatch?.[1]) {
    return sectionMatch[1].trim()
  }

  const firstSemanticHeading = markdown
    .split(/\r?\n/)
    .map((line) => line.trim())
    .find(
      (line) =>
        /^#{1,3}\s+/.test(line) &&
        !/project title|project description|problem it solves/i.test(line)
    )

  if (firstSemanticHeading) {
    return firstSemanticHeading.replace(/^#{1,3}\s+/, "").trim()
  }

  return "Untitled Project Idea"
}

function createIdea(input: ProjectInput, markdown: string): GeneratedIdea {
  return {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    title: extractProjectTitle(markdown),
    input,
    markdown,
  }
}

export default function Page() {
  const [input, setInput] = useState<ProjectInput>({
    skill: SKILLS[0],
    level: DIFFICULTY_LEVELS[0],
    projectType: PROJECT_TYPES[0],
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentIdea, setCurrentIdea] = useState<GeneratedIdea | null>(null)
  const [savedIdeas, setSavedIdeas] = useState<GeneratedIdea[]>([])

  useEffect(() => {
    const raw = localStorage.getItem(SAVED_IDEAS_STORAGE_KEY)
    if (!raw) {
      return
    }

    try {
      const parsed = JSON.parse(raw) as GeneratedIdea[]
      if (Array.isArray(parsed)) {
        setSavedIdeas(parsed)
      }
    } catch {
      localStorage.removeItem(SAVED_IDEAS_STORAGE_KEY)
    }
  }, [])

  const saveIdeas = (ideas: GeneratedIdea[]) => {
    setSavedIdeas(ideas)
    localStorage.setItem(SAVED_IDEAS_STORAGE_KEY, JSON.stringify(ideas))
  }

  const handleGenerate = async () => {
    setIsGenerating(true)
    setError(null)

    try {
      const markdown = await generateProject(input)
      setCurrentIdea(createIdea(input, markdown))
    } catch (generationError) {
      setError(
        generationError instanceof Error
          ? generationError.message
          : "Something went wrong while generating your project idea."
      )
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSaveCurrent = () => {
    if (!currentIdea) {
      return
    }

    const alreadySaved = savedIdeas.some((idea) => idea.id === currentIdea.id)
    if (alreadySaved) {
      return
    }

    saveIdeas([currentIdea, ...savedIdeas])
  }

  const handleLoadSaved = (idea: GeneratedIdea) => {
    setCurrentIdea(idea)
    setInput(idea.input)
    setError(null)
  }

  const handleDeleteSaved = (id: string) => {
    saveIdeas(savedIdeas.filter((idea) => idea.id !== id))
  }

  const isCurrentIdeaSaved = useMemo(
    () =>
      currentIdea ? savedIdeas.some((idea) => idea.id === currentIdea.id) : false,
    [currentIdea, savedIdeas]
  )

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-8 sm:px-6 lg:px-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(56,189,248,0.22),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(59,130,246,0.18),transparent_30%),linear-gradient(180deg,#0b1023_0%,#0a0f1f_55%,#111827_100%)]" />

      <section className="relative mx-auto flex w-full max-w-6xl flex-col gap-6">
        <header className="rounded-3xl border border-white/20 bg-white/10 px-6 py-8 text-white shadow-2xl shadow-black/20 backdrop-blur-2xl sm:px-8">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-3 py-1 text-xs uppercase tracking-[0.2em] text-cyan-100">
            <Sparkles className="size-3.5" />
            AI Developer Toolkit
          </div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            DevSpark
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-cyan-100 sm:text-base">
            Generate practical GitHub project ideas with structured planning,
            folder architecture, and a complete README.md that you can copy,
            download, save, and share instantly.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
          <div className="space-y-6">
            <InputForm
              value={input}
              isGenerating={isGenerating}
              onChange={setInput}
              onSubmit={handleGenerate}
            />
            <SavedIdeas
              ideas={savedIdeas}
              onLoad={handleLoadSaved}
              onDelete={handleDeleteSaved}
            />
          </div>

          <div className="space-y-6">
            {isGenerating ? (
              <div className="rounded-2xl border border-white/30 bg-white/90 p-12 text-center shadow-lg">
                <Loader2 className="mx-auto size-8 animate-spin text-sky-600" />
                <p className="mt-4 text-sm font-medium text-slate-700">
                  Generating your project roadmap with Gemini...
                </p>
              </div>
            ) : null}

            {error ? (
              <div className="rounded-2xl border border-red-300 bg-red-50 px-5 py-4 text-sm text-red-700">
                <p className="font-semibold">Could not generate project idea</p>
                <p className="mt-1">{error}</p>
              </div>
            ) : null}

            {currentIdea ? (
              <ResultCard
                idea={currentIdea}
                onSave={handleSaveCurrent}
                isSaved={isCurrentIdeaSaved}
              />
            ) : (
              !isGenerating && (
                <div className="rounded-2xl border border-dashed border-white/35 bg-white/10 p-10 text-center text-cyan-100 backdrop-blur-xl">
                  <p className="text-sm sm:text-base">
                    Select your preferences and click Generate Project to create your
                    first production-ready idea.
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
