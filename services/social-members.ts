import "server-only"
import { sql } from "drizzle-orm"
import type { CrudActor } from "@/database/crud"
import { rawSocialRows, rawSocialError, rawUnblockedSql } from "@/models/index"
export async function rawListSocialMembers(
  actor: CrudActor,
  kind: "group" | "community",
  id: string,
  offset = 0
) {
  const col = sql.identifier(kind + "_id"),
    table = sql.identifier(kind + "_member"),
    [viewer] = await rawSocialRows(
      sql`SELECT m.role FROM ${table} m JOIN ${sql.identifier(kind)} h ON h.id=m.${col} WHERE h.id=${id}::uuid AND h.deleted_at IS NULL AND m.user_id=${actor.userId}::uuid AND ${rawUnblockedSql(sql`h.owner_id`, actor.userId)}`
    )
  if (!viewer) rawSocialError(403, "membership_required")
  const manager = ["owner", "admin", "moderator"].includes(String(viewer.role)),
    rows = await rawSocialRows(
      sql`SELECT u.id,u.name,u.image,m.role,m.joined_at AS "joinedAt" FROM ${table} m JOIN "user" u ON u.id=m.user_id WHERE m.${col}=${id}::uuid ORDER BY m.joined_at,u.id LIMIT 21 OFFSET ${offset}`
    ),
    requests =
      manager && kind === "group"
        ? await rawSocialRows(
            sql`SELECT u.id,u.name,u.image FROM group_join_request r JOIN "user" u ON u.id=r.user_id WHERE r.group_id=${id}::uuid AND r.status='pending' ORDER BY r.requested_at,u.id LIMIT 20 OFFSET ${offset}`
          )
        : []
  return {
    data: rows.slice(0, 20),
    requests,
    viewerRole: viewer.role,
    pagination: { hasMore: rows.length > 20, offset, limit: 20 },
  }
}
