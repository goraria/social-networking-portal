import Link from "next/link"
import { Button } from "@gorth/primitive/custom/button"

import { Identify } from "@/components/community"

export interface PeopleProps {
  name: string
  handle: string
  avatar?: string | null
  actionLabel: string
  actionHref?: string
}

export function People({
  name,
  handle,
  avatar,
  actionLabel,
  actionHref,
}: PeopleProps) {
  return (
    <div className="flex min-h-10 items-center gap-3">
      <Identify
        name={name}
        username={handle}
        image={avatar}
        className="flex-1"
      />
      {actionHref ? (
        <Button
          nativeButton={false}
          render={<Link href={actionHref} />}
          variant="link"
          className="px-2 text-xs"
        >
          {actionLabel}
        </Button>
      ) : (
        <Button variant="link" className="px-2 text-xs">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
