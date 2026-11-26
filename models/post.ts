import { type CrudActor, type CrudListOptions } from "@/database/crud"
import { sql } from "drizzle-orm"
import { rawSocialRows, rawPostReadSql, rawAudienceSql, rawUnblockedSql, rawSocialError, rawCheckPostAccess, rawCheckStoryAccess, rawCheckInteraction, rawLockSocialActor, rawAppendSocialEvent } from "@/models/index"
import { idSchema, postInputSchema, postUpdateSchema, feedQuerySchema, storyInputSchema } from "@/schemas/social"
import "server-only"
import { rawAssertSocialWriteAllowed, rawFilterSocialPolicy } from "@/services/social-policy"
import { createHash } from "node:crypto"
import { getDatabase } from "@/database"
import { type z } from "@gorth-com/structure/cores/zod"
import { rawInspectSocialAsset } from "@/services/social-media"
import { socialPostProjection } from "@/schemas/social-selection"

export async function rawIsPostOwner(id: string | null, actor: CrudActor) {
  if (!id) return false
  const [p] = await rawSocialRows(
    sql`SELECT author_id FROM post WHERE id=${id}::uuid`
  )
  return p?.author_id === actor.userId
}
export function rawListPosts(actor: CrudActor, options: CrudListOptions = {}) {
  return rawListSocialPosts(actor, options)
}
export function rawGetPost(
  actor: CrudActor,
  params: Record<string, string | undefined>
) {
  return rawGetSocialPost(actor, idSchema.parse(params.id))
}
export async function rawCreatePost(actor: CrudActor, input: unknown) {
  const [u] = await rawSocialRows(
    sql`SELECT external_user_id FROM "user" WHERE id=${actor.userId}::uuid`
  )
  return rawCreateSocialPost(actor, String(u.external_user_id), input)
}
export function rawUpdatePost(
  actor: CrudActor,
  params: Record<string, string | undefined>,
  input: unknown
) {
  return rawUpdateSocialPost(actor, idSchema.parse(params.id), input)
}
export function rawDeletePost(
  actor: CrudActor,
  params: Record<string, string | undefined>
) {
  return rawDeleteSocialPost(actor, idSchema.parse(params.id))
}

export async function rawListSocialPosts(
  actor: CrudActor,
  input: z.input<typeof feedQuerySchema> = {}
) {
  const q = feedQuerySchema.parse(input),
    where = sql`${rawPostReadSql(actor.userId)} ${q.mode === "mine" ? sql`AND p.author_id=${actor.userId}::uuid` : sql`AND p.status='published' AND p.published_at<=clock_timestamp()`} AND NOT EXISTS(SELECT 1 FROM mute m WHERE m.user_id=${actor.userId}::uuid AND m.muted_user_id=p.author_id AND (m.expires_at IS NULL OR m.expires_at>clock_timestamp())) AND NOT EXISTS(SELECT 1 FROM social_hidden_post h WHERE h.user_id=${actor.userId}::uuid AND h.post_id=p.id) ${q.authorId ? sql`AND p.author_id=${q.authorId}::uuid` : sql``} ${q.mode === "following" ? sql`AND (p.author_id=${actor.userId}::uuid OR EXISTS(SELECT 1 FROM follow WHERE follower_id=${actor.userId}::uuid AND following_id=p.author_id AND status='accepted'))` : sql``} ${q.mode === "reel" ? sql`AND p.type='reel'` : q.mode === "tweet" ? sql`AND p.type='tweet'` : sql``} ${q.groupId ? sql`AND p.group_id=${q.groupId}::uuid` : sql``} ${q.communityId ? sql`AND p.community_id=${q.communityId}::uuid` : sql``} ${q.feedId ? sql`AND EXISTS(SELECT 1 FROM custom_feed cf JOIN custom_feed_source fs ON fs.feed_id=cf.id WHERE cf.id=${q.feedId}::uuid AND cf.owner_id=${actor.userId}::uuid AND fs.source_type='user' AND fs.source_id=p.author_id)` : sql``} ${q.q ? sql`AND strpos(lower(coalesce(p.content,'')),lower(${q.q}))>0` : sql``}`
  const rows = await rawSocialRows(
    sql`SELECT ${socialPostProjection} FROM post p JOIN "user" u ON u.id=p.author_id WHERE ${where} ORDER BY p.published_at DESC,p.id DESC LIMIT ${q.limit + 1} OFFSET ${q.offset}`
  )
  return {
    data: await rawFilterSocialPolicy(rows.slice(0, q.limit)),
    pagination: {
      limit: q.limit,
      offset: q.offset,
      hasMore: rows.length > q.limit,
    },
  }
}
export async function rawGetSocialPost(actor: CrudActor, id: string) {
  await rawCheckPostAccess(id, actor.userId)
  const [p] = await rawSocialRows(
    sql`SELECT ${socialPostProjection} FROM post p JOIN "user" u ON u.id=p.author_id WHERE p.id=${id}::uuid AND ${rawPostReadSql(actor.userId)}`
  )
  if (!p) rawSocialError(404, "post_not_found")
  return p
}
export async function rawCreateSocialPost(
  actor: CrudActor,
  externalId: string,
  input: unknown
) {
  await rawAssertSocialWriteAllowed(actor.userId)
  const v = postInputSchema.parse(input),
    fingerprint = createHash("sha256").update(JSON.stringify(v)).digest("hex")
  const [duplicate] = await rawSocialRows(
    sql`SELECT id,request_fingerprint FROM post WHERE author_id=${actor.userId}::uuid AND client_request_id=${v.clientRequestId}::uuid`
  )
  if (duplicate) {
    if (duplicate.request_fingerprint !== fingerprint)
      rawSocialError(409, "idempotency_conflict")
    return rawGetSocialPost(actor, String(duplicate.id))
  }
  const assets = await Promise.all(
    v.assetIds.map((id) => rawInspectSocialAsset(id, externalId))
  )
  if (new Set(v.assetIds).size !== v.assetIds.length)
    rawSocialError(400, "duplicate_asset")
  if (
    v.type === "reel" &&
    (assets.length !== 1 || !assets[0].contentType.startsWith("video/"))
  )
    rawSocialError(400, "reel_requires_video")
  const id = await getDatabase().transaction(async (tx) => {
    await rawLockSocialActor(actor.userId, tx)
    const [old] = await rawSocialRows(
      sql`SELECT id,request_fingerprint FROM post WHERE author_id=${actor.userId}::uuid AND client_request_id=${v.clientRequestId}::uuid`,
      tx
    )
    if (old) {
      if (old.request_fingerprint !== fingerprint)
        rawSocialError(409, "idempotency_conflict")
      return String(old.id)
    }
    const [rate] = await rawSocialRows(
      sql`SELECT count(*)::int n FROM post WHERE author_id=${actor.userId}::uuid AND created_at>clock_timestamp()-interval '1 minute'`,
      tx
    )
    if (Number(rate.n) >= 10) rawSocialError(429, "post_rate_limited")
    let status = v.status,
      reviewRequested = false
    for (const [target, action] of [
      [v.parentPostId, "comment"],
      [v.quotedPostId, "share"],
      [v.repostOfId, "share"],
    ] as const) {
      if (target)
        await rawCheckInteraction(target, actor.userId, action, tx)
    }
    for (const [kind, target] of [
      ["group", v.groupId],
      ["community", v.communityId],
    ] as const) {
      if (!target) continue
      const table = sql.identifier(kind),
        member = sql.identifier(kind + "_member"),
        column = sql.identifier(kind + "_id")
      const [hub] = await rawSocialRows(
        sql`SELECT h.*,m.role FROM ${table} h JOIN ${member} m ON m.${column}=h.id AND m.user_id=${actor.userId}::uuid WHERE h.id=${target}::uuid AND h.deleted_at IS NULL FOR UPDATE OF h`,
        tx
      )
      if (!hub) rawSocialError(403, "membership_required")
      if (
        kind === "group" &&
        hub.requires_post_approval &&
        !["owner", "admin", "moderator"].includes(String(hub.role))
      ) {
        if (status === "scheduled")
          rawSocialError(403, "moderator_schedule_required")
        if (status === "published") {
          status = "draft"
          reviewRequested = true
        }
      }
    }
    if (
      status === "scheduled" &&
      (!v.scheduledAt || Date.parse(v.scheduledAt) <= Date.now())
    )
      rawSocialError(400, "invalid_schedule")
    if (!["published", "draft", "scheduled"].includes(status))
      rawSocialError(400, "invalid_create_status")
    const [p] = await rawSocialRows(
      sql`INSERT INTO post(author_id,type,format,status,visibility,reply_policy,quote_policy,content,location,language_code,is_sensitive,client_request_id,request_fingerprint,review_requested,parent_post_id,quoted_post_id,repost_of_id,group_id,community_id,scheduled_at) VALUES(${actor.userId}::uuid,${v.type},${assets.length ? (assets[0].contentType.startsWith("video/") ? "video" : assets.length > 1 ? "carousel" : "image") : v.format},${status},${v.visibility},${v.replyPolicy},${v.quotePolicy},${v.content},${v.location ?? null},${v.languageCode ?? null},${v.isSensitive},${v.clientRequestId}::uuid,${fingerprint},${reviewRequested},${v.parentPostId ?? null}::uuid,${v.quotedPostId ?? null}::uuid,${v.repostOfId ?? null}::uuid,${v.groupId ?? null}::uuid,${v.communityId ?? null}::uuid,${v.scheduledAt ?? null}::timestamp) RETURNING id`,
      tx
    )
    for (let i = 0; i < assets.length; i++) {
      const a = assets[i]
      await tx.execute(
        sql`INSERT INTO post_media(post_id,type,url,media_asset_id,mime_type,file_size,position) VALUES(${p.id}::uuid,${a.contentType.startsWith("video/") ? "video" : "image"},${"/social/asset/" + a.id},${a.id}::uuid,${a.contentType},${a.size},${i})`
      )
    }
    for (const [target, column] of [
      [v.parentPostId, "reply_count"],
      [v.quotedPostId, "quote_count"],
      [v.repostOfId, "repost_count"],
    ] as const) {
      if (target)
        await tx.execute(
          sql`UPDATE post SET ${sql.identifier(column)}=${sql.identifier(column)}+1 WHERE id=${target}::uuid`
        )
    }
    await rawAppendSocialEvent(
      tx,
      "post.created",
      String(p.id),
      actor.userId
    )
    return String(p.id)
  })
  return rawGetSocialPost(actor, id)
}
export async function rawUpdateSocialPost(
  actor: CrudActor,
  id: string,
  input: unknown
) {
  await rawAssertSocialWriteAllowed(actor.userId)
  const v = postUpdateSchema.parse(input)
  if (v.status && !["published", "draft", "archived"].includes(v.status))
    rawSocialError(400, "invalid_status_transition")
  const [u] = await rawSocialRows(
    sql`SELECT external_user_id FROM "user" WHERE id=${actor.userId}::uuid`
  )
  const assets = await Promise.all(
    v.assetIds.map((id) =>
      rawInspectSocialAsset(id, String(u.external_user_id))
    )
  )
  await getDatabase().transaction(async (tx) => {
    await rawLockSocialActor(actor.userId, tx)
    const [p] = await rawSocialRows(
      sql`SELECT * FROM post WHERE id=${id}::uuid FOR UPDATE`,
      tx
    )
    if (!p || p.deleted_at) rawSocialError(404, "post_not_found")
    if (p.author_id !== actor.userId)
      rawSocialError(403, "post_owner_required")
    if (p.version !== v.version)
      rawSocialError(409, "post_version_conflict")
    let nextStatus = v.status ?? String(p.status),
      reviewRequested = Boolean(p.review_requested)
    for (const [kind, target] of [
      ["group", p.group_id],
      ["community", p.community_id],
    ] as const) {
      if (!target) continue
      const [member] = await rawSocialRows(
        sql`SELECT h.*,m.role FROM ${sql.identifier(kind)} h JOIN ${sql.identifier(kind + "_member")} m ON m.${sql.identifier(kind + "_id")}=h.id AND m.user_id=${actor.userId}::uuid WHERE h.id=${target}::uuid AND h.deleted_at IS NULL FOR UPDATE OF h`,
        tx
      )
      if (!member) rawSocialError(403, "membership_required")
      if (
        kind === "group" &&
        member.requires_post_approval &&
        !["owner", "admin", "moderator"].includes(String(member.role)) &&
        nextStatus === "published"
      ) {
        nextStatus = "draft"
        reviewRequested = true
      }
    }
    for (const assetId of v.removeAssetIds)
      await tx.execute(
        sql`DELETE FROM post_media WHERE post_id=${id}::uuid AND media_asset_id=${assetId}::uuid`
      )
    for (const a of assets)
      await tx.execute(
        sql`INSERT INTO post_media(post_id,type,url,media_asset_id,mime_type,file_size,position) VALUES(${id}::uuid,${a.contentType.startsWith("video/") ? "video" : "image"},${"/social/asset/" + a.id},${a.id}::uuid,${a.contentType},${a.size},(SELECT count(*)::int FROM post_media WHERE post_id=${id}::uuid))`
      )
    const [count] = await rawSocialRows(
      sql`SELECT count(*)::int n FROM post_media WHERE post_id=${id}::uuid`,
      tx
    )
    if (
      Number(count.n) > 10 ||
      (p.type === "reel" &&
        (Number(count.n) !== 1 ||
          assets.some((a) => !a.contentType.startsWith("video/"))))
    )
      rawSocialError(400, "invalid_media_count")
    await tx.execute(
      sql`UPDATE post SET content=${v.content ?? p.content},visibility=${v.visibility ?? p.visibility},reply_policy=${v.replyPolicy ?? p.reply_policy},quote_policy=${v.quotePolicy ?? p.quote_policy},is_sensitive=${v.isSensitive ?? p.is_sensitive},status=${nextStatus},review_requested=${reviewRequested},edited_at=clock_timestamp(),updated_at=clock_timestamp(),version=version+1 WHERE id=${id}::uuid`
    )
    await rawAppendSocialEvent(tx, "post.updated", id, actor.userId)
  })
  return rawGetSocialPost(actor, id)
}
export async function rawDeleteSocialPost(actor: CrudActor, id: string) {
  await getDatabase().transaction(async (tx) => {
    await rawLockSocialActor(actor.userId, tx)
    const [p] = await rawSocialRows(
      sql`SELECT * FROM post WHERE id=${id}::uuid FOR UPDATE`,
      tx
    )
    if (!p || p.author_id !== actor.userId)
      rawSocialError(403, "post_owner_required")
    if (!p.deleted_at) {
      await tx.execute(
        sql`UPDATE post SET deleted_at=clock_timestamp(),status='deleted',content=NULL,version=version+1 WHERE id=${id}::uuid`
      )
      for (const [target, column] of [
        [p.parent_post_id, "reply_count"],
        [p.quoted_post_id, "quote_count"],
        [p.repost_of_id, "repost_count"],
      ] as const) {
        if (target)
          await tx.execute(
            sql`UPDATE post SET ${sql.identifier(column)}=GREATEST(0,${sql.identifier(column)}-1) WHERE id=${target}::uuid`
          )
      }
      await rawAppendSocialEvent(tx, "post.deleted", id, actor.userId)
    }
  })
  return { id }
}
export async function rawHideSocialPost(actor: CrudActor, id: string) {
  await rawCheckPostAccess(id, actor.userId)
  await getDatabase().execute(
    sql`INSERT INTO social_hidden_post VALUES(${actor.userId}::uuid,${id}::uuid) ON CONFLICT DO NOTHING`
  )
  return { id }
}
export async function rawListSocialStories(
  actor: CrudActor,
  options: CrudListOptions = {},
  storyId?: string
) {
  return {
    data: await rawFilterSocialPolicy(
      await rawSocialRows(
        sql`SELECT s.id,s.author_id AS "authorId",s.caption,s.visibility,s.expires_at AS "expiresAt",s.media_type AS "mediaType",'/social/asset/'||s.media_asset_id::text AS "mediaUrl",u.name FROM story s JOIN "user" u ON u.id=s.author_id WHERE s.status='published' ${storyId ? sql`AND s.id=${storyId}::uuid` : sql``} AND EXISTS(SELECT 1 FROM "user" au WHERE au.id=s.author_id AND au.status='active') AND s.expires_at>clock_timestamp() AND NOT s.is_archived AND s.media_asset_id IS NOT NULL AND ${rawAudienceSql(sql`s.author_id`, sql`s.visibility`, actor.userId)} AND ${rawUnblockedSql(sql`s.author_id`, actor.userId)} ORDER BY s.created_at DESC,s.id DESC LIMIT ${Math.min(options.limit ?? 20, 100)} OFFSET ${options.offset ?? 0}`
      )
    ),
  }
}
export async function rawCreateSocialStory(
  actor: CrudActor,
  externalId: string,
  input: unknown
) {
  await rawAssertSocialWriteAllowed(actor.userId)
  const v = storyInputSchema.parse(input)
  if (
    Date.parse(v.expiresAt) <= Date.now() ||
    Date.parse(v.expiresAt) > Date.now() + 86400000
  )
    rawSocialError(400, "invalid_story_expiration")
  const a = await rawInspectSocialAsset(v.assetId, externalId)
  return getDatabase().transaction(async (tx) => {
    await rawLockSocialActor(actor.userId, tx)
    const [s] = await rawSocialRows(
      sql`INSERT INTO story(author_id,media_type,media_url,media_asset_id,caption,visibility,expires_at) VALUES(${actor.userId}::uuid,${a.contentType.startsWith("video/") ? "video" : "image"},${"/social/asset/" + a.id},${a.id}::uuid,${v.caption},${v.visibility},${v.expiresAt}::timestamp) RETURNING id`,
      tx
    )
    await rawAppendSocialEvent(
      tx,
      "story.created",
      String(s.id),
      actor.userId
    )
    return s
  })
}
export async function rawViewSocialStory(actor: CrudActor, id: string) {
  await rawCheckStoryAccess(id, actor.userId)
  await getDatabase().execute(
    sql`INSERT INTO story_view(story_id,viewer_id) VALUES(${id}::uuid,${actor.userId}::uuid) ON CONFLICT DO NOTHING`
  )
  return { id }
}
