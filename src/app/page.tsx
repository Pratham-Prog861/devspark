"use client"

import { ArrowRight, Loader2, Sparkles } from "lucide-react"
import { useEffect, useMemo, useState } from "react"

import { InputForm } from "@/components/input-form"
import { ResultCard } from "@/components/result-card"
import { SavedIdeas } from "@/components/saved-ideas"
import { ThemeToggleButton } from "@/components/ui/skiper-ui/skiper26"
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
    <main className="relative min-h-screen overflow-hidden bg-[#f4f7fb] px-4 py-6 text-slate-900 transition-colors sm:px-6 lg:px-10 lg:py-10 dark:bg-slate-950 dark:text-slate-100">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-0 h-80 w-80 rounded-full bg-sky-200/70 blur-3xl dark:bg-sky-900/30" />
        <div className="absolute -right-20 top-36 h-96 w-96 rounded-full bg-indigo-200/60 blur-3xl dark:bg-indigo-900/30" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-cyan-100/90 blur-3xl dark:bg-cyan-900/20" />
      </div>

      <div className="fixed right-5 top-5 z-50">
        <ThemeToggleButton className="border border-white/30 bg-slate-900 shadow-xl dark:bg-slate-100" />
      </div>

      <section className="relative mx-auto flex w-full max-w-7xl flex-col gap-6 lg:gap-8">
        <header className="rounded-3xl border border-white/70 bg-slate-900 px-6 py-8 text-white shadow-[0_30px_80px_-45px_rgba(2,6,23,0.85)] sm:px-8 sm:py-10 dark:border-slate-700 dark:bg-slate-900/90">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-sky-100">
            <Sparkles className="size-3.5" />
            AI GitHub Project Idea Generator
          </div>

          <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                DevSpark
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-200 sm:text-base">
                Generate rich, buildable project ideas with complete plans, folder
                structure, and a polished README ready for your next repository.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-slate-200">
              Production-ready flow
              <ArrowRight className="size-4" />
              Prompt to README
            </div>
          </div>
        </header>

        <div className="grid items-start gap-6 lg:grid-cols-[350px_minmax(0,1fr)] lg:gap-8">
          <aside className="space-y-6 lg:sticky lg:top-8">
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
          </aside>

          <section className="min-w-0 space-y-5 lg:pr-2 xl:pr-4">
            {isGenerating ? (
              <div className="rounded-3xl border border-white/80 bg-white/90 p-12 text-center shadow-[0_25px_80px_-50px_rgba(15,23,42,0.6)] dark:border-slate-700 dark:bg-slate-900/70">
                <Loader2 className="mx-auto size-8 animate-spin text-sky-600" />
                <p className="mt-4 text-sm font-medium text-slate-700 dark:text-slate-200">
                  Generating your project blueprint with Gemini...
                </p>
              </div>
            ) : null}

            {error ? (
              <div className="rounded-2xl border border-rose-300 bg-rose-50 px-5 py-4 text-sm text-rose-700 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-200">
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
                <div className="rounded-3xl border border-white/70 bg-white/65 p-10 text-center shadow-[0_20px_60px_-40px_rgba(15,23,42,0.6)] backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/55">
                  <p className="mx-auto max-w-lg text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
                    Choose your skill profile, difficulty, and project type. Then click
                    Generate Project to create a complete idea pack you can ship.
                  </p>
                </div>
              )
            )}
          </section>
        </div>
      </section>
    </main>
  )
}
