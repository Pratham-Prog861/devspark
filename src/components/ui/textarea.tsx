import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "bg-background focus-visible:border-ring focus-visible:ring-ring/30 min-h-28 w-full rounded-xl border border-input px-3 py-2 text-sm outline-none focus-visible:ring-3 disabled:cursor-not-allowed disabled:opacity-60",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }