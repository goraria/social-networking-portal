"use client"

import { useState } from "react"
import Link from "next/link"
import type { LucideIcon } from "@gorth/primitive/cores/lucide"
import {
  Bot,
  Bookmark,
  CalendarDays,
  ChartNoAxesCombined,
  ChevronDown,
  ChevronUp,
  Clapperboard,
  Clock3,
  CreditCard,
  Flag,
  Gamepad2,
  Gift,
  Images,
  Megaphone,
  MessageCircle,
  Newspaper,
  Sparkles,
  Store,
  Users,
  UsersRound,
} from "@gorth/primitive/cores/lucide"
import { Button } from "@gorth/primitive/custom/button"
import { Card } from "@gorth/primitive/default/card"
import { useLayout } from "@gorth/primitive/providers/layout"
import { cn } from "@gorth/primitive/cores/cn"
import { People } from "@/components/social/people"
import type { SuggestedProfileData } from "@/components/social/data"
import { Separator } from "@gorth/primitive/default/separator"

interface ToolbarProps {
  currentUser: {
    name: string
    handle: string
    avatar?: string | null
  }
  suggestions: SuggestedProfileData[]
}

interface ToolbarShortcut {
  title: string
  href: string
  icon: LucideIcon
  iconClassName: string
}

const visibleShortcutCount = 5

const toolbarShortcuts: ToolbarShortcut[] = [
  { title: "Gorth AI", href: "#", icon: Sparkles, iconClassName: "text-violet-500" },
  { title: "Friends", href: "#", icon: Users, iconClassName: "text-sky-500" },
  { title: "Dashboard", href: "#", icon: ChartNoAxesCombined, iconClassName: "text-blue-500" },
  { title: "Saved", href: "/saved", icon: Bookmark, iconClassName: "text-fuchsia-500" },
  { title: "Memories", href: "#", icon: Clock3, iconClassName: "text-cyan-500" },
  { title: "Groups", href: "#", icon: UsersRound, iconClassName: "text-blue-500" },
  { title: "Shorts", href: "/explore", icon: Clapperboard, iconClassName: "text-rose-500" },
  { title: "Feed", href: "/", icon: Newspaper, iconClassName: "text-sky-500" },
  // { title: "Chat with AI", href: "#", icon: Bot, iconClassName: "text-indigo-500" },
  // { title: "Play Game", href: "#", icon: Gamepad2, iconClassName: "text-blue-500" },
  { title: "Orders and Payments", href: "#", icon: CreditCard, iconClassName: "text-indigo-500" },
  // { title: "Your Activity with Ads", href: "#", icon: Images, iconClassName: "text-sky-500" },
  { title: "Marketplace", href: "#", icon: Store, iconClassName: "text-cyan-500" },
  { title: "Messenger", href: "#", icon: MessageCircle, iconClassName: "text-blue-500" },
  // { title: "Messenger Kids", href: "#", icon: MessageCircle, iconClassName: "text-emerald-500" },
  { title: "Birthdays", href: "#", icon: Gift, iconClassName: "text-pink-500" },
  { title: "Events", href: "#", icon: CalendarDays, iconClassName: "text-rose-500" },
  { title: "Pages", href: "#", icon: Flag, iconClassName: "text-orange-500" },
  // { title: "Advertising Manager", href: "#", icon: ChartNoAxesCombined, iconClassName: "text-blue-500" },
  // { title: "Advertising Center", href: "#", icon: Megaphone, iconClassName: "text-sky-500" },
  // { title: "Game Videos", href: "#", icon: Gamepad2, iconClassName: "text-cyan-500" },
]

export function Toolbar({ currentUser, suggestions }: ToolbarProps) {
  const { navbarBehavior, variant } = useLayout()
  const [showAll, setShowAll] = useState(false)
  const shortcuts = showAll
    ? toolbarShortcuts
    : toolbarShortcuts.slice(0, visibleShortcutCount)

  return (
    <aside className="hidden w-90 min-w-90 md:block">
      <div
        className={cn(
          "sticky min-h-0 overflow-hidden",
          navbarBehavior === "scroll" && "top-0 h-svh",
          navbarBehavior === "sticky" &&
            variant !== "floating" &&
            "top-20 h-[calc(100svh-5rem)]",
          navbarBehavior === "sticky" &&
            variant === "floating" &&
            "top-24 h-[calc(100svh-6rem)]"
        )}
      >
        <div className="h-full overflow-y-auto scrollbar-none [&::-webkit-scrollbar]:hidden">
          <People
            name={currentUser.name}
            handle={currentUser.handle}
            avatar={currentUser.avatar}
            actionLabel="View"
            actionHref="/profile"
          />

          <section>
            <div className="flex items-center justify-between">
              <h2 className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                People to follow
              </h2>
              <Button variant="link" className="px-2 text-xs">
                See all
              </Button>
            </div>
            <div className="flex flex-col gap-2">
              {suggestions.map((profile) => (
                <People
                  key={profile.id}
                  name={profile.name}
                  handle={profile.handle}
                  avatar={profile.avatar}
                  actionLabel="Follow"
                />
              ))}
            </div>
          </section>

          <Separator className="my-4" />

          <nav className="" aria-label="Social shortcuts">
            <div className="flex flex-col gap-1">
              {shortcuts.map((shortcut) => {
                const Icon = shortcut.icon

                return (
                  <Button
                    key={shortcut.title}
                    nativeButton={false}
                    render={<Link href={shortcut.href} />}
                    variant="ghost"
                    className="w-full justify-start gap-2.5 p-2.5"
                  >
                    <Icon className={`size-4 ${shortcut.iconClassName}`} />
                    <span className="truncate">{shortcut.title}</span>
                  </Button>
                )
              })}
            </div>

            <Button
              type="button"
              variant="ghost"
              className="mt-1 w-full justify-start gap-3 px-2"
              onClick={() => setShowAll((current) => !current)}
            >
              {showAll ? (
                <ChevronUp className="size-5" />
              ) : (
                <ChevronDown className="size-5" />
              )}
              {showAll ? "Show less" : "Show more"}
            </Button>
          </nav>

          <Separator className="my-4" />

          <p className="text-muted-foreground pb-6 text-xs leading-5">
            About · Help · Privacy · Terms
            <br />© 2026 Loop Social
          </p>
        </div>
      </div>
    </aside>
  )
}
