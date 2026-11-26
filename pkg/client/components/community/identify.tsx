import Link from "next/link"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@gorth/primitive/custom/avatar"
import { cn } from "@gorth/primitive/cores/cn"

import { getInitials } from "@/utils/formatter"

interface IdentifyAvatarProps {
  name: string
  src?: string | null
  size?: "default" | "sm" | "lg"
  className?: string
}

export function IdentifyAvatar({
  name,
  src,
  size = "default",
  className,
}: IdentifyAvatarProps) {
  return (
    <Avatar size={size} className={className}>
      <AvatarImage src={src ?? undefined} alt={name} />
      <AvatarFallback>{getInitials(name)}</AvatarFallback>
    </Avatar>
  )
}

interface IdentifyProps {
  name: string
  username: string
  image?: string | null
  className?: string
}

export function Identify({ name, username, image, className }: IdentifyProps) {
  const normalizedHandle = username.replace(/^@/, "")

  return (
    <div className={cn("flex min-w-0 items-center gap-2.5", className)}>
      <IdentifyAvatar
        name={name}
        src={image}
        className="size-9 rounded-md"
      />
      <div className="grid min-w-0 flex-1 text-left text-sm leading-tight">
        <Link
          href={`/profile/${encodeURIComponent(normalizedHandle)}`}
          className="truncate font-medium"
        >
          {name}
        </Link>
        <span className="truncate text-xs">@{normalizedHandle}</span>
      </div>
    </div>
  )
}
