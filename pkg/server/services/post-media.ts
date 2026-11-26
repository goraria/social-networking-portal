import {
  createCrudRepository,
  crudKey,
  CrudError,
  readString,
  type CrudActor,
  type CrudListOptions,
} from "@/database/crud"
import { postMediaTable } from "@/database/schema"
import { isPostOwner } from "@/services/posts"

async function assertPostOwner(row: Record<string, unknown>, actor: CrudActor) {
  if (!(await isPostOwner(readString(row, "postId"), actor)))
    throw new CrudError(403, "forbidden", "Post belongs to another user")
}
const repository = createCrudRepository(
  "post media",
  {
    table: postMediaTable,
    keys: [crudKey("id", postMediaTable.id)],
    createFields: [
      "postId",
      "type",
      "url",
      "thumbnailUrl",
      "width",
      "height",
      "position",
      "metadata",
    ],
    updateFields: [
      "type",
      "url",
      "thumbnailUrl",
      "width",
      "height",
      "position",
      "metadata",
    ],
    orderBy: postMediaTable.createdAt,
  },
  { create: assertPostOwner, mutate: assertPostOwner }
)

export async function listPostMedia(
  actor: CrudActor,
  options?: CrudListOptions
) {
  try {
    return await repository.list(actor, options)
  } catch (error) {
    throw error
  }
}
export async function getPostMedia(
  actor: CrudActor,
  params: Record<string, string | undefined>
) {
  try {
    return await repository.get(actor, params)
  } catch (error) {
    throw error
  }
}
export async function createPostMedia(actor: CrudActor, input: unknown) {
  try {
    return await repository.create(actor, input)
  } catch (error) {
    throw error
  }
}
export async function updatePostMedia(
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
export async function deletePostMedia(
  actor: CrudActor,
  params: Record<string, string | undefined>
) {
  try {
    return await repository.remove(actor, params)
  } catch (error) {
    throw error
  }
}
