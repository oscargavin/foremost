import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "font-sans border-input placeholder:text-muted-foreground aria-invalid:ring-destructive/20 aria-invalid:border-destructive flex field-sizing-content min-h-16 w-full rounded-md border bg-background-card px-3 py-2 text-base transition-colors disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:outline-none focus-visible:border-accent-orange focus-visible:ring-accent-orange/30 focus-visible:ring-[3px]",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
