import {
  createCrudRepository,
  crudKey,
  CrudError,
  type CrudActor,
  type CrudListOptions,
} from "@/database/crud"
import { hashtagsTable } from "@/database/schema"

const repository = createCrudRepository(
  "hashtag",
  {
    table: hashtagsTable,
    keys: [crudKey("id", hashtagsTable.id)],
    createFields: ["name", "postCount"],
    updateFields: ["name", "postCount"],
    orderBy: hashtagsTable.createdAt,
  },
  {
    mutate: (_row, actor) => {
      if (!actor.isAdmin)
        throw new CrudError(
          403,
          "forbidden",
          "Only administrators can mutate global hashtags"
        )
    },
  }
)

export async function listHashtags(
  actor: CrudActor,
  options?: CrudListOptions
) {
  try {
    return await repository.list(actor, options)
  } catch (error) {
    throw error
  }
}
export async function getHashtag(
  actor: CrudActor,
  params: Record<string, string | undefined>
) {
  try {
    return await repository.get(actor, params)
  } catch (error) {
    throw error
  }
}
export async function createHashtag(actor: CrudActor, input: unknown) {
  try {
    return await repository.create(actor, input)
  } catch (error) {
    throw error
  }
}
export async function updateHashtag(
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
export async function deleteHashtag(
  actor: CrudActor,
  params: Record<string, string | undefined>
) {
  try {
    return await repository.remove(actor, params)
  } catch (error) {
    throw error
  }
}
