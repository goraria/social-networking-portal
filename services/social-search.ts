import "server-only"
import { rawSocialPlatformRequest } from "@/services/social-platform"
import { rawGetSocialPost } from "@/models/post"
import type { CrudActor } from "@/database/crud"
import { socialSearchResultSchema as resultSchema } from "@/schemas/social"
export async function rawSearchSocialPosts(actor: CrudActor, query: string) {
  const result = resultSchema.parse(
      await rawSocialPlatformRequest(
        "discovery",
        "/discovery/social/search",
        "POST",
        { query, limit: 50 }
      )
    ),
    data = []
  for (const entry of result.data) {
    try {
      const post = await rawGetSocialPost(actor, entry.resourceId)
      if (
        String(post.content ?? "")
          .toLowerCase()
          .includes(query.toLowerCase())
      )
        data.push(post)
    } catch (error) {
      if (
        !error ||
        typeof error !== "object" ||
        !("status" in error) ||
        error.status !== 404
      )
        throw error
    }
  }
  return { data }
}
