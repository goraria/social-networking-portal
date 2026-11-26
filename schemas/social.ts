import { z } from "@gorth-com/structure/cores/zod"
import { createPostSchema } from "@/schemas/post"
export const idSchema = z.uuid()
export const postInputSchema = createPostSchema
  .extend({
    clientRequestId: z.uuid(),
    assetIds: z.array(z.uuid()).max(10).default([]),
    parentPostId: z.uuid().nullable().optional(),
    quotedPostId: z.uuid().nullable().optional(),
    repostOfId: z.uuid().nullable().optional(),
    groupId: z.uuid().nullable().optional(),
    communityId: z.uuid().nullable().optional(),
    scheduledAt: z.iso.datetime().nullable().optional(),
  })
  .refine(
    (x) => x.content.trim().length > 0 || x.assetIds.length > 0,
    "Content or media is required"
  )
export const postUpdateSchema = createPostSchema
  .partial()
  .extend({
    version: z.number().int().positive(),
    assetIds: z.array(z.uuid()).max(10).default([]),
    removeAssetIds: z.array(z.uuid()).max(10).default([]),
  })
  .strict()
export const feedQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).max(100000).default(0),
  mode: z.enum(["all", "following", "mine", "reel", "tweet"]).default("all"),
  authorId: z.uuid().optional(),
  groupId: z.uuid().optional(),
  communityId: z.uuid().optional(),
  feedId: z.uuid().optional(),
  q: z.string().trim().max(200).optional(),
})
export const relationshipSchema = z.object({
  targetId: z.uuid(),
  action: z.enum([
    "follow",
    "unfollow",
    "accept-follow",
    "reject-follow",
    "request",
    "accept",
    "reject",
    "unfriend",
    "block",
    "unblock",
    "mute",
    "unmute",
  ]),
})
export const hubKinds = [
  "group",
  "community",
  "page",
  "event",
  "topic",
  "feed",
] as const
export const hubInputSchema = z
  .object({
    kind: z.enum(hubKinds),
    name: z.string().trim().min(1).max(120),
    description: z.string().trim().max(2000).default(""),
    visibility: z.enum(["public", "private"]).default("public"),
    startsAt: z.iso.datetime().optional(),
    endsAt: z.iso.datetime().optional(),
    requiresPostApproval: z.boolean().default(false),
  })
  .refine(
    (x) => !x.endsAt || (!!x.startsAt && x.endsAt > x.startsAt),
    "Invalid event interval"
  )
export const membershipSchema = z.object({
  action: z.enum([
    "join",
    "leave",
    "approve",
    "remove",
    "promote",
    "demote",
    "transfer",
    "invite",
    "going",
    "interested",
    "declined",
    "cancel",
  ]),
  targetId: z.uuid().optional(),
})
export const uploadSchema = z.object({
  bucket: z.uuid(),
  filename: z.string().trim().min(1).max(255),
  contentType: z.enum([
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "video/mp4",
    "video/webm",
  ]),
  size: z
    .number()
    .int()
    .positive()
    .max(100 * 1024 * 1024),
})
export const storyInputSchema = z.object({
  assetId: z.uuid(),
  caption: z.string().trim().max(2000).default(""),
  visibility: z
    .enum(["public", "followers", "friends", "private"])
    .default("public"),
  expiresAt: z.iso.datetime(),
})
export const profileInputSchema = z.object({
  handle: z
    .string()
    .trim()
    .min(1)
    .max(64)
    .regex(/^[\p{L}\p{N}_.-]+$/u),
  bio: z.string().max(1000).default(""),
  website: z.union([z.url().startsWith("https://"), z.literal("")]).default(""),
  location: z.string().max(255).default(""),
  visibility: z
    .enum(["public", "followers", "friends", "private"])
    .default("public"),
})
export const grantSchema = z.object({
  access_token: z.string().min(1),
  token_type: z.literal("Bearer"),
  expires_in: z.number().int().positive().max(600),
})
export const accessInputSchema = z.object({
  resourceType: z.enum(["post", "story"]),
  resourceId: z.uuid(),
  action: z.enum(["read", "comment", "share", "interact"]).default("read"),
  subjects: z.array(z.string().min(1).max(255)).max(100).default([]),
})
export const reportInputSchema = z.object({
  reason: z.string().trim().min(1).max(128),
  details: z.string().max(4000).optional(),
})
export const socialPolicyResultSchema = z.object({
  removedResourceIds: z.array(z.string()),
  restrictedSubjects: z.array(z.string()),
})
export const socialSearchResultSchema = z.object({
  data: z.array(z.object({ resourceId: z.uuid() })).max(100),
})
export const feedSourcesSchema = z.object({
  userIds: z.array(z.uuid()).max(100),
})
export const moderationDecisionSchema = z.object({
  decision: z.enum(["approve", "reject"]),
  version: z.number().int().positive(),
})
export const storyUpdateSchema = z
  .object({
    caption: z.string().max(2000).optional(),
    visibility: z
      .enum(["public", "followers", "friends", "private"])
      .optional(),
  })
  .strict()
export const restrictionInputSchema = z.object({
  targetId: z.uuid(),
  type: z.enum(["warning", "feature_restriction", "suspension", "ban"]),
  reason: z.string().trim().min(1).max(2000),
  expiresAt: z.iso.datetime().optional(),
})
export const hubUpdateSchema = z
  .object({
    name: z.string().trim().min(1).max(120).optional(),
    description: z.string().trim().max(2000).optional(),
    visibility: z.enum(["public", "private"]).optional(),
    requiresPostApproval: z.boolean().optional(),
    startsAt: z.iso.datetime().optional(),
    endsAt: z.iso.datetime().nullable().optional(),
  })
  .strict()
