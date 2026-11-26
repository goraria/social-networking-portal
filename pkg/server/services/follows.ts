import {
  createCrudRepository,
  crudKey,
  CrudError,
  readString,
  requireOwnedField,
  type CrudActor,
  type CrudListOptions,
} from "@/database/crud"
import { followsTable } from "@/database/schema"

function assertParticipant(row: Record<string, unknown>, actor: CrudActor) {
  if (actor.isAdmin) return
  if (
    readString(row, "followerId") !== actor.userId &&
    readString(row, "followingId") !== actor.userId
  ) {
    throw new CrudError(
      403,
      "forbidden",
      "Follow relationship belongs to another user"
    )
  }
}

const repository = createCrudRepository(
  "follow",
  {
    table: followsTable,
    keys: [
      crudKey("followerId", followsTable.followerId),
      crudKey("followingId", followsTable.followingId),
    ],
    createFields: ["followerId", "followingId", "status"],
    updateFields: ["status"],
    orderBy: followsTable.createdAt,
    touchUpdatedAt: true,
  },
  {
    create: (payload, actor) => requireOwnedField(payload, "followerId", actor),
    mutate: assertParticipant,
  }
)

export async function listFollows(actor: CrudActor, options?: CrudListOptions) {
  try {
    return await repository.list(actor, options)
  } catch (error) {
    throw error
  }
}
export async function getFollow(
  actor: CrudActor,
  params: Record<string, string | undefined>
) {
  try {
    return await repository.get(actor, params)
  } catch (error) {
    throw error
  }
}
export async function createFollow(actor: CrudActor, input: unknown) {
  try {
    return await repository.create(actor, input)
  } catch (error) {
    throw error
  }
}
export async function updateFollow(
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
export async function deleteFollow(
  actor: CrudActor,
  params: Record<string, string | undefined>
) {
  try {
    return await repository.remove(actor, params)
  } catch (error) {
    throw error
  }
}
