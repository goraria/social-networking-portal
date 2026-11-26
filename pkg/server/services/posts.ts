import { eq } from "drizzle-orm"
import { database } from "@/database"
import {
  createCrudRepository,
  crudKey,
  requireOwnedField,
  type CrudActor,
  type CrudListOptions,
} from "@/database/crud"
import { postsTable } from "@/database/schema"

const repository = createCrudRepository(
  "post",
  {
    table: postsTable,
    keys: [crudKey("id", postsTable.id)],
    createFields: [
      "authorId",
      "authorActorId",
      "type",
      "format",
      "status",
      "visibility",
      "replyPolicy",
      "quotePolicy",
      "rootPostId",
      "parentPostId",
      "quotedPostId",
      "repostOfId",
      "content",
      "location",
      "locationId",
      "linkPreviewId",
      "languageCode",
      "isSensitive",
      "scheduledAt",
      "publishedAt",
    ],
    updateFields: [
      "authorActorId",
      "type",
      "format",
      "status",
      "visibility",
      "replyPolicy",
      "quotePolicy",
      "rootPostId",
      "parentPostId",
      "quotedPostId",
      "repostOfId",
      "content",
      "location",
      "locationId",
      "linkPreviewId",
      "languageCode",
      "isSensitive",
      "scheduledAt",
      "publishedAt",
      "archivedAt",
      "deletedAt",
    ],
    dateFields: ["scheduledAt", "publishedAt", "archivedAt", "deletedAt"],
    orderBy: postsTable.publishedAt,
    touchUpdatedAt: true,
  },
  {
    create: (payload, actor) => requireOwnedField(payload, "authorId", actor),
    mutate: (row, actor) => {
      if (!actor.isAdmin) requireOwnedField(row, "authorId", actor)
    },
  }
)

export async function isPostOwner(postId: string | null, actor: CrudActor) {
  try {
    if (!postId) return false
    const [post] = await database
      .select({ authorId: postsTable.authorId })
      .from(postsTable)
      .where(eq(postsTable.id, postId))
      .limit(1)
    return actor.isAdmin || post?.authorId === actor.userId
  } catch (error) {
    throw error
  }
}
export async function listPosts(actor: CrudActor, options?: CrudListOptions) {
  try {
    return await repository.list(actor, options)
  } catch (error) {
    throw error
  }
}
export async function getPost(
  actor: CrudActor,
  params: Record<string, string | undefined>
) {
  try {
    return await repository.get(actor, params)
  } catch (error) {
    throw error
  }
}
export async function createPost(actor: CrudActor, input: unknown) {
  try {
    const payload =
      input && typeof input === "object" && !Array.isArray(input) ? input : {}

    return await repository.create(actor, {
      ...payload,
      authorId: actor.userId,
    })
  } catch (error) {
    throw error
  }
}
export async function updatePost(
  actor: CrudActor,
  params: Record<string, string | undefined>,
  input: unknown
) {
  try {
    return await repository.update(actor, params, input)
  } catch (error) {
    throw error
  }
}
export async function deletePost(
  actor: CrudActor,
  params: Record<string, string | undefined>
) {
  try {
    return await repository.remove(actor, params)
  } catch (error) {
    throw error
  }
}
