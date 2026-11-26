import { userTable } from "@/database/auth"
export {
  userStatus,
  userTable,
  accountTable,
  rateLimitTable,
  legacySessionTable,
  legacyVerificationTable,
  sessionTable,
  verificationTable,
  revocationTable,
  proofTable,
} from "@/database/auth"
import { sql } from "drizzle-orm"
import {
  boolean,
  check,
  foreignKey,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core"

export const followStatus = pgEnum("follow_status", [
  "pending",
  "accepted",
  "rejected",
])

// Per-user feed preferences belong to Social; interaction and analytics stores remain in their services.
export const socialHiddenPost = pgTable(
  "social_hidden_post",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
    postId: uuid("post_id")
      .notNull()
      .references(() => postsTable.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.userId, t.postId] })]
)
export const friendshipStatus = pgEnum("friendship_status", [
  "pending",
  "accepted",
  "rejected",
])
export const postType = pgEnum("post_type", ["standard", "tweet", "reel"])
export const postChannel = pgEnum("post_channel_type", [
  "feed",
  "tweet",
  "explore",
])
export const postVisibility = pgEnum("post_visibility", [
  "public",
  "followers",
  "friends",
  "close_friend",
  "custom",
  "private",
])
export const mediaType = pgEnum("media_type", ["image", "video"])

export const actorType = pgEnum("actor_type", [
  "user",
  "page",
  "group",
  "community",
])
export const profileVisibility = pgEnum("profile_visibility", [
  "public",
  "followers",
  "friends",
  "private",
])
export const interactionPolicy = pgEnum("interaction_policy", [
  "everyone",
  "followers",
  "following",
  "friends",
  "mentioned",
  "nobody",
])
export const postFormat = pgEnum("post_format", [
  "text",
  "image",
  "carousel",
  "video",
  "link",
  "poll",
])
export const contentStatus = pgEnum("content_status", [
  "draft",
  "scheduled",
  "published",
  "archived",
  "deleted",
])
export const mediaProcessingStatus = pgEnum("media_processing_status", [
  "pending",
  "processing",
  "ready",
  "failed",
])
export const moderationStatus = pgEnum("moderation_status", [
  "pending",
  "approved",
  "rejected",
  "flagged",
])
export const invitationStatus = pgEnum("invitation_status", [
  "pending",
  "accepted",
  "rejected",
  "cancelled",
])
export const memberRole = pgEnum("member_role", [
  "owner",
  "admin",
  "editor",
  "moderator",
  "analyst",
  "member",
])
export const reportStatus = pgEnum("report_status", [
  "open",
  "reviewing",
  "resolved",
  "dismissed",
])
export const reportTargetType = pgEnum("report_target_type", [
  "user",
  "post",
  "comment",
  "story",
  "page",
  "group",
  "community",
])
export const entityType = pgEnum("entity_type", [
  "user",
  "post",
  "comment",
  "story",
  "page",
  "group",
  "community",
  "event",
])
export const deliveryStatus = pgEnum("delivery_status", [
  "pending",
  "processing",
  "delivered",
  "failed",
])
export const storyStickerType = pgEnum("story_sticker_type", [
  "mention",
  "hashtag",
  "location",
  "poll",
  "question",
  "link",
  "music",
])
export const federationDirection = pgEnum("federation_direction", [
  "inbox",
  "outbox",
])

export const actorsTable = pgTable(
  "actor",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    type: actorType("type").notNull(),
    userId: uuid("user_id").references(() => userTable.id, {
      onDelete: "cascade",
    }),
    handle: varchar("handle", { length: 64 }).notNull(),
    displayName: varchar("display_name", { length: 255 }).notNull(),
    image: text("image"),
    verifiedAt: timestamp("verified_at", { mode: "date" }),
    metadata: jsonb("metadata").notNull().default(sql.raw("'{}'::jsonb")),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
    deletedAt: timestamp("deleted_at", { mode: "date" }),
  },
  (table) => [
    uniqueIndex("actor_handle_lower_key").on(sql`lower(${table.handle})`),
    uniqueIndex("actor_user_id_key").on(table.userId),
    index("actor_type_created_at_idx").on(table.type, table.createdAt),
  ]
)

export const profilesTable = pgTable(
  "profile",
  {
    userId: uuid("user_id")
      .primaryKey()
      .references(() => userTable.id, { onDelete: "cascade" }),
    handle: varchar("handle", { length: 64 }).notNull(),
    bio: text("bio"),
    coverImage: text("cover_image"),
    website: text("website"),
    location: text("location"),
    displayCategory: varchar("display_category", { length: 64 }),
    pronouns: varchar("pronouns", { length: 64 }),
    visibility: profileVisibility("visibility").notNull().default("public"),
    messagePolicy: interactionPolicy("message_policy")
      .notNull()
      .default("everyone"),
    tagPolicy: interactionPolicy("tag_policy").notNull().default("everyone"),
    mentionPolicy: interactionPolicy("mention_policy")
      .notNull()
      .default("everyone"),
    followerCount: integer("follower_count").notNull().default(0),
    followingCount: integer("following_count").notNull().default(0),
    postCount: integer("post_count").notNull().default(0),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("profile_handle_lower_key").on(sql`lower(${table.handle})`),
    check("profile_follower_count_check", sql`${table.followerCount} >= 0`),
    check("profile_following_count_check", sql`${table.followingCount} >= 0`),
    check("profile_post_count_check", sql`${table.postCount} >= 0`),
  ]
)

export const profileLinksTable = pgTable(
  "profile_link",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 128 }),
    url: text("url").notNull(),
    position: integer("position").notNull().default(0),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("profile_link_user_id_position_key").on(
      table.userId,
      table.position
    ),
    check("profile_link_position_check", sql`${table.position} >= 0`),
  ]
)

export const followsTable = pgTable(
  "follow",
  {
    followerId: uuid("follower_id")
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
    followingId: uuid("following_id")
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
    status: followStatus("status").notNull().default("accepted"),
    requestedAt: timestamp("requested_at", { mode: "date" })
      .notNull()
      .defaultNow(),
    respondedAt: timestamp("responded_at", { mode: "date" }),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.followerId, table.followingId] }),
    index("follow_following_id_status_idx").on(table.followingId, table.status),
    check(
      "follow_not_self_check",
      sql`${table.followerId} <> ${table.followingId}`
    ),
  ]
)

export const friendshipsTable = pgTable(
  "friendship",
  {
    requesterId: uuid("requester_id")
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
    addresseeId: uuid("addressee_id")
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
    status: friendshipStatus("status").notNull().default("pending"),
    userLowId: uuid("user_low_id").references(() => userTable.id, {
      onDelete: "cascade",
    }),
    userHighId: uuid("user_high_id").references(() => userTable.id, {
      onDelete: "cascade",
    }),
    respondedAt: timestamp("responded_at", { mode: "date" }),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.requesterId, table.addresseeId] }),
    index("friendship_addressee_id_status_idx").on(
      table.addresseeId,
      table.status
    ),
    uniqueIndex("friendship_canonical_pair_key").on(
      table.userLowId,
      table.userHighId
    ),
    check(
      "friendship_not_self_check",
      sql`${table.requesterId} <> ${table.addresseeId}`
    ),
  ]
)

export const blocksTable = pgTable(
  "block",
  {
    blockerId: uuid("blocker_id")
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
    blockedId: uuid("blocked_id")
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
    reason: text("reason"),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.blockerId, table.blockedId] }),
    index("block_blocked_id_idx").on(table.blockedId),
    check(
      "block_not_self_check",
      sql`${table.blockerId} <> ${table.blockedId}`
    ),
  ]
)

export const mutesTable = pgTable(
  "mute",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
    mutedUserId: uuid("muted_user_id")
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
    expiresAt: timestamp("expires_at", { mode: "date" }),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.userId, table.mutedUserId] }),
    index("mute_muted_user_id_idx").on(table.mutedUserId),
    check("mute_not_self_check", sql`${table.userId} <> ${table.mutedUserId}`),
  ]
)

export const restrictionsTable = pgTable(
  "restriction",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
    restrictedUserId: uuid("restricted_user_id")
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.userId, table.restrictedUserId] }),
    index("restriction_restricted_user_id_idx").on(table.restrictedUserId),
    check(
      "restriction_not_self_check",
      sql`${table.userId} <> ${table.restrictedUserId}`
    ),
  ]
)

export const closeFriendsTable = pgTable(
  "close_friend",
  {
    ownerId: uuid("owner_id")
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
    memberId: uuid("member_id")
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.ownerId, table.memberId] }),
    index("close_friend_member_id_idx").on(table.memberId),
    check(
      "close_friend_not_self_check",
      sql`${table.ownerId} <> ${table.memberId}`
    ),
  ]
)

export const customAudiencesTable = pgTable(
  "custom_audience",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    ownerId: uuid("owner_id")
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 128 }).notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("custom_audience_owner_id_name_key").on(
      table.ownerId,
      table.name
    ),
  ]
)

export const customAudienceMembersTable = pgTable(
  "custom_audience_member",
  {
    audienceId: uuid("audience_id")
      .notNull()
      .references(() => customAudiencesTable.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.audienceId, table.userId] }),
    index("custom_audience_member_user_id_idx").on(table.userId),
  ]
)

export const locationsTable = pgTable(
  "location",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    address: text("address"),
    latitude: text("latitude"),
    longitude: text("longitude"),
    metadata: jsonb("metadata").notNull().default(sql.raw("'{}'::jsonb")),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => [index("location_name_idx").on(table.name)]
)

export const linkPreviewsTable = pgTable(
  "link_preview",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    url: text("url").notNull(),
    title: text("title"),
    description: text("description"),
    imageUrl: text("image_url"),
    siteName: varchar("site_name", { length: 255 }),
    fetchedAt: timestamp("fetched_at", { mode: "date" }).notNull().defaultNow(),
    metadata: jsonb("metadata").notNull().default(sql.raw("'{}'::jsonb")),
  },
  (table) => [uniqueIndex("link_preview_url_key").on(table.url)]
)

export const postsTable = pgTable(
  "post",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    authorId: uuid("author_id")
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
    authorActorId: uuid("author_actor_id").references(() => actorsTable.id, {
      onDelete: "set null",
    }),
    clientRequestId: uuid("client_request_id"),
    requestFingerprint: text("request_fingerprint"),
    reviewRequested: boolean("review_requested").notNull().default(false),
    version: integer("version").notNull().default(1),
    groupId: uuid("group_id").references(() => groupsTable.id, {
      onDelete: "cascade",
    }),
    communityId: uuid("community_id").references(() => communitiesTable.id, {
      onDelete: "cascade",
    }),
    type: postType("type").notNull().default("standard"),
    format: postFormat("format").notNull().default("text"),
    status: contentStatus("status").notNull().default("published"),
    visibility: postVisibility("visibility").notNull().default("public"),
    replyPolicy: interactionPolicy("reply_policy")
      .notNull()
      .default("everyone"),
    quotePolicy: interactionPolicy("quote_policy")
      .notNull()
      .default("everyone"),
    rootPostId: uuid("root_post_id"),
    parentPostId: uuid("parent_post_id"),
    quotedPostId: uuid("quoted_post_id"),
    repostOfId: uuid("repost_of_id"),
    content: text("content"),
    location: text("location"),
    locationId: uuid("location_id").references(() => locationsTable.id, {
      onDelete: "set null",
    }),
    linkPreviewId: uuid("link_preview_id").references(
      () => linkPreviewsTable.id,
      { onDelete: "set null" }
    ),
    languageCode: varchar("language_code", { length: 16 }),
    isSensitive: boolean("is_sensitive").notNull().default(false),
    replyCount: integer("reply_count").notNull().default(0),
    repostCount: integer("repost_count").notNull().default(0),
    quoteCount: integer("quote_count").notNull().default(0),
    viewCount: integer("view_count").notNull().default(0),
    scheduledAt: timestamp("scheduled_at", { mode: "date" }),
    editedAt: timestamp("edited_at", { mode: "date" }),
    publishedAt: timestamp("published_at", { mode: "date" })
      .notNull()
      .defaultNow(),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
    deletedAt: timestamp("deleted_at", { mode: "date" }),
    archivedAt: timestamp("archived_at", { mode: "date" }),
  },
  (table) => [
    uniqueIndex("social_post_request_key")
      .on(table.authorId, table.clientRequestId)
      .where(sql`${table.clientRequestId} IS NOT NULL`),
    index("social_post_feed_idx")
      .on(table.publishedAt.desc(), table.id.desc())
      .where(sql`${table.deletedAt} IS NULL`),
    foreignKey({
      columns: [table.rootPostId],
      foreignColumns: [table.id],
      name: "post_root_post_id_fkey",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.parentPostId],
      foreignColumns: [table.id],
      name: "post_parent_post_id_fkey",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.quotedPostId],
      foreignColumns: [table.id],
      name: "post_quoted_post_id_fkey",
    }).onDelete("set null"),
    foreignKey({
      columns: [table.repostOfId],
      foreignColumns: [table.id],
      name: "post_repost_of_id_fkey",
    }).onDelete("set null"),
    index("post_author_id_published_at_idx").on(
      table.authorId,
      table.publishedAt
    ),
    index("post_author_actor_id_published_at_idx").on(
      table.authorActorId,
      table.publishedAt
    ),
    index("post_status_visibility_published_at_idx").on(
      table.status,
      table.visibility,
      table.publishedAt
    ),
    index("post_type_published_at_idx").on(table.type, table.publishedAt),
    index("post_visibility_published_at_idx").on(
      table.visibility,
      table.publishedAt
    ),
    index("post_parent_post_id_idx").on(table.parentPostId),
    index("post_root_post_id_idx").on(table.rootPostId),
    index("post_quoted_post_id_idx").on(table.quotedPostId),
    index("post_repost_of_id_idx").on(table.repostOfId),
    check("post_reply_count_check", sql`${table.replyCount} >= 0`),
    check("post_repost_count_check", sql`${table.repostCount} >= 0`),
    check("post_quote_count_check", sql`${table.quoteCount} >= 0`),
    check("post_view_count_check", sql`${table.viewCount} >= 0`),
  ]
)

export const postAudiencesTable = pgTable(
  "post_audience",
  {
    postId: uuid("post_id")
      .notNull()
      .references(() => postsTable.id, { onDelete: "cascade" }),
    audienceId: uuid("audience_id")
      .notNull()
      .references(() => customAudiencesTable.id, { onDelete: "cascade" }),
  },
  (table) => [
    primaryKey({ columns: [table.postId, table.audienceId] }),
    index("post_audience_audience_id_idx").on(table.audienceId),
  ]
)

export const postChannelsTable = pgTable(
  "post_channel",
  {
    postId: uuid("post_id")
      .notNull()
      .references(() => postsTable.id, { onDelete: "cascade" }),
    channel: postChannel("channel").notNull(),
    publishedAt: timestamp("published_at", { mode: "date" })
      .notNull()
      .defaultNow(),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.postId, table.channel] }),
    index("post_channel_channel_created_at_idx").on(
      table.channel,
      table.createdAt
    ),
  ]
)

export const postMediaTable = pgTable(
  "post_media",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    mediaAssetId: uuid("media_asset_id"),
    postId: uuid("post_id")
      .notNull()
      .references(() => postsTable.id, { onDelete: "cascade" }),
    type: mediaType("type").notNull(),
    url: text("url").notNull(),
    originalUrl: text("original_url"),
    processedUrl: text("processed_url"),
    thumbnailUrl: text("thumbnail_url"),
    storageProvider: varchar("storage_provider", { length: 64 }),
    storageKey: text("storage_key"),
    mimeType: varchar("mime_type", { length: 128 }),
    blurHash: text("blur_hash"),
    altText: text("alt_text"),
    width: integer("width"),
    height: integer("height"),
    durationSeconds: integer("duration_seconds"),
    fileSize: integer("file_size"),
    processingStatus: mediaProcessingStatus("processing_status")
      .notNull()
      .default("ready"),
    moderationStatus: moderationStatus("moderation_status")
      .notNull()
      .default("pending"),
    position: integer("position").notNull().default(0),
    metadata: jsonb("metadata").notNull().default(sql.raw("'{}'::jsonb")),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("social_post_asset_key")
      .on(table.mediaAssetId)
      .where(sql`${table.mediaAssetId} IS NOT NULL`),
    index("post_media_post_id_position_idx").on(table.postId, table.position),
    check("post_media_position_check", sql`${table.position} >= 0`),
    check(
      "post_media_duration_seconds_check",
      sql`${table.durationSeconds} is null or ${table.durationSeconds} >= 0`
    ),
    check(
      "post_media_file_size_check",
      sql`${table.fileSize} is null or ${table.fileSize} >= 0`
    ),
  ]
)

export const postMentionsTable = pgTable(
  "post_mention",
  {
    postId: uuid("post_id")
      .notNull()
      .references(() => postsTable.id, { onDelete: "cascade" }),
    mentionedUserId: uuid("mentioned_user_id")
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
    startOffset: integer("start_offset"),
    endOffset: integer("end_offset"),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.postId, table.mentionedUserId] }),
    index("post_mention_mentioned_user_id_idx").on(table.mentionedUserId),
  ]
)

export const postUserTagsTable = pgTable(
  "post_user_tag",
  {
    postId: uuid("post_id")
      .notNull()
      .references(() => postsTable.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
    mediaId: uuid("media_id").references(() => postMediaTable.id, {
      onDelete: "cascade",
    }),
    positionX: integer("position_x"),
    positionY: integer("position_y"),
    status: invitationStatus("status").notNull().default("pending"),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.postId, table.userId] }),
    index("post_user_tag_user_id_status_idx").on(table.userId, table.status),
  ]
)

export const postCollaboratorsTable = pgTable(
  "post_collaborator",
  {
    postId: uuid("post_id")
      .notNull()
      .references(() => postsTable.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
    status: invitationStatus("status").notNull().default("pending"),
    invitedAt: timestamp("invited_at", { mode: "date" }).notNull().defaultNow(),
    respondedAt: timestamp("responded_at", { mode: "date" }),
  },
  (table) => [
    primaryKey({ columns: [table.postId, table.userId] }),
    index("post_collaborator_user_id_status_idx").on(
      table.userId,
      table.status
    ),
  ]
)

export const postRepostsTable = pgTable(
  "post_repost",
  {
    postId: uuid("post_id")
      .notNull()
      .references(() => postsTable.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
    caption: text("caption"),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.postId, table.userId] }),
    index("post_repost_user_id_created_at_idx").on(
      table.userId,
      table.createdAt
    ),
  ]
)

export const pollsTable = pgTable("poll", {
  id: uuid("id").primaryKey().defaultRandom(),
  postId: uuid("post_id")
    .notNull()
    .unique()
    .references(() => postsTable.id, { onDelete: "cascade" }),
  allowsMultiple: boolean("allows_multiple").notNull().default(false),
  expiresAt: timestamp("expires_at", { mode: "date" }),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
})

export const pollOptionsTable = pgTable(
  "poll_option",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    pollId: uuid("poll_id")
      .notNull()
      .references(() => pollsTable.id, { onDelete: "cascade" }),
    text: varchar("text", { length: 255 }).notNull(),
    position: integer("position").notNull().default(0),
    voteCount: integer("vote_count").notNull().default(0),
  },
  (table) => [
    uniqueIndex("poll_option_poll_id_position_key").on(
      table.pollId,
      table.position
    ),
    check("poll_option_position_check", sql`${table.position} >= 0`),
    check("poll_option_vote_count_check", sql`${table.voteCount} >= 0`),
  ]
)

export const pollVotesTable = pgTable(
  "poll_vote",
  {
    pollId: uuid("poll_id")
      .notNull()
      .references(() => pollsTable.id, { onDelete: "cascade" }),
    optionId: uuid("option_id")
      .notNull()
      .references(() => pollOptionsTable.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.pollId, table.optionId, table.userId] }),
    index("poll_vote_user_id_created_at_idx").on(table.userId, table.createdAt),
  ]
)

export const storiesTable = pgTable(
  "story",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    mediaAssetId: uuid("media_asset_id"),
    authorId: uuid("author_id")
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
    authorActorId: uuid("author_actor_id").references(() => actorsTable.id, {
      onDelete: "set null",
    }),
    groupId: uuid("group_id").defaultRandom(),
    position: integer("position").notNull().default(0),
    mediaType: mediaType("media_type").notNull(),
    mediaUrl: text("media_url").notNull(),
    thumbnailUrl: text("thumbnail_url"),
    caption: text("caption"),
    status: contentStatus("status").notNull().default("published"),
    visibility: postVisibility("visibility").notNull().default("public"),
    isArchived: boolean("is_archived").notNull().default(false),
    expiresAt: timestamp("expires_at", { mode: "date" }).notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => [
    index("story_author_id_created_at_idx").on(table.authorId, table.createdAt),
    index("story_expires_at_idx").on(table.expiresAt),
    index("story_group_id_position_idx").on(table.groupId, table.position),
    check("story_position_check", sql`${table.position} >= 0`),
  ]
)

export const storyViewsTable = pgTable(
  "story_view",
  {
    storyId: uuid("story_id")
      .notNull()
      .references(() => storiesTable.id, { onDelete: "cascade" }),
    viewerId: uuid("viewer_id")
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
    viewedAt: timestamp("viewed_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.storyId, table.viewerId] }),
    index("story_view_viewer_id_idx").on(table.viewerId),
  ]
)

export const storyRepliesTable = pgTable(
  "story_reply",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    storyId: uuid("story_id")
      .notNull()
      .references(() => storiesTable.id, { onDelete: "cascade" }),
    messageId: text("message_id").notNull().unique(),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => [
    index("story_reply_story_id_created_at_idx").on(
      table.storyId,
      table.createdAt
    ),
  ]
)

export const storyStickersTable = pgTable(
  "story_sticker",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    storyId: uuid("story_id")
      .notNull()
      .references(() => storiesTable.id, { onDelete: "cascade" }),
    type: storyStickerType("type").notNull(),
    positionX: integer("position_x"),
    positionY: integer("position_y"),
    payload: jsonb("payload").notNull().default(sql.raw("'{}'::jsonb")),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => [index("story_sticker_story_id_idx").on(table.storyId)]
)

export const storyArchivesTable = pgTable(
  "story_archive",
  {
    storyId: uuid("story_id")
      .primaryKey()
      .references(() => storiesTable.id, { onDelete: "cascade" }),
    ownerId: uuid("owner_id")
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
    archivedAt: timestamp("archived_at", { mode: "date" })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("story_archive_owner_id_archived_at_idx").on(
      table.ownerId,
      table.archivedAt
    ),
  ]
)

export const storyHighlightsTable = pgTable(
  "story_highlight",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    ownerId: uuid("owner_id")
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 128 }).notNull(),
    coverUrl: text("cover_url"),
    position: integer("position").notNull().default(0),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("story_highlight_owner_id_position_key").on(
      table.ownerId,
      table.position
    ),
    check("story_highlight_position_check", sql`${table.position} >= 0`),
  ]
)

export const storyHighlightItemsTable = pgTable(
  "story_highlight_item",
  {
    highlightId: uuid("highlight_id")
      .notNull()
      .references(() => storyHighlightsTable.id, { onDelete: "cascade" }),
    storyId: uuid("story_id")
      .notNull()
      .references(() => storiesTable.id, { onDelete: "cascade" }),
    position: integer("position").notNull().default(0),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.highlightId, table.storyId] }),
    uniqueIndex("story_highlight_item_position_key").on(
      table.highlightId,
      table.position
    ),
  ]
)

export const audioTracksTable = pgTable(
  "audio_track",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    ownerId: uuid("owner_id").references(() => userTable.id, {
      onDelete: "set null",
    }),
    title: varchar("title", { length: 255 }).notNull(),
    artist: varchar("artist", { length: 255 }),
    url: text("url").notNull(),
    durationSeconds: integer("duration_seconds"),
    isOriginal: boolean("is_original").notNull().default(false),
    metadata: jsonb("metadata").notNull().default(sql.raw("'{}'::jsonb")),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => [
    index("audio_track_owner_id_created_at_idx").on(
      table.ownerId,
      table.createdAt
    ),
    check(
      "audio_track_duration_seconds_check",
      sql`${table.durationSeconds} is null or ${table.durationSeconds} >= 0`
    ),
  ]
)

export const reelAudioTable = pgTable(
  "reel_audio",
  {
    postId: uuid("post_id")
      .primaryKey()
      .references(() => postsTable.id, { onDelete: "cascade" }),
    audioTrackId: uuid("audio_track_id")
      .notNull()
      .references(() => audioTracksTable.id, { onDelete: "restrict" }),
    startMilliseconds: integer("start_milliseconds").notNull().default(0),
    durationMilliseconds: integer("duration_milliseconds"),
  },
  (table) => [
    index("reel_audio_audio_track_id_idx").on(table.audioTrackId),
    check(
      "reel_audio_start_milliseconds_check",
      sql`${table.startMilliseconds} >= 0`
    ),
  ]
)

export const reelClipsTable = pgTable(
  "reel_clip",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    postId: uuid("post_id")
      .notNull()
      .references(() => postsTable.id, { onDelete: "cascade" }),
    mediaId: uuid("media_id")
      .notNull()
      .references(() => postMediaTable.id, { onDelete: "cascade" }),
    position: integer("position").notNull().default(0),
    startMilliseconds: integer("start_milliseconds").notNull().default(0),
    endMilliseconds: integer("end_milliseconds"),
    metadata: jsonb("metadata").notNull().default(sql.raw("'{}'::jsonb")),
  },
  (table) => [
    uniqueIndex("reel_clip_post_id_position_key").on(
      table.postId,
      table.position
    ),
    check("reel_clip_position_check", sql`${table.position} >= 0`),
  ]
)

export const reelRemixesTable = pgTable(
  "reel_remix",
  {
    reelPostId: uuid("reel_post_id")
      .primaryKey()
      .references(() => postsTable.id, { onDelete: "cascade" }),
    sourcePostId: uuid("source_post_id")
      .notNull()
      .references(() => postsTable.id, { onDelete: "restrict" }),
    layout: varchar("layout", { length: 64 }),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => [index("reel_remix_source_post_id_idx").on(table.sourcePostId)]
)

export const hashtagsTable = pgTable(
  "hashtag",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 128 }).notNull(),
    postCount: integer("post_count").notNull().default(0),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("hashtag_name_key").on(table.name),
    check("hashtag_post_count_check", sql`${table.postCount} >= 0`),
  ]
)

export const postHashtagsTable = pgTable(
  "post_hashtag",
  {
    postId: uuid("post_id")
      .notNull()
      .references(() => postsTable.id, { onDelete: "cascade" }),
    hashtagId: uuid("hashtag_id")
      .notNull()
      .references(() => hashtagsTable.id, { onDelete: "cascade" }),
  },
  (table) => [
    primaryKey({ columns: [table.postId, table.hashtagId] }),
    index("post_hashtag_hashtag_id_idx").on(table.hashtagId),
  ]
)

export const topicsTable = pgTable(
  "topic",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: varchar("slug", { length: 128 }).notNull().unique(),
    name: varchar("name", { length: 128 }).notNull(),
    description: text("description"),
    status: contentStatus("status").notNull().default("published"),
    postCount: integer("post_count").notNull().default(0),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("topic_name_lower_key").on(sql`lower(${table.name})`),
    check("topic_post_count_check", sql`${table.postCount} >= 0`),
  ]
)

export const postTopicsTable = pgTable(
  "post_topic",
  {
    postId: uuid("post_id")
      .notNull()
      .references(() => postsTable.id, { onDelete: "cascade" }),
    topicId: uuid("topic_id")
      .notNull()
      .references(() => topicsTable.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.postId, table.topicId] }),
    index("post_topic_topic_id_created_at_idx").on(
      table.topicId,
      table.createdAt
    ),
  ]
)

export const userTopicFollowsTable = pgTable(
  "user_topic_follow",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
    topicId: uuid("topic_id")
      .notNull()
      .references(() => topicsTable.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.userId, table.topicId] }),
    index("user_topic_follow_topic_id_idx").on(table.topicId),
  ]
)

export const profileTopicsTable = pgTable(
  "profile_topic",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
    topicId: uuid("topic_id")
      .notNull()
      .references(() => topicsTable.id, { onDelete: "cascade" }),
    position: integer("position").notNull().default(0),
  },
  (table) => [
    primaryKey({ columns: [table.userId, table.topicId] }),
    uniqueIndex("profile_topic_user_id_position_key").on(
      table.userId,
      table.position
    ),
  ]
)

export const customFeedsTable = pgTable(
  "custom_feed",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    ownerId: uuid("owner_id")
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 128 }).notNull(),
    isPublic: boolean("is_public").notNull().default(false),
    isDefault: boolean("is_default").notNull().default(false),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("custom_feed_owner_id_name_key").on(table.ownerId, table.name),
  ]
)

export const customFeedSourcesTable = pgTable(
  "custom_feed_source",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    feedId: uuid("feed_id")
      .notNull()
      .references(() => customFeedsTable.id, { onDelete: "cascade" }),
    sourceType: varchar("source_type", { length: 32 }).notNull(),
    sourceId: uuid("source_id").notNull(),
    includeReplies: boolean("include_replies").notNull().default(true),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("custom_feed_source_source_key").on(
      table.feedId,
      table.sourceType,
      table.sourceId
    ),
  ]
)

export const outboxEventsTable = pgTable(
  "outbox_event",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    leaseToken: uuid("lease_token"),
    leaseUntil: timestamp("lease_until"),
    lastError: text("last_error"),
    aggregateType: varchar("aggregate_type", { length: 64 }).notNull(),
    aggregateId: uuid("aggregate_id").notNull(),
    eventType: varchar("event_type", { length: 128 }).notNull(),
    payload: jsonb("payload").notNull(),
    status: deliveryStatus("status").notNull().default("pending"),
    attemptCount: integer("attempt_count").notNull().default(0),
    availableAt: timestamp("available_at", { mode: "date" })
      .notNull()
      .defaultNow(),
    processedAt: timestamp("processed_at", { mode: "date" }),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => [
    index("outbox_event_status_available_at_idx").on(
      table.status,
      table.availableAt
    ),
  ]
)

export const pagesTable = pgTable(
  "page",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull().default(""),
    actorId: uuid("actor_id")
      .notNull()
      .unique()
      .references(() => actorsTable.id, { onDelete: "cascade" }),
    ownerId: uuid("owner_id")
      .notNull()
      .references(() => userTable.id, { onDelete: "restrict" }),
    category: varchar("category", { length: 128 }),
    description: text("description"),
    website: text("website"),
    coverImage: text("cover_image"),
    followerCount: integer("follower_count").notNull().default(0),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
    deletedAt: timestamp("deleted_at", { mode: "date" }),
  },
  (table) => [
    index("page_owner_id_idx").on(table.ownerId),
    check("page_follower_count_check", sql`${table.followerCount} >= 0`),
  ]
)

export const pageMembersTable = pgTable(
  "page_member",
  {
    pageId: uuid("page_id")
      .notNull()
      .references(() => pagesTable.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
    role: memberRole("role").notNull().default("editor"),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.pageId, table.userId] }),
    index("page_member_user_id_idx").on(table.userId),
  ]
)

export const pageFollowersTable = pgTable(
  "page_follower",
  {
    pageId: uuid("page_id")
      .notNull()
      .references(() => pagesTable.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.pageId, table.userId] }),
    index("page_follower_user_id_idx").on(table.userId),
  ]
)

export const communitiesTable = pgTable(
  "community",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    actorId: uuid("actor_id")
      .notNull()
      .unique()
      .references(() => actorsTable.id, { onDelete: "cascade" }),
    ownerId: uuid("owner_id")
      .notNull()
      .references(() => userTable.id, { onDelete: "restrict" }),
    topicId: uuid("topic_id").references(() => topicsTable.id, {
      onDelete: "set null",
    }),
    name: varchar("name", { length: 128 }).notNull(),
    description: text("description"),
    image: text("image"),
    coverImage: text("cover_image"),
    visibility: profileVisibility("visibility").notNull().default("public"),
    memberCount: integer("member_count").notNull().default(0),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
    deletedAt: timestamp("deleted_at", { mode: "date" }),
  },
  (table) => [
    index("community_topic_id_idx").on(table.topicId),
    check("community_member_count_check", sql`${table.memberCount} >= 0`),
  ]
)

export const communityMembersTable = pgTable(
  "community_member",
  {
    communityId: uuid("community_id")
      .notNull()
      .references(() => communitiesTable.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
    role: memberRole("role").notNull().default("member"),
    flair: varchar("flair", { length: 64 }),
    joinedAt: timestamp("joined_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.communityId, table.userId] }),
    index("community_member_user_id_idx").on(table.userId),
  ]
)

export const communityRulesTable = pgTable(
  "community_rule",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    communityId: uuid("community_id")
      .notNull()
      .references(() => communitiesTable.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 128 }).notNull(),
    description: text("description"),
    position: integer("position").notNull().default(0),
  },
  (table) => [
    uniqueIndex("community_rule_position_key").on(
      table.communityId,
      table.position
    ),
  ]
)

export const communityPostsTable = pgTable(
  "community_post",
  {
    communityId: uuid("community_id")
      .notNull()
      .references(() => communitiesTable.id, { onDelete: "cascade" }),
    postId: uuid("post_id")
      .notNull()
      .unique()
      .references(() => postsTable.id, { onDelete: "cascade" }),
    isPinned: boolean("is_pinned").notNull().default(false),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.communityId, table.postId] }),
    index("community_post_community_id_created_at_idx").on(
      table.communityId,
      table.createdAt
    ),
  ]
)

export const communityFlairsTable = pgTable(
  "community_flair",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    communityId: uuid("community_id")
      .notNull()
      .references(() => communitiesTable.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 64 }).notNull(),
    color: varchar("color", { length: 32 }),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("community_flair_community_id_name_key").on(
      table.communityId,
      table.name
    ),
  ]
)

export const groupsTable = pgTable(
  "group",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    actorId: uuid("actor_id")
      .notNull()
      .unique()
      .references(() => actorsTable.id, { onDelete: "cascade" }),
    ownerId: uuid("owner_id")
      .notNull()
      .references(() => userTable.id, { onDelete: "restrict" }),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    image: text("image"),
    coverImage: text("cover_image"),
    visibility: profileVisibility("visibility").notNull().default("public"),
    requiresPostApproval: boolean("requires_post_approval")
      .notNull()
      .default(false),
    memberCount: integer("member_count").notNull().default(0),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
    deletedAt: timestamp("deleted_at", { mode: "date" }),
  },
  (table) => [
    index("group_owner_id_created_at_idx").on(table.ownerId, table.createdAt),
    check("group_member_count_check", sql`${table.memberCount} >= 0`),
  ]
)

export const groupMembersTable = pgTable(
  "group_member",
  {
    groupId: uuid("group_id")
      .notNull()
      .references(() => groupsTable.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
    role: memberRole("role").notNull().default("member"),
    joinedAt: timestamp("joined_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.groupId, table.userId] }),
    index("group_member_user_id_idx").on(table.userId),
  ]
)

export const groupRulesTable = pgTable(
  "group_rule",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    groupId: uuid("group_id")
      .notNull()
      .references(() => groupsTable.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 128 }).notNull(),
    description: text("description"),
    position: integer("position").notNull().default(0),
  },
  (table) => [
    uniqueIndex("group_rule_group_id_position_key").on(
      table.groupId,
      table.position
    ),
  ]
)

export const groupJoinRequestsTable = pgTable(
  "group_join_request",
  {
    groupId: uuid("group_id")
      .notNull()
      .references(() => groupsTable.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
    status: invitationStatus("status").notNull().default("pending"),
    answers: jsonb("answers").notNull().default(sql.raw("'[]'::jsonb")),
    requestedAt: timestamp("requested_at", { mode: "date" })
      .notNull()
      .defaultNow(),
    respondedAt: timestamp("responded_at", { mode: "date" }),
    respondedBy: uuid("responded_by").references(() => userTable.id, {
      onDelete: "set null",
    }),
  },
  (table) => [
    primaryKey({ columns: [table.groupId, table.userId] }),
    index("group_join_request_status_requested_at_idx").on(
      table.status,
      table.requestedAt
    ),
  ]
)

export const groupPostsTable = pgTable(
  "group_post",
  {
    groupId: uuid("group_id")
      .notNull()
      .references(() => groupsTable.id, { onDelete: "cascade" }),
    postId: uuid("post_id")
      .notNull()
      .unique()
      .references(() => postsTable.id, { onDelete: "cascade" }),
    approvalStatus: moderationStatus("approval_status")
      .notNull()
      .default("pending"),
    isPinned: boolean("is_pinned").notNull().default(false),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.groupId, table.postId] }),
    index("group_post_group_id_approval_status_idx").on(
      table.groupId,
      table.approvalStatus
    ),
  ]
)

export const groupPostApprovalsTable = pgTable(
  "group_post_approval",
  {
    groupId: uuid("group_id")
      .notNull()
      .references(() => groupsTable.id, { onDelete: "cascade" }),
    postId: uuid("post_id")
      .notNull()
      .references(() => postsTable.id, { onDelete: "cascade" }),
    reviewerId: uuid("reviewer_id").references(() => userTable.id, {
      onDelete: "set null",
    }),
    status: moderationStatus("status").notNull().default("pending"),
    reason: text("reason"),
    reviewedAt: timestamp("reviewed_at", { mode: "date" }),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.groupId, table.postId] })]
)

export const groupBansTable = pgTable(
  "group_ban",
  {
    groupId: uuid("group_id")
      .notNull()
      .references(() => groupsTable.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
    bannedBy: uuid("banned_by").references(() => userTable.id, {
      onDelete: "set null",
    }),
    reason: text("reason"),
    expiresAt: timestamp("expires_at", { mode: "date" }),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.groupId, table.userId] }),
    index("group_ban_user_id_idx").on(table.userId),
  ]
)

export const eventsTable = pgTable(
  "event",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    creatorId: uuid("creator_id")
      .notNull()
      .references(() => userTable.id, { onDelete: "restrict" }),
    hostActorId: uuid("host_actor_id").references(() => actorsTable.id, {
      onDelete: "set null",
    }),
    groupId: uuid("group_id").references(() => groupsTable.id, {
      onDelete: "set null",
    }),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    coverImage: text("cover_image"),
    visibility: postVisibility("visibility").notNull().default("public"),
    locationId: uuid("location_id").references(() => locationsTable.id, {
      onDelete: "set null",
    }),
    onlineUrl: text("online_url"),
    startsAt: timestamp("starts_at", { mode: "date" }).notNull(),
    endsAt: timestamp("ends_at", { mode: "date" }),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
    cancelledAt: timestamp("cancelled_at", { mode: "date" }),
  },
  (table) => [
    index("event_starts_at_visibility_idx").on(
      table.startsAt,
      table.visibility
    ),
    index("event_group_id_idx").on(table.groupId),
  ]
)

export const eventHostsTable = pgTable(
  "event_host",
  {
    eventId: uuid("event_id")
      .notNull()
      .references(() => eventsTable.id, { onDelete: "cascade" }),
    actorId: uuid("actor_id")
      .notNull()
      .references(() => actorsTable.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.eventId, table.actorId] }),
    index("event_host_actor_id_idx").on(table.actorId),
  ]
)

export const eventAttendeesTable = pgTable(
  "event_attendee",
  {
    eventId: uuid("event_id")
      .notNull()
      .references(() => eventsTable.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
    response: varchar("response", { length: 32 }).notNull().default("going"),
    respondedAt: timestamp("responded_at", { mode: "date" })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.eventId, table.userId] }),
    index("event_attendee_user_id_response_idx").on(
      table.userId,
      table.response
    ),
  ]
)

export const eventInvitationsTable = pgTable(
  "event_invitation",
  {
    eventId: uuid("event_id")
      .notNull()
      .references(() => eventsTable.id, { onDelete: "cascade" }),
    inviteeId: uuid("invitee_id")
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
    inviterId: uuid("inviter_id").references(() => userTable.id, {
      onDelete: "set null",
    }),
    status: invitationStatus("status").notNull().default("pending"),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    respondedAt: timestamp("responded_at", { mode: "date" }),
  },
  (table) => [
    primaryKey({ columns: [table.eventId, table.inviteeId] }),
    index("event_invitation_invitee_id_status_idx").on(
      table.inviteeId,
      table.status
    ),
  ]
)

export const eventPostsTable = pgTable(
  "event_post",
  {
    eventId: uuid("event_id")
      .notNull()
      .references(() => eventsTable.id, { onDelete: "cascade" }),
    postId: uuid("post_id")
      .notNull()
      .unique()
      .references(() => postsTable.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.eventId, table.postId] })]
)

export const reportsTable = pgTable(
  "report",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    reporterId: uuid("reporter_id")
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
    targetType: reportTargetType("target_type").notNull(),
    targetId: uuid("target_id").notNull(),
    reason: varchar("reason", { length: 128 }).notNull(),
    description: text("description"),
    status: reportStatus("status").notNull().default("open"),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => [
    index("report_status_created_at_idx").on(table.status, table.createdAt),
    index("report_target_idx").on(table.targetType, table.targetId),
    index("report_reporter_id_idx").on(table.reporterId),
  ]
)

export const moderationCasesTable = pgTable(
  "moderation_case",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    reportId: uuid("report_id").references(() => reportsTable.id, {
      onDelete: "set null",
    }),
    assignedTo: uuid("assigned_to").references(() => userTable.id, {
      onDelete: "set null",
    }),
    status: reportStatus("status").notNull().default("open"),
    decision: text("decision"),
    resolvedAt: timestamp("resolved_at", { mode: "date" }),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => [
    index("moderation_case_status_created_at_idx").on(
      table.status,
      table.createdAt
    ),
    index("moderation_case_assigned_to_idx").on(table.assignedTo),
  ]
)

export const moderationActionsTable = pgTable(
  "moderation_action",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    caseId: uuid("case_id").references(() => moderationCasesTable.id, {
      onDelete: "set null",
    }),
    moderatorId: uuid("moderator_id").references(() => userTable.id, {
      onDelete: "set null",
    }),
    targetType: reportTargetType("target_type").notNull(),
    targetId: uuid("target_id").notNull(),
    action: varchar("action", { length: 128 }).notNull(),
    reason: text("reason"),
    expiresAt: timestamp("expires_at", { mode: "date" }),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => [
    index("moderation_action_target_idx").on(table.targetType, table.targetId),
    index("moderation_action_moderator_id_idx").on(table.moderatorId),
  ]
)

export const appealsTable = pgTable(
  "appeal",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    moderationActionId: uuid("moderation_action_id")
      .notNull()
      .references(() => moderationActionsTable.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
    content: text("content").notNull(),
    status: reportStatus("status").notNull().default("open"),
    resolvedBy: uuid("resolved_by").references(() => userTable.id, {
      onDelete: "set null",
    }),
    resolvedAt: timestamp("resolved_at", { mode: "date" }),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("appeal_moderation_action_id_user_id_key").on(
      table.moderationActionId,
      table.userId
    ),
    index("appeal_status_created_at_idx").on(table.status, table.createdAt),
  ]
)

export const userStrikesTable = pgTable(
  "user_strike",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
    moderationActionId: uuid("moderation_action_id").references(
      () => moderationActionsTable.id,
      { onDelete: "set null" }
    ),
    reason: text("reason").notNull(),
    expiresAt: timestamp("expires_at", { mode: "date" }),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => [
    index("user_strike_user_id_expires_at_idx").on(
      table.userId,
      table.expiresAt
    ),
  ]
)

export const federatedInstancesTable = pgTable("federated_instance", {
  id: uuid("id").primaryKey().defaultRandom(),
  domain: varchar("domain", { length: 255 }).notNull().unique(),
  baseUrl: text("base_url").notNull(),
  software: varchar("software", { length: 64 }),
  isBlocked: boolean("is_blocked").notNull().default(false),
  lastSeenAt: timestamp("last_seen_at", { mode: "date" }),
  metadata: jsonb("metadata").notNull().default(sql.raw("'{}'::jsonb")),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
})

export const federatedActorsTable = pgTable(
  "federated_actor",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    instanceId: uuid("instance_id")
      .notNull()
      .references(() => federatedInstancesTable.id, { onDelete: "cascade" }),
    localActorId: uuid("local_actor_id").references(() => actorsTable.id, {
      onDelete: "set null",
    }),
    actorUri: text("actor_uri").notNull().unique(),
    username: varchar("username", { length: 255 }).notNull(),
    inboxUrl: text("inbox_url").notNull(),
    outboxUrl: text("outbox_url"),
    sharedInboxUrl: text("shared_inbox_url"),
    publicKey: text("public_key"),
    profile: jsonb("profile").notNull().default(sql.raw("'{}'::jsonb")),
    fetchedAt: timestamp("fetched_at", { mode: "date" }).notNull().defaultNow(),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => [
    index("federated_actor_instance_id_idx").on(table.instanceId),
    index("federated_actor_username_idx").on(table.username),
  ]
)

export const federatedPostsTable = pgTable(
  "federated_post",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    federatedActorId: uuid("federated_actor_id")
      .notNull()
      .references(() => federatedActorsTable.id, { onDelete: "cascade" }),
    localPostId: uuid("local_post_id").references(() => postsTable.id, {
      onDelete: "set null",
    }),
    objectUri: text("object_uri").notNull().unique(),
    object: jsonb("object").notNull(),
    publishedAt: timestamp("published_at", { mode: "date" }),
    fetchedAt: timestamp("fetched_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => [
    index("federated_post_actor_id_published_at_idx").on(
      table.federatedActorId,
      table.publishedAt
    ),
  ]
)

export const federationActivitiesTable = pgTable(
  "federation_activity",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    direction: federationDirection("direction").notNull(),
    actorUri: text("actor_uri").notNull(),
    activityUri: text("activity_uri").unique(),
    activityType: varchar("activity_type", { length: 64 }).notNull(),
    payload: jsonb("payload").notNull(),
    status: deliveryStatus("status").notNull().default("pending"),
    attemptCount: integer("attempt_count").notNull().default(0),
    availableAt: timestamp("available_at", { mode: "date" })
      .notNull()
      .defaultNow(),
    processedAt: timestamp("processed_at", { mode: "date" }),
    error: text("error"),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => [
    index("federation_activity_status_available_at_idx").on(
      table.status,
      table.availableAt
    ),
  ]
)

export const contentInsightsDailyTable = pgTable(
  "content_insight_daily",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    entityType: entityType("entity_type").notNull(),
    entityId: uuid("entity_id").notNull(),
    day: timestamp("day", { mode: "date" }).notNull(),
    impressions: integer("impressions").notNull().default(0),
    reach: integer("reach").notNull().default(0),
    views: integer("views").notNull().default(0),
    replays: integer("replays").notNull().default(0),
    watchTimeSeconds: integer("watch_time_seconds").notNull().default(0),
    reactions: integer("reactions").notNull().default(0),
    comments: integer("comments").notNull().default(0),
    shares: integer("shares").notNull().default(0),
    saves: integer("saves").notNull().default(0),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("content_insight_daily_entity_day_key").on(
      table.entityType,
      table.entityId,
      table.day
    ),
  ]
)

export const contentImpressionsTable = pgTable(
  "content_impression",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => userTable.id, {
      onDelete: "set null",
    }),
    postId: uuid("post_id")
      .notNull()
      .references(() => postsTable.id, { onDelete: "cascade" }),
    feed: varchar("feed", { length: 64 }),
    position: integer("position"),
    sessionId: varchar("session_id", { length: 128 }),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => [
    index("content_impression_post_id_created_at_idx").on(
      table.postId,
      table.createdAt
    ),
    index("content_impression_user_id_created_at_idx").on(
      table.userId,
      table.createdAt
    ),
  ]
)

export const contentViewsTable = pgTable(
  "content_view",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => userTable.id, {
      onDelete: "set null",
    }),
    postId: uuid("post_id")
      .notNull()
      .references(() => postsTable.id, { onDelete: "cascade" }),
    sessionId: varchar("session_id", { length: 128 }),
    watchTimeSeconds: integer("watch_time_seconds").notNull().default(0),
    completed: boolean("completed").notNull().default(false),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => [
    index("content_view_post_id_created_at_idx").on(
      table.postId,
      table.createdAt
    ),
  ]
)

export const feedEventsTable = pgTable(
  "feed_event",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => userTable.id, {
      onDelete: "set null",
    }),
    postId: uuid("post_id").references(() => postsTable.id, {
      onDelete: "cascade",
    }),
    eventType: varchar("event_type", { length: 64 }).notNull(),
    feed: varchar("feed", { length: 64 }),
    metadata: jsonb("metadata").notNull().default(sql.raw("'{}'::jsonb")),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => [
    index("feed_event_user_id_created_at_idx").on(
      table.userId,
      table.createdAt
    ),
    index("feed_event_event_type_created_at_idx").on(
      table.eventType,
      table.createdAt
    ),
  ]
)

export const userInterestsTable = pgTable(
  "user_interest",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
    topicId: uuid("topic_id")
      .notNull()
      .references(() => topicsTable.id, { onDelete: "cascade" }),
    score: integer("score").notNull().default(0),
    updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.userId, table.topicId] }),
    index("user_interest_topic_id_score_idx").on(table.topicId, table.score),
  ]
)

export const trendingTopicsTable = pgTable(
  "trending_topic",
  {
    topicId: uuid("topic_id")
      .notNull()
      .references(() => topicsTable.id, { onDelete: "cascade" }),
    region: varchar("region", { length: 32 }).notNull().default("global"),
    score: integer("score").notNull().default(0),
    startsAt: timestamp("starts_at", { mode: "date" }).notNull(),
    endsAt: timestamp("ends_at", { mode: "date" }).notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.topicId, table.region, table.startsAt] }),
    index("trending_topic_region_score_idx").on(table.region, table.score),
  ]
)

export type User = typeof userTable.$inferSelect
export type NewUser = typeof userTable.$inferInsert
export type Profile = typeof profilesTable.$inferSelect
export type NewProfile = typeof profilesTable.$inferInsert
export type Follow = typeof followsTable.$inferSelect
export type NewFollow = typeof followsTable.$inferInsert
export type Friendship = typeof friendshipsTable.$inferSelect
export type NewFriendship = typeof friendshipsTable.$inferInsert
export type Block = typeof blocksTable.$inferSelect
export type NewBlock = typeof blocksTable.$inferInsert
export type Post = typeof postsTable.$inferSelect
export type NewPost = typeof postsTable.$inferInsert
export type PostChannel = typeof postChannelsTable.$inferSelect
export type NewPostChannel = typeof postChannelsTable.$inferInsert
export type PostMedia = typeof postMediaTable.$inferSelect
export type NewPostMedia = typeof postMediaTable.$inferInsert
export type Story = typeof storiesTable.$inferSelect
export type NewStory = typeof storiesTable.$inferInsert
export type StoryView = typeof storyViewsTable.$inferSelect
export type NewStoryView = typeof storyViewsTable.$inferInsert
export type Hashtag = typeof hashtagsTable.$inferSelect
export type NewHashtag = typeof hashtagsTable.$inferInsert
export type PostHashtag = typeof postHashtagsTable.$inferSelect
export type NewPostHashtag = typeof postHashtagsTable.$inferInsert
export type Actor = typeof actorsTable.$inferSelect
export type NewActor = typeof actorsTable.$inferInsert
export type ProfileLink = typeof profileLinksTable.$inferSelect
export type NewProfileLink = typeof profileLinksTable.$inferInsert
export type Mute = typeof mutesTable.$inferSelect
export type NewMute = typeof mutesTable.$inferInsert
export type Restriction = typeof restrictionsTable.$inferSelect
export type NewRestriction = typeof restrictionsTable.$inferInsert
export type CloseFriend = typeof closeFriendsTable.$inferSelect
export type NewCloseFriend = typeof closeFriendsTable.$inferInsert
export type CustomAudience = typeof customAudiencesTable.$inferSelect
export type NewCustomAudience = typeof customAudiencesTable.$inferInsert
export type CustomAudienceMember =
  typeof customAudienceMembersTable.$inferSelect
export type NewCustomAudienceMember =
  typeof customAudienceMembersTable.$inferInsert
export type Location = typeof locationsTable.$inferSelect
export type NewLocation = typeof locationsTable.$inferInsert
export type LinkPreview = typeof linkPreviewsTable.$inferSelect
export type NewLinkPreview = typeof linkPreviewsTable.$inferInsert
export type PostAudience = typeof postAudiencesTable.$inferSelect
export type NewPostAudience = typeof postAudiencesTable.$inferInsert
export type PostMention = typeof postMentionsTable.$inferSelect
export type NewPostMention = typeof postMentionsTable.$inferInsert
export type PostUserTag = typeof postUserTagsTable.$inferSelect
export type NewPostUserTag = typeof postUserTagsTable.$inferInsert
export type PostCollaborator = typeof postCollaboratorsTable.$inferSelect
export type NewPostCollaborator = typeof postCollaboratorsTable.$inferInsert
export type PostRepost = typeof postRepostsTable.$inferSelect
export type NewPostRepost = typeof postRepostsTable.$inferInsert
export type Poll = typeof pollsTable.$inferSelect
export type NewPoll = typeof pollsTable.$inferInsert
export type PollOption = typeof pollOptionsTable.$inferSelect
export type NewPollOption = typeof pollOptionsTable.$inferInsert
export type PollVote = typeof pollVotesTable.$inferSelect
export type NewPollVote = typeof pollVotesTable.$inferInsert
export type StoryReply = typeof storyRepliesTable.$inferSelect
export type NewStoryReply = typeof storyRepliesTable.$inferInsert
export type StorySticker = typeof storyStickersTable.$inferSelect
export type NewStorySticker = typeof storyStickersTable.$inferInsert
export type StoryArchive = typeof storyArchivesTable.$inferSelect
export type NewStoryArchive = typeof storyArchivesTable.$inferInsert
export type StoryHighlight = typeof storyHighlightsTable.$inferSelect
export type NewStoryHighlight = typeof storyHighlightsTable.$inferInsert
export type StoryHighlightItem = typeof storyHighlightItemsTable.$inferSelect
export type NewStoryHighlightItem = typeof storyHighlightItemsTable.$inferInsert
export type AudioTrack = typeof audioTracksTable.$inferSelect
export type NewAudioTrack = typeof audioTracksTable.$inferInsert
export type ReelAudio = typeof reelAudioTable.$inferSelect
export type NewReelAudio = typeof reelAudioTable.$inferInsert
export type ReelClip = typeof reelClipsTable.$inferSelect
export type NewReelClip = typeof reelClipsTable.$inferInsert
export type ReelRemix = typeof reelRemixesTable.$inferSelect
export type NewReelRemix = typeof reelRemixesTable.$inferInsert
export type Topic = typeof topicsTable.$inferSelect
export type NewTopic = typeof topicsTable.$inferInsert
export type PostTopic = typeof postTopicsTable.$inferSelect
export type NewPostTopic = typeof postTopicsTable.$inferInsert
export type UserTopicFollow = typeof userTopicFollowsTable.$inferSelect
export type NewUserTopicFollow = typeof userTopicFollowsTable.$inferInsert
export type ProfileTopic = typeof profileTopicsTable.$inferSelect
export type NewProfileTopic = typeof profileTopicsTable.$inferInsert
export type CustomFeed = typeof customFeedsTable.$inferSelect
export type NewCustomFeed = typeof customFeedsTable.$inferInsert
export type CustomFeedSource = typeof customFeedSourcesTable.$inferSelect
export type NewCustomFeedSource = typeof customFeedSourcesTable.$inferInsert
export type OutboxEvent = typeof outboxEventsTable.$inferSelect
export type NewOutboxEvent = typeof outboxEventsTable.$inferInsert
export type Page = typeof pagesTable.$inferSelect
export type NewPage = typeof pagesTable.$inferInsert
export type PageMember = typeof pageMembersTable.$inferSelect
export type NewPageMember = typeof pageMembersTable.$inferInsert
export type PageFollower = typeof pageFollowersTable.$inferSelect
export type NewPageFollower = typeof pageFollowersTable.$inferInsert
export type Community = typeof communitiesTable.$inferSelect
export type NewCommunity = typeof communitiesTable.$inferInsert
export type CommunityMember = typeof communityMembersTable.$inferSelect
export type NewCommunityMember = typeof communityMembersTable.$inferInsert
export type CommunityRule = typeof communityRulesTable.$inferSelect
export type NewCommunityRule = typeof communityRulesTable.$inferInsert
export type CommunityPost = typeof communityPostsTable.$inferSelect
export type NewCommunityPost = typeof communityPostsTable.$inferInsert
export type CommunityFlair = typeof communityFlairsTable.$inferSelect
export type NewCommunityFlair = typeof communityFlairsTable.$inferInsert
export type Group = typeof groupsTable.$inferSelect
export type NewGroup = typeof groupsTable.$inferInsert
export type GroupMember = typeof groupMembersTable.$inferSelect
export type NewGroupMember = typeof groupMembersTable.$inferInsert
export type GroupRule = typeof groupRulesTable.$inferSelect
export type NewGroupRule = typeof groupRulesTable.$inferInsert
export type GroupJoinRequest = typeof groupJoinRequestsTable.$inferSelect
export type NewGroupJoinRequest = typeof groupJoinRequestsTable.$inferInsert
export type GroupPost = typeof groupPostsTable.$inferSelect
export type NewGroupPost = typeof groupPostsTable.$inferInsert
export type GroupPostApproval = typeof groupPostApprovalsTable.$inferSelect
export type NewGroupPostApproval = typeof groupPostApprovalsTable.$inferInsert
export type GroupBan = typeof groupBansTable.$inferSelect
export type NewGroupBan = typeof groupBansTable.$inferInsert
export type Event = typeof eventsTable.$inferSelect
export type NewEvent = typeof eventsTable.$inferInsert
export type EventHost = typeof eventHostsTable.$inferSelect
export type NewEventHost = typeof eventHostsTable.$inferInsert
export type EventAttendee = typeof eventAttendeesTable.$inferSelect
export type NewEventAttendee = typeof eventAttendeesTable.$inferInsert
export type EventInvitation = typeof eventInvitationsTable.$inferSelect
export type NewEventInvitation = typeof eventInvitationsTable.$inferInsert
export type EventPost = typeof eventPostsTable.$inferSelect
export type NewEventPost = typeof eventPostsTable.$inferInsert
export type Report = typeof reportsTable.$inferSelect
export type NewReport = typeof reportsTable.$inferInsert
export type ModerationCase = typeof moderationCasesTable.$inferSelect
export type NewModerationCase = typeof moderationCasesTable.$inferInsert
export type ModerationAction = typeof moderationActionsTable.$inferSelect
export type NewModerationAction = typeof moderationActionsTable.$inferInsert
export type Appeal = typeof appealsTable.$inferSelect
export type NewAppeal = typeof appealsTable.$inferInsert
export type UserStrike = typeof userStrikesTable.$inferSelect
export type NewUserStrike = typeof userStrikesTable.$inferInsert
export type FederatedInstance = typeof federatedInstancesTable.$inferSelect
export type NewFederatedInstance = typeof federatedInstancesTable.$inferInsert
export type FederatedActor = typeof federatedActorsTable.$inferSelect
export type NewFederatedActor = typeof federatedActorsTable.$inferInsert
export type FederatedPost = typeof federatedPostsTable.$inferSelect
export type NewFederatedPost = typeof federatedPostsTable.$inferInsert
export type FederationActivity = typeof federationActivitiesTable.$inferSelect
export type NewFederationActivity =
  typeof federationActivitiesTable.$inferInsert
export type ContentInsightDaily = typeof contentInsightsDailyTable.$inferSelect
export type NewContentInsightDaily =
  typeof contentInsightsDailyTable.$inferInsert
export type ContentImpression = typeof contentImpressionsTable.$inferSelect
export type NewContentImpression = typeof contentImpressionsTable.$inferInsert
export type ContentView = typeof contentViewsTable.$inferSelect
export type NewContentView = typeof contentViewsTable.$inferInsert
export type FeedEvent = typeof feedEventsTable.$inferSelect
export type NewFeedEvent = typeof feedEventsTable.$inferInsert
export type UserInterest = typeof userInterestsTable.$inferSelect
export type NewUserInterest = typeof userInterestsTable.$inferInsert
export type TrendingTopic = typeof trendingTopicsTable.$inferSelect
export type NewTrendingTopic = typeof trendingTopicsTable.$inferInsert

// Shared operational tables used by the Hono server on serverless runtimes.

export type UserRow = typeof userTable.$inferSelect
