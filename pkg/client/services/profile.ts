"use client"

import { createQueryService, useQuery } from "@/utils/caller"

export interface SocialProfile {
  userId: string
  handle: string
  bio: string | null
  coverImage: string | null
  website: string | null
  location: string | null
  displayCategory: string | null
  pronouns: string | null
  visibility: "public" | "followers" | "friends" | "private"
  followerCount: number
  followingCount: number
  postCount: number
}

export interface CurrentProfileQueryInput {
  enabled: boolean
  userId?: string
}

export const currentProfileQueryKey = ["profile", "current"] as const

const currentProfileService = useQuery<
  SocialProfile,
  CurrentProfileQueryInput
>({
  queryKey: ({ userId }) => [...currentProfileQueryKey, userId] as const,
  query: {
    url: "/proxy/social/profile/me",
    baseURL: null,
    method: "GET",
  },
  queryOptions: ({ enabled, userId }) => ({
    enabled: enabled && Boolean(userId),
    retry: false,
    staleTime: 5 * 60 * 1000,
  }),
})

export const useCurrentProfileQuery = createQueryService(
  currentProfileService
)
