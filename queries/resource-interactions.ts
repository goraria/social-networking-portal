"use client"


import {
  createMutationService,
  createQueryService,
  defineMutation,
  defineQuery,
  type HttpMethod,
} from "@/utils/caller"
import { useAuth } from "@/hooks/use-auth"

export interface ResourceTarget {
  subject?: string
  resourceId: string
  resourceType: string
}

export interface ResourceInteractionSummary {
  resource: { id: string } | null
  reactions: Array<{ type: string; count: number }>
  rating: {
    resourceId: string | null
    ratingCount: number
    averageRating: string
    distribution: Record<string, number>
  }
}

export interface ResourceInteractionState {
  followed: { notificationLevel: string } | null
  subscribed: { notificationLevel: string } | null
  saves: Array<"bookmark" | "favorite">
  reaction: string | null
  rating: number | null
}

export interface ResourceComment {
  id: string
  resourceId: string
  rootId: string | null
  parentId: string | null
  content: string
  reactionCount: number
  replyCount: number
  createdAt: string
  updatedAt: string
  author: {
    id: string
    name: string
    username: string | null
    image: string | null
  }
}

export interface ResourceCommentsResponse {
  data: ResourceComment[]
  pagination: {
    limit: number
    offset: number
    total: number
    hasMore: boolean
  }
}

export interface ResourceInteractionMutation extends ResourceTarget {
  action:
    | "reaction"
    | "vote"
    | "bookmark"
    | "rating"
    | "follow"
    | "subscribe"
    | "share"
    | "report"
  method: Extract<HttpMethod, "POST" | "PUT" | "DELETE">
  body?: unknown
}

export interface ResourceCommentMutation extends ResourceTarget {
  commentId?: string
  action: "create" | "update" | "delete" | "react" | "remove-reaction"
  body?: unknown
}

export const resourceInteractionQueryKey = ["resource-interaction"] as const
export const resourceCommentQueryKey = ["resource-comment"] as const

function resourcePath(action: string, resourceType: string) {
  return `/external/resource/${action}/${encodeURIComponent(resourceType)}`
}

const summaryService = defineQuery<ResourceInteractionSummary, ResourceTarget>({
  queryKey: ({ resourceId, resourceType, subject }) =>
    [
      ...resourceInteractionQueryKey,
      "summary",
      resourceType,
      resourceId,
      subject,
    ] as const,
  query: ({ resourceId, resourceType }) => ({
    url: resourcePath("summary", resourceType),
    method: "GET",
    auth: false,
    params: { id: resourceId },
  }),
  queryOptions: ({ resourceId }) => ({
    enabled: Boolean(resourceId),
    staleTime: 15_000,
  }),
})

const stateService = defineQuery<
  ResourceInteractionState,
  ResourceTarget & { enabled: boolean }
>({
  queryKey: ({ resourceId, resourceType, subject }) =>
    [
      ...resourceInteractionQueryKey,
      "state",
      resourceType,
      resourceId,
      subject,
    ] as const,
  query: ({ resourceId, resourceType }) => ({
    url: resourcePath("state", resourceType),
    method: "GET",
    params: { id: resourceId },
  }),
  queryOptions: ({ resourceId, enabled }) => ({
    enabled: enabled && Boolean(resourceId),
    retry: false,
    staleTime: 15_000,
  }),
})

const commentsService = defineQuery<
  ResourceCommentsResponse,
  ResourceTarget & {
    limit?: number
    offset?: number
    parentId?: string
    enabled?: boolean
  }
>({
  queryKey: ({
    resourceId,
    resourceType,
    limit = 50,
    offset = 0,
    parentId,
    subject,
  }) =>
    [
      ...resourceCommentQueryKey,
      resourceType,
      resourceId,
      limit,
      offset,
      parentId,
      subject,
    ] as const,
  query: ({ resourceId, resourceType, limit = 50, offset = 0, parentId }) => ({
    url: resourcePath("comment", resourceType),
    method: "GET",
    auth: false,
    unwrapData: false,
    params: {
      id: resourceId,
      limit,
      offset,
      ...(parentId ? { parentId } : {}),
    },
  }),
  queryOptions: ({ resourceId, enabled = true }) => ({
    enabled: enabled && Boolean(resourceId),
    staleTime: 10_000,
  }),
})

const interactionMutationService = defineMutation<
  unknown,
  ResourceInteractionMutation
>({
  query: ({ resourceId, resourceType, action, method, body }) => ({
    url:
      action === "report"
        ? `/internal/social/post/${resourceId}/report`
        : resourcePath(action === "reaction" ? "react" : action, resourceType),
    method,
    body,
    params: {
      id: resourceId,
      ...(action === "bookmark" ? { list: "bookmark" } : {}),
    },
    toast: { error: (error) => error.message },
  }),
  invalidates: (_data, { resourceId, resourceType }) => [
    [...resourceInteractionQueryKey, "summary", resourceType, resourceId],
    [...resourceInteractionQueryKey, "state", resourceType, resourceId],
  ],
})

const commentMutationService = defineMutation<unknown, ResourceCommentMutation>({
  query: ({ resourceId, resourceType, commentId, action, body }) => {
    const isReaction = action === "react" || action === "remove-reaction"
    return {
      url: isReaction
        ? "/external/resource/react/comment"
        : resourcePath("comment", resourceType),
      method:
        action === "update"
          ? "PATCH"
          : action === "delete" || action === "remove-reaction"
            ? "DELETE"
            : action === "react"
              ? "PUT"
              : "POST",
      body,
      params: isReaction
        ? { id: commentId }
        : { id: resourceId, ...(commentId ? { comment: commentId } : {}) },
      toast: { error: (error) => error.message },
    }
  },
  invalidates: (_data, { resourceId, resourceType }) => [
    [...resourceCommentQueryKey, resourceType, resourceId],
  ],
})

const useSummary = createQueryService(summaryService),
  useStateQuery = createQueryService(stateService),
  useComments = createQueryService(commentsService)
export function useResourceInteractionSummaryQuery(input: ResourceTarget) {
  const auth = useAuth()
  return useSummary({ ...input, subject: auth.account?.id })
}
export function useResourceInteractionStateQuery(
  input: ResourceTarget & { enabled: boolean }
) {
  const auth = useAuth()
  return useStateQuery({ ...input, subject: auth.account?.id })
}
export function useResourceCommentsQuery(
  input: ResourceTarget & {
    limit?: number
    offset?: number
    parentId?: string
    enabled?: boolean
  }
) {
  const auth = useAuth()
  return useComments({ ...input, subject: auth.account?.id })
}
export const useResourceInteractionMutation = createMutationService(
  interactionMutationService
)
export const useResourceCommentMutation = createMutationService(
  commentMutationService
)
