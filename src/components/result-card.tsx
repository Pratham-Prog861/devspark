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

const WORD_KEYWORDS = new Set([
  "import",
  "from",
  "export",
  "default",
  "function",
  "return",
  "if",
  "else",
  "for",
  "while",
  "switch",
  "case",
  "break",
  "continue",
  "new",
  "const",
  "let",
  "var",
  "class",
  "extends",
  "async",
  "await",
  "try",
  "catch",
  "finally",
  "throw",
  "in",
  "of",
])

const TYPE_KEYWORDS = new Set([
  "type",
  "interface",
  "enum",
  "implements",
  "public",
  "private",
  "protected",
  "readonly",
  "as",
  "keyof",
  "typeof",
])

const CONSTANT_KEYWORDS = new Set(["true", "false", "null", "undefined"])

const SUPPORTED_LANGUAGES = new Set([
  "js",
  "jsx",
  "ts",
  "tsx",
  "json",
  "bash",
  "sh",
  "zsh",
  "python",
  "py",
  "java",
  "html",
  "css",
  "sql",
])

const TOKEN_REGEX =
  /\/\/[^\n]*|\/\*[\s\S]*?\*\/|#.*$|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|\b\d+(?:\.\d+)?\b|\b[A-Za-z_][A-Za-z0-9_]*\b|[{}()[\].,:;=<>+\-*/%!?|&]/gm

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
}

function shouldHighlight(language: string) {
  return SUPPORTED_LANGUAGES.has(language)
}

function getTokenClass(token: string): string | null {
  if (/^(\/\/|\/\*|#)/.test(token)) {
    return "code-comment"
  }

  if (/^('|"|`)/.test(token)) {
    return "code-string"
  }

  if (/^\d/.test(token)) {
    return "code-number"
  }

  if (TYPE_KEYWORDS.has(token)) {
    return "code-typekw"
  }

  if (WORD_KEYWORDS.has(token)) {
    return "code-keyword"
  }

  if (CONSTANT_KEYWORDS.has(token)) {
    return "code-constant"
  }

  if (/^[A-Z][A-Za-z0-9_]*$/.test(token)) {
    return "code-type"
  }

  if (/^[{}()[\].,:;=<>+\-*/%!?|&]$/.test(token)) {
    return "code-operator"
  }

  return null
}

function highlightCode(source: string) {
  let highlighted = ""
  let cursor = 0

  for (const match of source.matchAll(TOKEN_REGEX)) {
    const token = match[0]
    const start = match.index ?? 0

    if (start > cursor) {
      highlighted += escapeHtml(source.slice(cursor, start))
    }

    const tokenClass = getTokenClass(token)
    const escapedToken = escapeHtml(token)

    highlighted += tokenClass
      ? `<span class="${tokenClass}">${escapedToken}</span>`
      : escapedToken

    cursor = start + token.length
  }

  if (cursor < source.length) {
    highlighted += escapeHtml(source.slice(cursor))
  }

  return highlighted
}

function extractReadmeSection(markdown: string): string {
  const lines = markdown.split(/\r?\n/)
  const headingRegex = /^#{1,6}\s*(?:\d+[.)\-:]?\s*)?(?:\*\*)?Complete GitHub README\.md(?:\*\*)?\s*$/i
  const startHeadingIndex = lines.findIndex((line) => headingRegex.test(line.trim()))

  if (startHeadingIndex === -1) {
    return markdown.trim()
  }

  const currentHeadingLevel = lines[startHeadingIndex].match(/^#+/)?.[0].length ?? 2
  const sectionLines: string[] = []

  for (let index = startHeadingIndex + 1; index < lines.length; index += 1) {
    const line = lines[index]
    const headingMatch = line.trim().match(/^(#{1,6})\s+/)

    if (headingMatch) {
      const nextHeadingLevel = headingMatch[1].length
      if (nextHeadingLevel <= currentHeadingLevel) {
        break
      }
    }

    sectionLines.push(line)
  }

  return sectionLines.join("\n").trim()
}

function unwrapFencedMarkdown(content: string): string {
  const fencedMatch = content.match(/^```(?:md|markdown)?\s*\n([\s\S]*?)\n```\s*$/i)
  if (!fencedMatch?.[1]) {
    return content.trim()
  }

  return fencedMatch[1].trim()
}

function ensureMitLicenseSection(content: string): string {
  if (/^#{1,6}\s*MIT License\s*$/im.test(content)) {
    return content.trim()
  }

  return `${content.trim()}\n\n## MIT License\n\nThis project is licensed under the MIT License.`
}

export function ResultCard({ idea, onSave, isSaved }: ResultCardProps) {
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">("idle")

  const readmeText = useMemo(() => {
    const rawSection = extractReadmeSection(idea.markdown)
    const unwrapped = unwrapFencedMarkdown(rawSection)
    return ensureMitLicenseSection(unwrapped)
  }, [idea.markdown])

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
    <Card className="border-white/80 bg-white/90 dark:border-slate-700 dark:bg-slate-900/75">
      <CardHeader className="gap-3">
        <div>
          <CardTitle className="text-2xl text-slate-900 dark:text-slate-100">Generated Idea</CardTitle>
          <CardDescription className="mt-1 text-slate-600 dark:text-slate-300">
            {idea.input.skill} - {idea.input.level} - {idea.input.projectType}
          </CardDescription>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/70">
          <div className="flex flex-wrap gap-2">
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
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-8">
        <div className="max-w-[92ch] space-y-4 break-words pr-2 text-[15px] leading-7 text-slate-700 dark:text-slate-200 md:pr-4 xl:pr-6 [&_h1]:mt-10 [&_h1]:text-3xl [&_h1]:font-semibold [&_h1]:tracking-tight [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-semibold [&_h3]:mt-7 [&_h3]:text-xl [&_h3]:font-semibold [&_li]:ml-5 [&_li]:list-disc [&_ol]:ml-5 [&_ol]:list-decimal [&_p]:break-words [&_p]:text-slate-700 dark:[&_p]:text-slate-200 [&_code]:rounded-md [&_code]:bg-slate-100 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-xs [&_code]:text-slate-900 [&_pre_code]:rounded-none [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-inherit">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ className, children, ...props }) {
                const languageMatch = /language-([\w-]+)/.exec(className ?? "")
                const language = (languageMatch?.[1] ?? "").toLowerCase()
                const codeText = String(children).replace(/\n$/, "")

                if (!className?.includes("language-")) {
                  return (
                    <code
                      className="rounded-md bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-slate-900"
                      {...props}
                    >
                      {children}
                    </code>
                  )
                }

                const highlighted = shouldHighlight(language)
                  ? highlightCode(codeText)
                  : escapeHtml(codeText)

                return (
                  <div className="my-5 overflow-hidden rounded-2xl border border-slate-800 bg-[#090b16] shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
                    <div className="flex items-center justify-between border-b border-slate-700/70 bg-[#111827] px-4 py-2 text-[11px] uppercase tracking-[0.14em] text-slate-400">
                      <span>{language || "code"}</span>
                      <span>snippet</span>
                    </div>
                    <pre className="overflow-x-auto p-4 text-[14px] leading-7 text-slate-100 md:p-5">
                      <code
                        className="block min-w-full bg-transparent font-mono text-slate-100"
                        dangerouslySetInnerHTML={{ __html: highlighted }}
                      />
                    </pre>
                  </div>
                )
              },
            }}
          >
            {idea.markdown}
          </ReactMarkdown>
        </div>

        <div className="space-y-2 pr-2 md:pr-4 xl:pr-6">
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">README Quick Preview</p>
          <Textarea
            readOnly
            value={readmeText}
            className="min-h-52 rounded-2xl border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800 font-mono text-xs"
          />
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {copyStatus === "copied"
              ? "README copied to clipboard."
              : copyStatus === "error"
                ? "Clipboard access failed in this browser context."
                : "Use copy or download to export your README.md instantly."}
          </p>
        </div>
      </CardContent>

      <CardFooter className="text-xs text-slate-500 dark:text-slate-400">
        Generated by Gemini and rendered as structured markdown.
      </CardFooter>
    </Card>
  )
}
