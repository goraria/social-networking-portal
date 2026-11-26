import "server-only"
import { sql } from "drizzle-orm"
import { getDatabase } from "@/database"
import type { CrudActor } from "@/database/crud"
import type { z } from "@gorth-com/structure/cores/zod"
import type { storyUpdateSchema } from "@/schemas/social"
import { rawSocialRows, rawSocialError, rawLockSocialActor } from "@/models/index"
import { rawAssertSocialWriteAllowed } from "@/services/social-policy"
export async function rawChangeSocialStory(
  actor: CrudActor,
  id: string,
  input: z.infer<typeof storyUpdateSchema>,
  remove = false
) {
  if (!remove) await rawAssertSocialWriteAllowed(actor.userId)
  return getDatabase().transaction(async (tx) => {
    await rawLockSocialActor(actor.userId, tx)
    const [s] = await rawSocialRows(
      sql`SELECT * FROM story WHERE id=${id}::uuid FOR UPDATE`,
      tx
    )
    if (!s || s.author_id !== actor.userId)
      rawSocialError(403, "story_owner_required")
    if (remove)
      await tx.execute(
        sql`UPDATE story SET status='deleted',is_archived=true WHERE id=${id}::uuid`
      )
    else
      await tx.execute(
        sql`UPDATE story SET caption=${input.caption ?? s.caption},visibility=${input.visibility ?? s.visibility} WHERE id=${id}::uuid AND status='published'`
      )
    return { id }
  })
}
