import {
  createCrudRepository,
  crudKey,
  CrudError,
  readString,
  type CrudActor,
  type CrudListOptions,
} from "@/database/crud"
import { postChannelsTable } from "@/database/schema"
import { isPostOwner } from "@/services/posts"

async function assertPostOwner(row: Record<string, unknown>, actor: CrudActor) {
  if (!(await isPostOwner(readString(row, "postId"), actor)))
    throw new CrudError(403, "forbidden", "Post belongs to another user")
}

const repository = createCrudRepository(
  "post channel",
  {
    table: postChannelsTable,
    keys: [
      crudKey("postId", postChannelsTable.postId),
      crudKey("channel", postChannelsTable.channel, "enum", [
        "feed",
        "tweet",
        "explore",
      ]),
    ],
    createFields: ["postId", "channel"],
    updateFields: [],
    orderBy: postChannelsTable.createdAt,
  },
  { create: assertPostOwner, mutate: assertPostOwner }
)

export async function listPostChannels(
  actor: CrudActor,
  options?: CrudListOptions
) {
  try {
    return await repository.list(actor, options)
  } catch (error) {
    throw error
  }
}
export async function getPostChannel(
  actor: CrudActor,
  params: Record<string, string | undefined>
) {
  try {
    return await repository.get(actor, params)
  } catch (error) {
    throw error
  }
}
export async function createPostChannel(actor: CrudActor, input: unknown) {
  try {
    return await repository.create(actor, input)
  } catch (error) {
    throw error
  }
}
export async function updatePostChannel(
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
export async function deletePostChannel(
  actor: CrudActor,
  params: Record<string, string | undefined>
) {
  try {
    return await repository.remove(actor, params)
  } catch (error) {
    throw error
  }
}
