import type { ReactNode } from "react"
import { Dot } from "@gorth/primitive/cores/lucide"

interface TweetProps {
  header: ReactNode
  content: ReactNode
  footer: ReactNode
}

export function Tweet({ header, content, footer }: TweetProps) {
  return (
    <article className="relative flex flex-col gap-4 border-t pt-4">
      {header}
      <div className="relative min-w-0">
        <span
          className="absolute inset-y-0 left-4 w-px bg-foreground/24"
          aria-hidden
        />
        {content}
      </div>
      {footer}
    </article>
  )
}
