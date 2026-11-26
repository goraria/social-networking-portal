import { z } from "@gorth/structure/cores/zod"

export const postTypes = ["standard", "tweet", "reel"] as const
export const postFormats = [
  "text",
  "image",
  "carousel",
  "video",
  "link",
  "poll",
] as const
export const postStatuses = [
  "draft",
  "scheduled",
  "published",
  "archived",
  "deleted",
] as const
export const postVisibilities = [
  "public",
  "followers",
  "friends",
  "close_friend",
  "custom",
  "private",
] as const
export const interactionPolicies = [
  "everyone",
  "followers",
  "following",
  "friends",
  "mentioned",
  "nobody",
] as const

const nullableUuid = z.uuid().nullable()
const nullableDate = z.string().nullable()

export const postSchema = z.object({
  id: z.uuid(),
  authorId: z.uuid(),
  authorActorId: nullableUuid,
  type: z.enum(postTypes),
  format: z.enum(postFormats),
  status: z.enum(postStatuses),
  visibility: z.enum(postVisibilities),
  replyPolicy: z.enum(interactionPolicies),
  quotePolicy: z.enum(interactionPolicies),
  rootPostId: nullableUuid,
  parentPostId: nullableUuid,
  quotedPostId: nullableUuid,
  repostOfId: nullableUuid,
  content: z.string().nullable(),
  location: z.string().nullable(),
  locationId: nullableUuid,
  linkPreviewId: nullableUuid,
  languageCode: z.string().nullable(),
  isSensitive: z.boolean(),
  replyCount: z.number().int().nonnegative(),
  repostCount: z.number().int().nonnegative(),
  quoteCount: z.number().int().nonnegative(),
  viewCount: z.number().int().nonnegative(),
  scheduledAt: nullableDate,
  editedAt: nullableDate,
  publishedAt: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  deletedAt: nullableDate,
  archivedAt: nullableDate,
})

export const createPostSchema = z.object({
  type: z.enum(postTypes),
  format: z.enum(postFormats).default("text"),
  status: z.enum(postStatuses).default("published"),
  visibility: z.enum(postVisibilities).default("public"),
  replyPolicy: z.enum(interactionPolicies).default("everyone"),
  quotePolicy: z.enum(interactionPolicies).default("everyone"),
  content: z.string().trim().min(1).max(10_000),
  location: z.string().trim().max(255).nullable().optional(),
  languageCode: z.string().trim().min(2).max(16).nullable().optional(),
  isSensitive: z.boolean().default(false),
})

export type Post = z.infer<typeof postSchema>
export type CreatePostInput = z.infer<typeof createPostSchema>
