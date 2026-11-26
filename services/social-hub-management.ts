import "server-only"
import { sql } from "drizzle-orm"
import { getDatabase } from "@/database"
import type { CrudActor } from "@/database/crud"
import type { z } from "@gorth-com/structure/cores/zod"
import type { hubUpdateSchema } from "@/schemas/social"
import { rawAssertSocialWriteAllowed } from "@/services/social-policy"
import { rawSocialRows, rawSocialError, rawLockSocialActor, rawAppendSocialEvent } from "@/models/index"
export async function rawChangeSocialHub(
  actor: CrudActor,
  kind: "group" | "community" | "page" | "event",
  id: string,
  input: z.infer<typeof hubUpdateSchema>,
  remove = false
) {
  if (!remove) await rawAssertSocialWriteAllowed(actor.userId)
  return getDatabase().transaction(async (tx) => {
    await rawLockSocialActor(actor.userId, tx)
    const table = sql.identifier(kind),
      [h] = await rawSocialRows(
        sql`SELECT * FROM ${table} WHERE id=${id}::uuid FOR UPDATE`,
        tx
      )
    if (!h || h.deleted_at) rawSocialError(404, "hub_not_found")
    if ((h.owner_id ?? h.creator_id) !== actor.userId)
      rawSocialError(403, "hub_owner_required")
    if (remove) {
      if (kind === "event")
        await tx.execute(
          sql`UPDATE event SET cancelled_at=clock_timestamp(),updated_at=clock_timestamp() WHERE id=${id}::uuid`
        )
      else {
        await tx.execute(
          sql`UPDATE ${table} SET deleted_at=clock_timestamp(),updated_at=clock_timestamp() WHERE id=${id}::uuid`
        )
        await tx.execute(
          sql`UPDATE actor SET deleted_at=clock_timestamp() WHERE id=${h.actor_id}::uuid`
        )
      }
    } else {
      if (kind === "event") {
        const start = input.startsAt ?? String(h.starts_at),
          end = input.endsAt === undefined ? h.ends_at : input.endsAt
        if (end && new Date(String(end)) <= new Date(start))
          rawSocialError(400, "invalid_event_interval")
        await tx.execute(
          sql`UPDATE event SET name=${input.name ?? h.name},description=${input.description ?? h.description},visibility=${input.visibility ?? h.visibility},starts_at=${start}::timestamp,ends_at=${end ?? null}::timestamp,updated_at=clock_timestamp() WHERE id=${id}::uuid`
        )
      } else {
        await tx.execute(
          sql`UPDATE ${table} SET name=${input.name ?? h.name},description=${input.description ?? h.description}${kind === "page" ? sql`` : sql`,visibility=${input.visibility ?? h.visibility}`}${kind === "group" ? sql`,requires_post_approval=${input.requiresPostApproval ?? h.requires_post_approval}` : sql``},updated_at=clock_timestamp() WHERE id=${id}::uuid`
        )
        if (input.name)
          await tx.execute(
            sql`UPDATE actor SET display_name=${input.name},updated_at=clock_timestamp() WHERE id=${h.actor_id}::uuid`
          )
      }
    }
    await rawAppendSocialEvent(
      tx,
      remove ? "hub.deleted" : "hub.updated",
      id,
      actor.userId
    )
    return { id }
  })
}
