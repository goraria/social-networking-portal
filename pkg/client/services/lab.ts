"use client"

import { createQueryService, useQuery } from "@/utils/caller"

export const useLabAuthQuery = createQueryService(
  useQuery<unknown, boolean>({
    queryKey: (authenticated) => ["lab", "auth", authenticated] as const,
    query: { url: "/lab", method: "GET" },
    queryOptions: (authenticated) => ({
      enabled: authenticated,
      retry: false,
    }),
  })
)
