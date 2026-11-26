"use client"

import { z } from "@gorth/structure/cores/zod"

import {
  createMutationService,
  createQueryService,
  useMutation,
  useQuery,
} from "@/utils/caller"
import {
  createPostSchema,
  postSchema,
  type CreatePostInput,
  type Post,
} from "@/schemas/post"

export const postQueryKey = ["post", "list"] as const

interface PostListInput {
  enabled: boolean
  limit?: number
}

const postListService = useQuery<Post[], PostListInput>({
  queryKey: ({ limit = 50 }) => [...postQueryKey, { limit }] as const,
  query: ({ limit = 50 }) => ({
    url: "/proxy/social/post",
    baseURL: null,
    method: "GET",
    params: { limit },
    schema: z.array(postSchema),
  }),
  queryOptions: ({ enabled }) => ({
    enabled,
    retry: false,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  }),
})

const createPostService = useMutation<Post, CreatePostInput>({
  query: (input) => ({
    url: "/proxy/social/post",
    baseURL: null,
    method: "POST",
    body: createPostSchema.parse(input),
    schema: postSchema,
  }),
  invalidates: [postQueryKey],
})

export const usePostList = createQueryService(postListService)
export const useCreatePost = createMutationService(createPostService)
