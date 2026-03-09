import { buildProjectPrompt } from "@/utils/prompt"
import type { ProjectInput } from "@/types/project"

const GEMINI_MODEL = "gemini-2.5-flash"

type GeminiPart = { text?: string }
type GeminiCandidate = {
  content?: {
    parts?: GeminiPart[]
  }
}
type GeminiResponse = {
  candidates?: GeminiCandidate[]
  error?: {
    message?: string
  }
}

export async function generateProject(input: ProjectInput): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY

  if (!apiKey) {
    throw new Error(
      "Missing Gemini API key. Set NEXT_PUBLIC_GEMINI_API_KEY in your environment."
    )
  }

  const prompt = buildProjectPrompt(input)

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.4,
          topP: 0.9,
        },
      }),
    }
  )

  const data = (await response.json()) as GeminiResponse

  if (!response.ok) {
    throw new Error(data.error?.message ?? "Gemini request failed. Please try again.")
  }

  const markdown =
    data.candidates
      ?.flatMap((candidate) => candidate.content?.parts ?? [])
      .map((part) => part.text?.trim())
      .filter((text): text is string => Boolean(text))
      .join("\n\n") ?? ""

  if (!markdown) {
    throw new Error("Gemini returned an empty response. Please try generating again.")
  }

  return markdown
}

