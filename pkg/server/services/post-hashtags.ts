import {
  createCrudRepository,
  crudKey,
  CrudError,
  readString,
  type CrudActor,
  type CrudListOptions,
} from "@/database/crud"
import { postHashtagsTable } from "@/database/schema"
import { isPostOwner } from "@/services/posts"

async function assertPostOwner(row: Record<string, unknown>, actor: CrudActor) {
  if (!(await isPostOwner(readString(row, "postId"), actor)))
    throw new CrudError(403, "forbidden", "Post belongs to another user")
}
const repository = createCrudRepository(
  "post hashtag",
  {
    table: postHashtagsTable,
    keys: [
      crudKey("postId", postHashtagsTable.postId),
      crudKey("hashtagId", postHashtagsTable.hashtagId),
    ],
    createFields: ["postId", "hashtagId"],
    updateFields: [],
    orderBy: postHashtagsTable.postId,
  },
  { create: assertPostOwner, mutate: assertPostOwner }
)

export async function listPostHashtags(
  actor: CrudActor,
  options?: CrudListOptions
) {
  try {
    return await repository.list(actor, options)
  } catch (error) {
    throw error
  }
}
export async function getPostHashtag(
  actor: CrudActor,
  params: Record<string, string | undefined>
) {
  try {
    return await repository.get(actor, params)
  } catch (error) {
    throw error
  }
}
export async function createPostHashtag(actor: CrudActor, input: unknown) {
  try {
    return await repository.create(actor, input)
  } catch (error) {
    throw error
  }
}
export async function updatePostHashtag(
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
export async function deletePostHashtag(
  actor: CrudActor,
  params: Record<string, string | undefined>
) {
  try {
    return await repository.remove(actor, params)
  } catch (error) {
    throw error
  }
}
