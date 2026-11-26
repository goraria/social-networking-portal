"use client"

import type { ReactNode } from "react"
import { SidebarInset, SidebarProvider } from "@gorth/primitive/custom/sidebar"
import { AppSidebar } from "@gorth/primitive/dashboard/app-sidebar"
import { suggestedProfiles } from "@/components/social/data"
import { useAuth } from "@/hooks/use-auth"
import { useUser } from "@/hooks/use-user"
import { AuthGuard } from "@/layouts/guard"
import { Header } from "@/layouts/header"
import { Toolbar } from "@/layouts/toolbar"
import { socialSidebar, visitor } from "@/utils/constant"

export default function MainLayout({ children }: { children: ReactNode }) {
  const auth = useAuth()
  const { user } = useUser()
  const currentUser = user ?? visitor
  const handle = `@${currentUser.email.split("@")[0] || "visitor"}`

  return (
    <AuthGuard>
      <SidebarProvider>
        <AppSidebar
          data={{ ...socialSidebar, user: currentUser }}
          auth={auth}
        />
        <SidebarInset>
          <Header />
          <main className="flex flex-1 flex-col">
            <div className="container mx-auto p-6">
              <div className="grid w-full gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
                {children}
                <Toolbar
                  currentUser={{
                    name: currentUser.name,
                    handle,
                    avatar: currentUser.avatar,
                  }}
                  suggestions={suggestedProfiles}
                />
              </div>
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </AuthGuard>
  )
}
