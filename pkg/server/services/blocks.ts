import { eq } from "drizzle-orm"
import {
  createCrudRepository,
  crudKey,
  requireOwnedField,
  type CrudActor,
  type CrudListOptions,
} from "@/database/crud"
import { blocksTable } from "@/database/schema"

const repository = createCrudRepository(
  "block",
  {
    table: blocksTable,
    keys: [
      crudKey("blockerId", blocksTable.blockerId),
      crudKey("blockedId", blocksTable.blockedId),
    ],
    createFields: ["blockerId", "blockedId"],
    updateFields: [],
    orderBy: blocksTable.createdAt,
  },
  {
    readScope: (actor) =>
      actor.isAdmin ? undefined : eq(blocksTable.blockerId, actor.userId),
    read: (row, actor) => {
      if (!actor.isAdmin) requireOwnedField(row, "blockerId", actor)
    },
    create: (payload, actor) => requireOwnedField(payload, "blockerId", actor),
    mutate: (row, actor) => {
      if (!actor.isAdmin) requireOwnedField(row, "blockerId", actor)
    },
  }
)

export async function listBlocks(actor: CrudActor, options?: CrudListOptions) {
  try {
    return await repository.list(actor, options)
  } catch (error) {
    throw error
  }
}
export async function getBlock(
  actor: CrudActor,
  params: Record<string, string | undefined>
) {
  try {
    return await repository.get(actor, params)
  } catch (error) {
    throw error
  }
}
export async function createBlock(actor: CrudActor, input: unknown) {
  try {
    return await repository.create(actor, input)
  } catch (error) {
    throw error
  }
}
export async function updateBlock(
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
export async function deleteBlock(
  actor: CrudActor,
  params: Record<string, string | undefined>
) {
  try {
    return await repository.remove(actor, params)
  } catch (error) {
    throw error
  }
}
