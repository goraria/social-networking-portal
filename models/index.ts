import "server-only"
import { rawFilterSocialPolicy, rawAssertSocialWriteAllowed } from "@/services/social-policy"
import { sql, type SQL } from "drizzle-orm"
import { getDatabase, type Database } from "@/database"
import { CrudError } from "@/database/crud"
import { formatSocialValue } from "@/utils/social-formatter"

export type SocialTransaction = Parameters<
  Parameters<Database["transaction"]>[0]
>[0]

export async function rawSocialRows<
  T extends Record<string, unknown> = Record<string, unknown>,
>(
  query: SQL,
  tx: Pick<Database, "execute"> | SocialTransaction = getDatabase()
): Promise<T[]> {
  return formatSocialValue(Array.from(await tx.execute(query))) as T[]
}

export function rawSocialError(status: number, code: string): never {
  throw new CrudError(status, code, code)
}

export function rawUnblockedSql(author: SQL, viewer: string) {
  return sql`NOT EXISTS(SELECT 1 FROM block b WHERE (b.blocker_id=${viewer}::uuid AND b.blocked_id=${author}) OR (b.blocked_id=${viewer}::uuid AND b.blocker_id=${author}))`
}

export async function rawDeniedSocialSubjects(viewer: string, subjects: string[]) {
  if (!subjects.length) return []
  const visible = await rawSocialRows(
    sql`SELECT u.external_user_id FROM "user" u WHERE u.external_user_id IN (${sql.join(
      subjects.map((s) => sql`${s}`),
      sql`,`
    )}) AND u.status='active' AND u.sso_status='active' AND ${rawUnblockedSql(sql`u.id`, viewer)}`
  )
  const allowed = new Set(visible.map((u) => String(u.external_user_id)))
  return subjects.filter((s) => !allowed.has(s))
}

export function rawAudienceSql(author: SQL, visibility: SQL, viewer: string) {
  return sql`(${author}=${viewer}::uuid OR (${rawUnblockedSql(author, viewer)} AND (${visibility}::text='public' OR (${visibility}::text='followers' AND EXISTS(SELECT 1 FROM follow f WHERE f.follower_id=${viewer}::uuid AND f.following_id=${author} AND f.status='accepted')) OR (${visibility}::text='friends' AND EXISTS(SELECT 1 FROM friendship f WHERE f.status='accepted' AND ((f.requester_id=${viewer}::uuid AND f.addressee_id=${author}) OR (f.addressee_id=${viewer}::uuid AND f.requester_id=${author})))) OR (${visibility}::text='close_friend' AND EXISTS(SELECT 1 FROM close_friend c WHERE c.owner_id=${author} AND c.member_id=${viewer}::uuid)))))`
}

export function rawPostReadSql(viewer: string) {
  return sql`p.deleted_at IS NULL AND EXISTS(SELECT 1 FROM "user" au WHERE au.id=p.author_id AND au.status='active' AND au.sso_status='active') AND ${rawUnblockedSql(sql`p.author_id`, viewer)} AND (p.author_id=${viewer}::uuid OR (p.status='draft' AND p.review_requested AND EXISTS(SELECT 1 FROM group_member rm WHERE rm.group_id=p.group_id AND rm.user_id=${viewer}::uuid AND rm.role IN ('owner','admin','moderator'))) OR (p.status='published' AND p.published_at<=clock_timestamp() AND ${rawAudienceSql(sql`p.author_id`, sql`p.visibility`, viewer)})) AND (p.group_id IS NULL OR EXISTS(SELECT 1 FROM "group" g WHERE g.id=p.group_id AND g.deleted_at IS NULL AND (g.visibility='public' OR EXISTS(SELECT 1 FROM group_member gm WHERE gm.group_id=g.id AND gm.user_id=${viewer}::uuid)))) AND (p.community_id IS NULL OR EXISTS(SELECT 1 FROM community c WHERE c.id=p.community_id AND c.deleted_at IS NULL AND (c.visibility='public' OR EXISTS(SELECT 1 FROM community_member cm WHERE cm.community_id=c.id AND cm.user_id=${viewer}::uuid))))`
}

export async function rawCheckPostAccess(
  id: string,
  viewer: string,
  tx: Pick<Database, "execute"> | SocialTransaction = getDatabase()
) {
  const [p] = await rawSocialRows(
    sql`SELECT p.* FROM post p WHERE p.id=${id}::uuid AND ${rawPostReadSql(viewer)}`,
    tx
  )
  if (!p || !(await rawFilterSocialPolicy([p], tx)).length)
    rawSocialError(404, "post_not_found")
  return p
}

export async function rawCheckStoryAccess(
  id: string,
  viewer: string,
  tx: Pick<Database, "execute"> | SocialTransaction = getDatabase()
) {
  const [s] = await rawSocialRows(
    sql`SELECT s.* FROM story s WHERE s.id=${id}::uuid AND s.status='published' AND EXISTS(SELECT 1 FROM "user" au WHERE au.id=s.author_id AND au.status='active' AND au.sso_status='active') AND s.expires_at>clock_timestamp() AND NOT s.is_archived AND ${rawAudienceSql(sql`s.author_id`, sql`s.visibility`, viewer)} AND ${rawUnblockedSql(sql`s.author_id`, viewer)}`,
    tx
  )
  if (!s || !(await rawFilterSocialPolicy([s], tx)).length)
    rawSocialError(404, "story_not_found")
  return s
}

export async function rawCheckInteraction(
  id: string,
  viewer: string,
  action: "read" | "comment" | "share" | "interact",
  tx: Pick<Database, "execute"> | SocialTransaction = getDatabase()
) {
  const p = await rawCheckPostAccess(id, viewer, tx)
  if (action !== "read") await rawAssertSocialWriteAllowed(viewer, tx)
  if (action === "read" || action === "interact" || p.author_id === viewer)
    return p
  const policy = action === "comment" ? p.reply_policy : p.quote_policy
  const [allowed] = await rawSocialRows(
    sql`SELECT 1 WHERE ${policy}='everyone' OR (${policy}='followers' AND EXISTS(SELECT 1 FROM follow WHERE follower_id=${viewer}::uuid AND following_id=${p.author_id}::uuid AND status='accepted')) OR (${policy}='following' AND EXISTS(SELECT 1 FROM follow WHERE follower_id=${p.author_id}::uuid AND following_id=${viewer}::uuid AND status='accepted')) OR (${policy}='friends' AND EXISTS(SELECT 1 FROM friendship WHERE status='accepted' AND ((requester_id=${viewer}::uuid AND addressee_id=${p.author_id}::uuid) OR (addressee_id=${viewer}::uuid AND requester_id=${p.author_id}::uuid)))) OR (${policy}='mentioned' AND EXISTS(SELECT 1 FROM post_mention WHERE post_id=${id}::uuid AND mentioned_user_id=${viewer}::uuid))`,
    tx
  )
  if (!allowed) rawSocialError(403, "interaction_forbidden")
  return p
}

export async function rawLockSocialActor(id: string, tx: SocialTransaction) {
  await tx.execute(sql`SELECT pg_advisory_xact_lock(hashtextextended(${id},0))`)
  const [u] = await rawSocialRows(
    sql`SELECT id FROM "user" WHERE id=${id}::uuid AND status='active' AND sso_status='active'`,
    tx
  )
  if (!u) rawSocialError(403, "account_restricted")
}

export async function rawAppendSocialEvent(
  tx: SocialTransaction,
  type: string,
  id: string,
  actorId: string
) {
  await tx.execute(
    sql`INSERT INTO outbox_event(aggregate_type,aggregate_id,event_type,payload) VALUES('social',${id}::uuid,${type},${JSON.stringify({ actorId })}::jsonb)`
  )
}
