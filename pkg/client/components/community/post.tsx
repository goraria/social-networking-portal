import type { ReactNode } from "react"
import { Card } from "@gorth/primitive/default/card"

interface PostProps {
  header: ReactNode
  content: ReactNode
  footer: ReactNode
}

export function Post({ header, content, footer }: PostProps) {
  return (
    <Card size="sm" className="gap-4">
      <div className="px-4">{header}</div>
      <div className="px-4">{content}</div>
      <div className="px-4">{footer}</div>
    </Card>
  )
}
