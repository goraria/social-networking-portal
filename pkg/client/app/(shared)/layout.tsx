"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { Button } from "@gorth/primitive/custom/button"
import { SidebarProvider } from "@gorth/primitive/custom/sidebar"
import { Footer } from "@gorth/primitive/layouts/footer"
import { Header } from "@gorth/primitive/layouts/header"
import { useAuth } from "@/hooks/use-auth"
import { useUser } from "@/hooks/use-user"
import { sharedNavbar, visitor } from "@/utils/constant"

export default function SharedLayout({ children }: { children: ReactNode }) {
  const auth = useAuth()
  const { user } = useUser()

  return (
    <SidebarProvider>
      <div className="flex min-h-svh flex-1 flex-col bg-background text-foreground">
        <Header
          auth={auth}
          user={user ?? visitor}
          nav={{
            main: sharedNavbar.navDropdown,
            secondary: sharedNavbar.navSignal,
            navigation: sharedNavbar.navigation,
          }}
          bottom={
            <Button
              nativeButton={false}
              render={<Link href="/" />}
              variant="ghost"
              className="px-0 text-lg font-bold hover:bg-transparent"
            >
              Loop Social
            </Button>
          }
        />

        <main className="container mx-auto flex w-full flex-1 flex-col px-6 py-10">
          {children}
        </main>

        <Footer
          nav={{
            main: sharedNavbar.navMain,
            secondary: sharedNavbar.navSecondary,
          }}
          top={
            <Button
              nativeButton={false}
              render={<Link href="/" />}
              variant="ghost"
              className="px-0 text-lg font-bold hover:bg-transparent"
            >
              Loop Social
            </Button>
          }
          middle="A focused place to share ideas, follow conversations, and stay connected."
          bottom={
            <div className="flex w-full items-center justify-between gap-4 text-sm">
              <span>© {new Date().getFullYear()} Gorth, Inc.</span>
              <span className="hidden sm:inline">
                Conversations that belong to you.
              </span>
            </div>
          }
        />
      </div>
    </SidebarProvider>
  )
}
