import type { Metadata } from "next"
import { JetBrains_Mono, Space_Grotesk } from "next/font/google"

import { Providers } from "@/components/providers"
import { cn } from "@/lib/utils"

import "./globals.css"

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
})

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "DevSpark | AI GitHub Project Idea Generator",
  description:
    "Generate production-ready GitHub project ideas with AI, complete with development plans and README content.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("font-sans", spaceGrotesk.variable)}
    >
      <body
        className={`${spaceGrotesk.variable} ${jetBrainsMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
