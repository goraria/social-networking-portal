import { eq, or } from "drizzle-orm"
import {
  createCrudRepository,
  crudKey,
  CrudError,
  readString,
  requireOwnedField,
  type CrudActor,
  type CrudListOptions,
} from "@/database/crud"
import { friendshipsTable } from "@/database/schema"

function assertParticipant(row: Record<string, unknown>, actor: CrudActor) {
  if (actor.isAdmin) return
  if (
    readString(row, "requesterId") !== actor.userId &&
    readString(row, "addresseeId") !== actor.userId
  ) {
    throw new CrudError(403, "forbidden", "Friendship belongs to another user")
  }
}

const repository = createCrudRepository(
  "friendship",
  {
    table: friendshipsTable,
    keys: [
      crudKey("requesterId", friendshipsTable.requesterId),
      crudKey("addresseeId", friendshipsTable.addresseeId),
    ],
    createFields: ["requesterId", "addresseeId", "status"],
    updateFields: ["status"],
    orderBy: friendshipsTable.createdAt,
    touchUpdatedAt: true,
  },
  {
    readScope: (actor) =>
      actor.isAdmin
        ? undefined
        : or(
            eq(friendshipsTable.requesterId, actor.userId),
            eq(friendshipsTable.addresseeId, actor.userId)
          ),
    read: assertParticipant,
    create: (payload, actor) =>
      requireOwnedField(payload, "requesterId", actor),
    mutate: assertParticipant,
  }
)

export async function listFriendships(
  actor: CrudActor,
  options?: CrudListOptions
) {
  try {
    return await repository.list(actor, options)
  } catch (error) {
    throw error
  }
}
export async function getFriendship(
  actor: CrudActor,
  params: Record<string, string | undefined>
) {
  try {
    return await repository.get(actor, params)
  } catch (error) {
    throw error
  }
}
export async function createFriendship(actor: CrudActor, input: unknown) {
  try {
    return await repository.create(actor, input)
  } catch (error) {
    throw error
  }
}
export async function updateFriendship(
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
export async function deleteFriendship(
  actor: CrudActor,
  params: Record<string, string | undefined>
) {
  try {
    return await repository.remove(actor, params)
  } catch (error) {
    throw error
  }
}
