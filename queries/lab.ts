"use client"

import { createQueryService, defineQuery } from "@/utils/caller"

export const useLabAuthQuery = createQueryService(
  defineQuery<unknown, boolean>({
    queryKey: (authenticated) => ["lab", "auth", authenticated] as const,
    query: { url: "/internal/social/lab", method: "GET" },
    queryOptions: (authenticated) => ({
      enabled: authenticated,
      retry: false,
    }),
  })
)
