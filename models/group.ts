import "server-only"
import { sql } from "drizzle-orm"
import { getDatabase } from "@/database"
import type { CrudActor } from "@/database/crud"
import { rawSocialRows, rawSocialError, rawLockSocialActor, rawAppendSocialEvent } from "@/models/index"
import { socialPostProjection } from "@/schemas/social-selection"
export async function rawGroupReviewQueue(actor: CrudActor, groupId: string) {
  const [m] = await rawSocialRows(
    sql`SELECT role FROM group_member WHERE group_id=${groupId}::uuid AND user_id=${actor.userId}::uuid`
  )
  if (!m || !["owner", "admin", "moderator"].includes(String(m.role)))
    rawSocialError(403, "moderator_required")
  return {
    data: await rawSocialRows(
      sql`SELECT ${socialPostProjection} FROM post p JOIN "user" u ON u.id=p.author_id WHERE p.group_id=${groupId}::uuid AND p.status='draft' AND p.review_requested AND p.deleted_at IS NULL ORDER BY p.created_at,p.id LIMIT 100`
    ),
  }
}
export async function rawModerateGroupPost(
  actor: CrudActor,
  id: string,
  decision: "approve" | "reject",
  version: number
) {
  return getDatabase().transaction(async (tx) => {
    await rawLockSocialActor(actor.userId, tx)
    const [p] = await rawSocialRows(
      sql`SELECT * FROM post WHERE id=${id}::uuid AND group_id IS NOT NULL FOR UPDATE`,
      tx
    )
    if (!p || p.deleted_at) rawSocialError(404, "post_not_found")
    const [m] = await rawSocialRows(
      sql`SELECT role FROM group_member WHERE group_id=${p.group_id}::uuid AND user_id=${actor.userId}::uuid`,
      tx
    )
    if (!m || !["owner", "admin", "moderator"].includes(String(m.role)))
      rawSocialError(403, "moderator_required")
    if (p.status !== "draft" || !p.review_requested || p.version !== version)
      rawSocialError(409, "review_version_conflict")
    await tx.execute(
      sql`UPDATE post SET status=${decision === "approve" ? "published" : "archived"},published_at=clock_timestamp(),review_requested=false,version=version+1,updated_at=clock_timestamp() WHERE id=${id}::uuid`
    )
    await rawAppendSocialEvent(tx, "post.updated", id, actor.userId)
    return { id }
  })
}
export async function rawSaveFeedSources(
  actor: CrudActor,
  id: string,
  userIds: string[]
) {
  return getDatabase().transaction(async (tx) => {
    const [feed] = await rawSocialRows(
      sql`SELECT id FROM custom_feed WHERE id=${id}::uuid AND owner_id=${actor.userId}::uuid FOR UPDATE`,
      tx
    )
    if (!feed) rawSocialError(403, "feed_owner_required")
    await tx.execute(
      sql`DELETE FROM custom_feed_source WHERE feed_id=${id}::uuid`
    )
    for (const userId of new Set(userIds))
      await tx.execute(
        sql`INSERT INTO custom_feed_source(feed_id,source_type,source_id) VALUES(${id}::uuid,'user',${userId}::uuid)`
      )
    return { id }
  })
}
export async function rawGetFeedSources(actor: CrudActor, id: string) {
  const [feed] = await rawSocialRows(
    sql`SELECT id FROM custom_feed WHERE id=${id}::uuid AND owner_id=${actor.userId}::uuid`
  )
  if (!feed) rawSocialError(403, "feed_owner_required")
  const rows = await rawSocialRows(
    sql`SELECT source_id FROM custom_feed_source WHERE feed_id=${id}::uuid AND source_type='user'`
  )
  return { userIds: rows.map((r) => String(r.source_id)) }
}
