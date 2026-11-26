import { NavIdentity } from "@gorth-com/primitive/dashboard/nav-user"
import Link from "next/link"
import { Button } from "@gorth-com/primitive/custom/button"

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
      <NavIdentity
        user={{ name: name, avatar: avatar }}
        description={`@${handle.replace(/^@/, "")}`}
        url={`/profile/${encodeURIComponent(handle.replace(/^@/, ""))}`}
        hover
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
