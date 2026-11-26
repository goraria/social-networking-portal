"use client"
import { useEffect, type ReactNode } from "react"
import { useQueryClient } from "@gorth-com/primitive/cores/tanstack/query"
import { useAuth } from "@/hooks/use-auth"
export function SocialDataProvider({ children }: { children: ReactNode }) {
  const client = useQueryClient(),
    auth = useAuth()
  useEffect(() => {
    for (const prefix of [
      "social",
      "resource-interaction",
      "resource-comment",
    ]) {
      client.removeQueries({ queryKey: [prefix], type: "inactive" })
    }
  }, [auth.account?.id, client])
  useEffect(() => {
    function refresh(event: Event) {
      const privacy = Boolean(
        (event as CustomEvent<{ privacy: boolean }>).detail?.privacy
      )
      for (const prefix of [
        "social",
        "resource-interaction",
        "resource-comment",
      ]) {
        if (privacy) {
          void client
            .cancelQueries({ queryKey: [prefix] })
            .then(() => client.resetQueries({ queryKey: [prefix] }))
        } else void client.invalidateQueries({ queryKey: [prefix] })
      }
    }
    window.addEventListener("social:data-changed", refresh)
    return () => window.removeEventListener("social:data-changed", refresh)
  }, [client])
  return children
}
