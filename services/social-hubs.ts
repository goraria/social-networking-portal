import "server-only"
import { rawAssertSocialWriteAllowed } from "@/services/social-policy"
import { sql } from "drizzle-orm"
import type { z } from "@gorth-com/structure/cores/zod"
import { getDatabase } from "@/database"
import type { CrudActor } from "@/database/crud"
import { hubInputSchema, membershipSchema, hubKinds } from "@/schemas/social"
import { rawSocialRows, rawSocialError, rawLockSocialActor, rawAppendSocialEvent, rawUnblockedSql } from "@/models/index"
export async function rawListSocialHubs(
  actor: CrudActor,
  kind: (typeof hubKinds)[number],
  q = "",
  offset = 0,
  id?: string
) {
  const table = sql.identifier(kind === "feed" ? "custom_feed" : kind),
    owner = sql.identifier(
      kind === "event"
        ? "creator_id"
        : kind === "topic"
          ? "created_by_user_id"
          : "owner_id"
    )
  if (kind === "topic")
    return {
      data: await rawSocialRows(
        sql`SELECT id,name,description FROM topic WHERE ${id ? sql`id=${id}::uuid AND` : sql``} strpos(lower(name),lower(${q}))>0 ORDER BY name,id LIMIT 20 OFFSET ${offset}`
      ),
    }
  if (kind === "feed")
    return {
      data: await rawSocialRows(
        sql`SELECT id,name FROM custom_feed WHERE owner_id=${actor.userId}::uuid ${id ? sql`AND id=${id}::uuid` : sql``} AND strpos(lower(name),lower(${q}))>0 ORDER BY name,id LIMIT 20 OFFSET ${offset}`
      ),
    }
  const member = sql.identifier(
      kind === "page"
        ? "page_follower"
        : kind === "event"
          ? "event_attendee"
          : kind + "_member"
    ),
    col = sql.identifier(kind + "_id")
  const vis =
    kind === "page"
      ? sql`true`
      : sql`(h.visibility='public' OR h.${owner}=${actor.userId}::uuid OR EXISTS(SELECT 1 FROM ${member} m WHERE m.${col}=h.id AND m.user_id=${actor.userId}::uuid) ${kind === "event" ? sql`OR EXISTS(SELECT 1 FROM event_invitation i WHERE i.event_id=h.id AND i.invitee_id=${actor.userId}::uuid AND i.status IN ('pending','accepted'))` : sql``})`
  return {
    data: await rawSocialRows(
      sql`SELECT h.id,h.name,h.description,${kind === "page" ? sql`'public'` : sql`h.visibility`} AS visibility,${kind === "group" ? sql`h.requires_post_approval` : sql`false`} AS "requiresPostApproval",${kind === "event" ? sql`h.starts_at AS "startsAt",h.cancelled_at AS "cancelledAt",` : sql``}h.${owner} AS "ownerId",EXISTS(SELECT 1 FROM ${member} m WHERE m.${col}=h.id AND m.user_id=${actor.userId}::uuid) AS joined FROM ${table} h WHERE ${vis} AND ${rawUnblockedSql(sql`h.${owner}`, actor.userId)} AND ${kind === "event" ? sql`true` : sql`h.deleted_at IS NULL`} AND strpos(lower(h.name),lower(${q}))>0 ${id ? sql`AND h.id=${id}::uuid` : sql``} ORDER BY h.created_at DESC,h.id DESC LIMIT 20 OFFSET ${offset}`
    ),
  }
}
export async function rawCreateSocialHub(
  actor: CrudActor,
  input: z.infer<typeof hubInputSchema>
) {
  await rawAssertSocialWriteAllowed(actor.userId)
  if (input.kind === "feed") {
    const [feed] = await rawSocialRows(
      sql`INSERT INTO custom_feed(owner_id,name) VALUES(${actor.userId}::uuid,${input.name}) RETURNING id`
    )
    return feed
  }
  if (input.kind === "topic")
    rawSocialError(400, "unsupported_hub_creation")
  return getDatabase().transaction(async (tx) => {
    await rawLockSocialActor(actor.userId, tx)
    let id: string
    if (input.kind === "event") {
      if (!input.startsAt) rawSocialError(400, "event_start_required")
      const [e] = await rawSocialRows(
        sql`INSERT INTO event(creator_id,name,description,visibility,starts_at,ends_at) VALUES(${actor.userId}::uuid,${input.name},${input.description},${input.visibility},${input.startsAt}::timestamp,${input.endsAt ?? null}::timestamp) RETURNING id`,
        tx
      )
      id = String(e.id)
    } else {
      const [a] = await rawSocialRows(
        sql`INSERT INTO actor(type,handle,display_name) VALUES(${input.kind},${input.kind + "_" + crypto.randomUUID().replaceAll("-", "")},${input.name}) RETURNING id`,
        tx
      )
      const table = sql.identifier(input.kind)
      const [h] = await rawSocialRows(
        sql`INSERT INTO ${table}(actor_id,owner_id,name,description${input.kind === "page" ? sql`` : sql`,visibility`}${input.kind === "group" ? sql`,requires_post_approval` : sql``}) VALUES(${a.id}::uuid,${actor.userId}::uuid,${input.name},${input.description}${input.kind === "page" ? sql`` : sql`,${input.visibility}`}${input.kind === "group" ? sql`,${input.requiresPostApproval}` : sql``}) RETURNING id`,
        tx
      )
      id = String(h.id)
      if (input.kind !== "page")
        await tx.execute(
          sql`INSERT INTO ${sql.identifier(input.kind + "_member")}(${sql.identifier(input.kind + "_id")},user_id,role) VALUES(${id}::uuid,${actor.userId}::uuid,'owner')`
        )
      else
        await tx.execute(
          sql`INSERT INTO page_member(page_id,user_id,role) VALUES(${id}::uuid,${actor.userId}::uuid,'owner')`
        )
    }
    await rawAppendSocialEvent(tx, "hub.created", id, actor.userId)
    return { id }
  })
}
export async function rawChangeSocialMembership(
  actor: CrudActor,
  kind: "group" | "community" | "page" | "event",
  id: string,
  input: z.infer<typeof membershipSchema>
) {
  if (!["leave", "declined", "cancel"].includes(input.action))
    await rawAssertSocialWriteAllowed(actor.userId)
  return getDatabase().transaction(async (tx) => {
    await rawLockSocialActor(actor.userId, tx)
    const [hub] = await rawSocialRows(
      sql`SELECT * FROM ${sql.identifier(kind)} WHERE id=${id}::uuid FOR UPDATE`,
      tx
    )
    if (!hub || hub.deleted_at) rawSocialError(404, "hub_not_found")
    const target = input.targetId ?? actor.userId
    if (!["leave", "declined"].includes(input.action)) {
      const [ok] = await rawSocialRows(
        sql`SELECT 1 WHERE ${rawUnblockedSql(sql`${hub.owner_id ?? hub.creator_id}::uuid`, actor.userId)}`,
        tx
      )
      if (!ok) rawSocialError(403, "relationship_blocked")
    }
    if (kind === "event") {
      if (input.action === "invite") {
        if (hub.creator_id !== actor.userId || !input.targetId)
          rawSocialError(403, "event_owner_required")
        await tx.execute(
          sql`INSERT INTO event_invitation(event_id,invitee_id,inviter_id) VALUES(${id}::uuid,${target}::uuid,${actor.userId}::uuid) ON CONFLICT(event_id,invitee_id) DO UPDATE SET status='pending',inviter_id=EXCLUDED.inviter_id`
        )
        return { id }
      }
      if (input.action === "cancel") {
        if (hub.creator_id !== actor.userId)
          rawSocialError(403, "event_owner_required")
        await tx.execute(
          sql`UPDATE event SET cancelled_at=clock_timestamp() WHERE id=${id}::uuid`
        )
      } else {
        if (hub.cancelled_at) rawSocialError(409, "event_cancelled")
        if (hub.visibility !== "public" && hub.creator_id !== actor.userId) {
          const [invitation] = await rawSocialRows(
            sql`SELECT 1 FROM event_invitation WHERE event_id=${id}::uuid AND invitee_id=${actor.userId}::uuid AND status IN ('pending','accepted')`,
            tx
          )
          if (!invitation) rawSocialError(403, "event_private")
        }
        if (!["going", "interested", "declined"].includes(input.action))
          rawSocialError(400, "invalid_rsvp")
        await tx.execute(
          sql`INSERT INTO event_attendee(event_id,user_id,response) VALUES(${id}::uuid,${actor.userId}::uuid,${input.action}) ON CONFLICT(event_id,user_id) DO UPDATE SET response=EXCLUDED.response,responded_at=clock_timestamp()`
        )
      }
      return { id }
    }
    const table = sql.identifier(
        kind === "page" ? "page_follower" : kind + "_member"
      ),
      col = sql.identifier(kind + "_id")
    if (input.action === "transfer") {
      if (hub.owner_id !== actor.userId || target === actor.userId)
        rawSocialError(403, "owner_required")
      const [member] = await rawSocialRows(
        sql`SELECT 1 FROM ${sql.identifier(kind + "_member")} WHERE ${col}=${id}::uuid AND user_id=${target}::uuid`,
        tx
      )
      if (!member) rawSocialError(409, "target_must_be_member")
      await tx.execute(
        sql`UPDATE ${sql.identifier(kind)} SET owner_id=${target}::uuid WHERE id=${id}::uuid`
      )
      await tx.execute(
        sql`UPDATE ${sql.identifier(kind + "_member")} SET role=CASE WHEN user_id=${target}::uuid THEN 'owner'::member_role ELSE 'admin'::member_role END WHERE ${col}=${id}::uuid AND user_id IN (${target}::uuid,${actor.userId}::uuid)`
      )
    } else if (
      ["approve", "remove", "promote", "demote"].includes(input.action)
    ) {
      const [manager] = await rawSocialRows(
        sql`SELECT role FROM ${sql.identifier(kind + "_member")} WHERE ${col}=${id}::uuid AND user_id=${actor.userId}::uuid`,
        tx
      )
      if (
        !manager ||
        !["owner", "admin", "moderator"].includes(String(manager.role))
      )
        rawSocialError(403, "moderator_required")
      const [existing] = await rawSocialRows(
        sql`SELECT role FROM ${sql.identifier(kind + "_member")} WHERE ${col}=${id}::uuid AND user_id=${target}::uuid`,
        tx
      )
      if (
        existing &&
        ["owner", "admin", "moderator"].includes(String(existing.role)) &&
        hub.owner_id !== actor.userId
      )
        rawSocialError(403, "role_hierarchy")
      if (target === hub.owner_id)
        rawSocialError(403, "owner_transfer_required")
      if (["promote", "demote"].includes(input.action)) {
        if (hub.owner_id !== actor.userId)
          rawSocialError(403, "owner_required")
        await tx.execute(
          sql`UPDATE ${sql.identifier(kind + "_member")} SET role=${input.action === "promote" ? "moderator" : "member"} WHERE ${col}=${id}::uuid AND user_id=${target}::uuid`
        )
      } else if (input.action === "remove")
        await tx.execute(
          sql`DELETE FROM ${table} WHERE ${col}=${id}::uuid AND user_id=${target}::uuid`
        )
      else {
        if (kind === "community") {
          await tx.execute(
            sql`INSERT INTO community_member(community_id,user_id) VALUES(${id}::uuid,${target}::uuid) ON CONFLICT DO NOTHING`
          )
          await rawAppendSocialEvent(
            tx,
            "membership.changed",
            id,
            actor.userId
          )
          return { id }
        }
        if (kind !== "group") rawSocialError(400, "no_pending_membership")
        const [req] = await rawSocialRows(
          sql`DELETE FROM group_join_request WHERE group_id=${id}::uuid AND user_id=${target}::uuid AND status='pending' RETURNING user_id`,
          tx
        )
        if (!req) rawSocialError(409, "request_not_pending")
        await tx.execute(
          sql`INSERT INTO group_member(group_id,user_id) VALUES(${id}::uuid,${target}::uuid) ON CONFLICT DO NOTHING`
        )
      }
    } else if (input.action === "join") {
      if (kind !== "page" && hub.visibility !== "public") {
        if (kind === "group") {
          await tx.execute(
            sql`INSERT INTO group_join_request(group_id,user_id) VALUES(${id}::uuid,${actor.userId}::uuid) ON CONFLICT DO NOTHING`
          )
          return { id, pending: true }
        }
        rawSocialError(403, "private_membership_required")
      }
      await tx.execute(
        sql`INSERT INTO ${table}(${col},user_id) VALUES(${id}::uuid,${actor.userId}::uuid) ON CONFLICT DO NOTHING`
      )
    } else if (input.action === "leave") {
      if (hub.owner_id === actor.userId)
        rawSocialError(409, "owner_transfer_required")
      await tx.execute(
        sql`DELETE FROM ${table} WHERE ${col}=${id}::uuid AND user_id=${actor.userId}::uuid`
      )
    } else rawSocialError(400, "invalid_membership_action")
    await rawAppendSocialEvent(tx, "membership.changed", id, actor.userId)
    return { id }
  })
}
