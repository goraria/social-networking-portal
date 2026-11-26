"use client"

/* eslint-disable react-hooks/rules-of-hooks -- Service definitions build hooks without executing them. */

import {
  createMutationService,
  createQueryService,
  useMutation,
  useQuery,
  type HttpMethod,
} from "@/utils/caller"

export interface ResourceTarget {
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
  return `/resource/${action}/${encodeURIComponent(resourceType)}`
}

const summaryService = useQuery<ResourceInteractionSummary, ResourceTarget>({
  queryKey: ({ resourceId, resourceType }) =>
    [...resourceInteractionQueryKey, "summary", resourceType, resourceId] as const,
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

const stateService = useQuery<
  ResourceInteractionState,
  ResourceTarget & { enabled: boolean }
>({
  queryKey: ({ resourceId, resourceType }) =>
    [...resourceInteractionQueryKey, "state", resourceType, resourceId] as const,
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

const commentsService = useQuery<
  ResourceCommentsResponse,
  ResourceTarget & { limit?: number; offset?: number }
>({
  queryKey: ({ resourceId, resourceType, limit = 50, offset = 0 }) =>
    [...resourceCommentQueryKey, resourceType, resourceId, limit, offset] as const,
  query: ({ resourceId, resourceType, limit = 50, offset = 0 }) => ({
    url: resourcePath("comment", resourceType),
    method: "GET",
    auth: false,
    unwrapData: false,
    params: { id: resourceId, limit, offset },
  }),
  queryOptions: ({ resourceId }) => ({
    enabled: Boolean(resourceId),
    staleTime: 10_000,
  }),
})

const interactionMutationService = useMutation<
  unknown,
  ResourceInteractionMutation
>({
  query: ({ resourceId, resourceType, action, method, body }) => ({
    url: resourcePath(action === "reaction" ? "react" : action, resourceType),
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

const commentMutationService = useMutation<unknown, ResourceCommentMutation>({
  query: ({ resourceId, resourceType, commentId, action, body }) => {
    const isReaction = action === "react" || action === "remove-reaction"
    return {
      url: isReaction
        ? "/resource/react/comment"
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

export const useResourceInteractionSummaryQuery = createQueryService(summaryService)
export const useResourceInteractionStateQuery = createQueryService(stateService)
export const useResourceCommentsQuery = createQueryService(commentsService)
export const useResourceInteractionMutation = createMutationService(interactionMutationService)
export const useResourceCommentMutation = createMutationService(commentMutationService)
