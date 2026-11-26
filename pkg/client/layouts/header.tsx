"use client"

import Link from "next/link"
import { Button } from "@gorth/primitive/custom/button"
import { SidebarTrigger } from "@gorth/primitive/custom/sidebar"
import { Header as PrimitiveHeader } from "@gorth/primitive/layouts/header"

import { useAuth } from "@/hooks/use-auth"
import { useUser } from "@/hooks/use-user"
import { socialSidebar, visitor } from "@/utils/constant"

export function Header() {
  const auth = useAuth()
  const { user } = useUser()

  return (
    <PrimitiveHeader
      mode="dashboard"
      user={user ?? visitor}
      auth={auth}
      nav={{
        main: socialSidebar.navDropdown,
        secondary: socialSidebar.navSignal,
        navigation: socialSidebar.navMain,
      }}
      left={
        <>
          <SidebarTrigger className="size-9 rounded-md" />
          <Button
            nativeButton={false}
            render={<Link href="/post" />}
            variant="ghost"
            className="text-base font-semibold"
          >
            Posts
          </Button>
        </>
      }
    />
  )
}
