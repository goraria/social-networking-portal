import "server-only"
import { sql } from "drizzle-orm"
import { rawSocialPlatformRequest } from "@/services/social-platform"
import { socialPolicyResultSchema } from "@/schemas/social"
import { rawSocialRows, rawSocialError, type SocialTransaction } from "@/models/index"
import { getDatabase, type Database } from "@/database"
function readPolicy(raw: unknown) {
  const result = socialPolicyResultSchema.safeParse(raw)
  if (!result.success) rawSocialError(503, "moderation_policy_unavailable")
  return result.data
}
export async function rawAssertSocialWriteAllowed(
  id: string,
  tx: SocialTransaction | Pick<Database, "execute"> = getDatabase()
) {
  const [u] = await rawSocialRows(
    sql`SELECT external_user_id FROM "user" WHERE id=${id}::uuid`,
    tx
  )
  if (!u) rawSocialError(403, "account_restricted")
  const policy = readPolicy(
    await rawSocialPlatformRequest(
      "insightPolicy",
      "/insight/social/policy",
      "POST",
      { subjects: [u.external_user_id] }
    )
  )
  if (policy.restrictedSubjects.includes(String(u.external_user_id)))
    rawSocialError(403, "account_restricted")
}
export async function rawFilterSocialPolicy<T extends Record<string, unknown>>(
  items: T[],
  tx: SocialTransaction | Pick<Database, "execute"> = getDatabase()
): Promise<T[]> {
  if (!items.length) return items
  const ids = items.map((p) => String(p.id))
  const authors = await rawSocialRows(
    sql`SELECT p.id,u.external_user_id FROM post p JOIN "user" u ON u.id=p.author_id WHERE p.id IN (${sql.join(
      ids.map((id) => sql`${id}::uuid`),
      sql`,`
    )}) UNION ALL SELECT s.id,u.external_user_id FROM story s JOIN "user" u ON u.id=s.author_id WHERE s.id IN (${sql.join(
      ids.map((id) => sql`${id}::uuid`),
      sql`,`
    )}) UNION ALL SELECT id,external_user_id FROM "user" WHERE id IN (${sql.join(
      ids.map((id) => sql`${id}::uuid`),
      sql`,`
    )})`,
    tx
  )
  const policy = readPolicy(
    await rawSocialPlatformRequest(
      "insightPolicy",
      "/insight/social/policy",
      "POST",
      {
        resourceIds: ids,
        subjects: [...new Set(authors.map((u) => String(u.external_user_id)))],
      }
    )
  )
  return items.filter(
    (p) =>
      !policy.removedResourceIds.includes(String(p.id)) &&
      !authors.some(
        (u) =>
          u.id === p.id &&
          policy.restrictedSubjects.includes(String(u.external_user_id))
      )
  )
}
