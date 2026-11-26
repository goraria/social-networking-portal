import "server-only"
import type { CrudActor } from "@/database/crud"
import type { z } from "@gorth-com/structure/cores/zod"
import { reportInputSchema } from "@/schemas/social"
import { rawCheckPostAccess, rawSocialRows, rawSocialError } from "@/models/index"
import { sql } from "drizzle-orm"
import type { restrictionInputSchema } from "@/schemas/social"
import { rawSocialPlatformRequest } from "@/services/social-platform"
export async function rawReportSocialPost(
  actor: CrudActor,
  id: string,
  input: z.infer<typeof reportInputSchema>,
  token: string
) {
  await rawCheckPostAccess(id, actor.userId)
  return rawSocialPlatformRequest(
    "insight",
    "/insight/moderation/report",
    "POST",
    { resourceType: "post", resourceId: id, ...input },
    token
  )
}
export async function rawRestrictSocialAccount(
  actor: CrudActor,
  input: z.infer<typeof restrictionInputSchema>,
  token: string
) {
  if (!actor.isAdmin) rawSocialError(403, "social_admin_required")
  const [u] = await rawSocialRows(
    sql`SELECT external_user_id FROM "user" WHERE id=${input.targetId}::uuid`
  )
  if (!u) rawSocialError(404, "user_not_found")
  return rawSocialPlatformRequest(
    "insight",
    "/insight/enforcement",
    "POST",
    {
      resourceType: "user",
      resourceId: u.external_user_id,
      type: input.type,
      reason: input.reason,
      ...(input.expiresAt ? { expiresAt: input.expiresAt } : {}),
    },
    token
  )
}
