import "server-only"
import {
  rawAssertSocialWriteAllowed,
  rawFilterSocialPolicy,
} from "@/services/social-policy"
import { sql } from "drizzle-orm"
import { getDatabase } from "@/database"
import type { CrudActor } from "@/database/crud"
import type { z } from "@gorth-com/structure/cores/zod"
import { relationshipSchema, profileInputSchema } from "@/schemas/social"
import { rawSocialRows, rawSocialError, rawLockSocialActor, rawAppendSocialEvent, rawAudienceSql, rawUnblockedSql } from "@/models/index"
export async function rawChangeSocialRelationship(
  actor: CrudActor,
  input: z.infer<typeof relationshipSchema>
) {
  const { targetId: target, action } = input
  if (["request", "follow", "accept", "accept-follow"].includes(action))
    await rawAssertSocialWriteAllowed(actor.userId)
  if (target === actor.userId) rawSocialError(400, "self_relationship")
  return getDatabase().transaction(async (tx) => {
    await tx.execute(
      sql`SELECT pg_advisory_xact_lock(hashtextextended(${[actor.userId, target].sort().join(":")},0))`
    )
    await rawLockSocialActor(actor.userId, tx)
    if (["request", "follow"].includes(action)) {
      const [recent] = await rawSocialRows(
        sql`SELECT count(*)::int n FROM outbox_event WHERE aggregate_type='social' AND payload->>'actorId'=${actor.userId} AND event_type IN ('relationship.request','relationship.follow') AND created_at>clock_timestamp()-interval '1 minute'`,
        tx
      )
      if (Number(recent.n) >= 20)
        rawSocialError(429, "relationship_rate_limited")
    }
    const [u] = await rawSocialRows(
      sql`SELECT id FROM "user" WHERE id=${target}::uuid AND status='active'`,
      tx
    )
    if (!u) rawSocialError(404, "user_not_found")
    const [blocked] = await rawSocialRows(
      sql`SELECT 1 WHERE NOT ${rawUnblockedSql(sql`${target}::uuid`, actor.userId)}`,
      tx
    )
    if (
      blocked &&
      !["block", "unblock", "unfollow", "unfriend", "unmute"].includes(action)
    )
      rawSocialError(403, "relationship_blocked")
    if (action === "block") {
      await tx.execute(
        sql`INSERT INTO block(blocker_id,blocked_id) VALUES(${actor.userId}::uuid,${target}::uuid) ON CONFLICT DO NOTHING`
      )
      await tx.execute(
        sql`DELETE FROM follow WHERE (follower_id=${actor.userId}::uuid AND following_id=${target}::uuid) OR (follower_id=${target}::uuid AND following_id=${actor.userId}::uuid)`
      )
      await tx.execute(
        sql`DELETE FROM friendship WHERE (requester_id=${actor.userId}::uuid AND addressee_id=${target}::uuid) OR (requester_id=${target}::uuid AND addressee_id=${actor.userId}::uuid)`
      )
    }
    if (action === "unblock")
      await tx.execute(
        sql`DELETE FROM block WHERE blocker_id=${actor.userId}::uuid AND blocked_id=${target}::uuid`
      )
    if (action === "mute")
      await tx.execute(
        sql`INSERT INTO mute(user_id,muted_user_id) VALUES(${actor.userId}::uuid,${target}::uuid) ON CONFLICT DO NOTHING`
      )
    if (action === "unmute")
      await tx.execute(
        sql`DELETE FROM mute WHERE user_id=${actor.userId}::uuid AND muted_user_id=${target}::uuid`
      )
    if (action === "follow")
      await tx.execute(
        sql`INSERT INTO follow(follower_id,following_id,status) VALUES(${actor.userId}::uuid,${target}::uuid,CASE WHEN EXISTS(SELECT 1 FROM profile WHERE user_id=${target}::uuid AND visibility<>'public') THEN 'pending'::follow_status ELSE 'accepted'::follow_status END) ON CONFLICT(follower_id,following_id) DO UPDATE SET status=EXCLUDED.status,requested_at=clock_timestamp(),responded_at=NULL WHERE follow.status='rejected'`
      )
    if (action === "accept-follow" || action === "reject-follow") {
      const changed = await rawSocialRows(
        sql`UPDATE follow SET status=${action === "accept-follow" ? "accepted" : "rejected"},responded_at=clock_timestamp(),updated_at=clock_timestamp() WHERE follower_id=${target}::uuid AND following_id=${actor.userId}::uuid AND status='pending' RETURNING follower_id`,
        tx
      )
      if (!changed.length) rawSocialError(409, "follow_request_not_pending")
    }
    if (action === "unfollow")
      await tx.execute(
        sql`DELETE FROM follow WHERE follower_id=${actor.userId}::uuid AND following_id=${target}::uuid`
      )
    if (action === "request")
      await tx.execute(
        sql`INSERT INTO friendship(requester_id,addressee_id,user_low_id,user_high_id) VALUES(${actor.userId}::uuid,${target}::uuid,LEAST(${actor.userId}::uuid,${target}::uuid),GREATEST(${actor.userId}::uuid,${target}::uuid)) ON CONFLICT(user_low_id,user_high_id) DO UPDATE SET requester_id=EXCLUDED.requester_id,addressee_id=EXCLUDED.addressee_id,status='pending',responded_at=NULL,updated_at=clock_timestamp() WHERE friendship.status='rejected'`
      )
    if (action === "accept" || action === "reject") {
      const updated = await rawSocialRows(
        sql`UPDATE friendship SET status=${action === "accept" ? "accepted" : "rejected"},responded_at=clock_timestamp(),updated_at=clock_timestamp() WHERE requester_id=${target}::uuid AND addressee_id=${actor.userId}::uuid AND status='pending' RETURNING requester_id`,
        tx
      )
      if (!updated.length) rawSocialError(409, "friend_request_not_pending")
    }
    if (action === "unfriend")
      await tx.execute(
        sql`DELETE FROM friendship WHERE (requester_id=${actor.userId}::uuid AND addressee_id=${target}::uuid) OR (requester_id=${target}::uuid AND addressee_id=${actor.userId}::uuid)`
      )
    await rawAppendSocialEvent(
      tx,
      "relationship." + action,
      target,
      actor.userId
    )
    return { targetId: target, action }
  })
}
export async function rawSocialPeople(
  actor: CrudActor,
  q = "",
  offset = 0
) {
  return {
    data: await rawSocialRows(
      sql`SELECT u.id,u.name,u.username,u.image,p.handle,CASE WHEN ${rawAudienceSql(sql`u.id`, sql`p.visibility`, actor.userId)} AND ${rawUnblockedSql(sql`u.id`, actor.userId)} THEN p.bio ELSE NULL END AS bio,EXISTS(SELECT 1 FROM follow f WHERE f.follower_id=${actor.userId}::uuid AND f.following_id=u.id AND f.status='accepted') AS following,(SELECT status FROM follow f WHERE f.follower_id=${actor.userId}::uuid AND f.following_id=u.id) AS "followStatus",EXISTS(SELECT 1 FROM follow f WHERE f.follower_id=u.id AND f.following_id=${actor.userId}::uuid AND f.status='pending') AS "followRequest",EXISTS(SELECT 1 FROM block b WHERE b.blocker_id=${actor.userId}::uuid AND b.blocked_id=u.id) AS blocked,(SELECT jsonb_build_object('requesterId',f.requester_id,'status',f.status) FROM friendship f WHERE (f.requester_id=${actor.userId}::uuid AND f.addressee_id=u.id) OR (f.addressee_id=${actor.userId}::uuid AND f.requester_id=u.id) LIMIT 1) AS friendship FROM "user" u LEFT JOIN profile p ON p.user_id=u.id WHERE u.status='active' AND u.id<>${actor.userId}::uuid AND strpos(lower(u.name||' '||coalesce(p.handle,u.username,'')),lower(${q}))>0 ORDER BY u.name,u.id LIMIT 20 OFFSET ${offset}`
    ),
  }
}
export async function rawSocialProfile(actor: CrudActor, handle: string) {
  const [p] = await rawSocialRows(
    sql`SELECT p.*,u.id,u.name,u.username,u.image,(SELECT count(*)::int FROM follow f WHERE f.following_id=u.id AND f.status='accepted') AS "followerCount",(SELECT count(*)::int FROM follow f WHERE f.follower_id=u.id AND f.status='accepted') AS "followingCount" FROM profile p JOIN "user" u ON u.id=p.user_id WHERE lower(p.handle)=lower(${handle}) AND u.status='active' AND ${rawAudienceSql(sql`u.id`, sql`p.visibility`, actor.userId)} AND ${rawUnblockedSql(sql`u.id`, actor.userId)}`
  )
  if (!p || !(await rawFilterSocialPolicy([p])).length)
    rawSocialError(404, "profile_not_found")
  return p
}
export async function rawSaveSocialProfile(
  actor: CrudActor,
  input: z.infer<typeof profileInputSchema>
) {
  await rawAssertSocialWriteAllowed(actor.userId)
  const [account] = await rawSocialRows(
    sql`SELECT username FROM "user" WHERE id=${actor.userId}::uuid`
  )
  if (
    account?.username &&
    String(account.username).toLowerCase() !== input.handle.toLowerCase()
  )
    rawSocialError(400, "handle_managed_by_sso")
  await getDatabase().execute(
    sql`INSERT INTO profile(user_id,handle,bio,website,location,visibility) VALUES(${actor.userId}::uuid,${input.handle},${input.bio},${input.website || null},${input.location},${input.visibility}) ON CONFLICT(user_id) DO UPDATE SET handle=EXCLUDED.handle,bio=EXCLUDED.bio,website=EXCLUDED.website,location=EXCLUDED.location,visibility=EXCLUDED.visibility,updated_at=clock_timestamp()`
  )
  return rawSocialProfile(actor, input.handle)
}
