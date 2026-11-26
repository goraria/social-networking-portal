import { eq } from "drizzle-orm"
import {
  createCrudRepository,
  crudKey,
  CrudError,
  readString,
  requireOwnedField,
  type CrudActor,
  type CrudListOptions,
} from "@/database/crud"
import { storyViewsTable } from "@/database/schema"
import { isStoryOwner } from "@/services/stories"

async function assertCanRead(row: Record<string, unknown>, actor: CrudActor) {
  if (actor.isAdmin || readString(row, "viewerId") === actor.userId) return
  if (!(await isStoryOwner(readString(row, "storyId"), actor)))
    throw new CrudError(403, "forbidden", "Story view is private")
}
const repository = createCrudRepository(
  "story view",
  {
    table: storyViewsTable,
    keys: [
      crudKey("storyId", storyViewsTable.storyId),
      crudKey("viewerId", storyViewsTable.viewerId),
    ],
    createFields: ["storyId", "viewerId", "viewedAt"],
    updateFields: ["viewedAt"],
    dateFields: ["viewedAt"],
    orderBy: storyViewsTable.viewedAt,
  },
  {
    readScope: (actor) =>
      actor.isAdmin ? undefined : eq(storyViewsTable.viewerId, actor.userId),
    read: assertCanRead,
    create: (payload, actor) => requireOwnedField(payload, "viewerId", actor),
    mutate: (row, actor) => {
      if (!actor.isAdmin) requireOwnedField(row, "viewerId", actor)
    },
  }
)

export async function listStoryViews(
  actor: CrudActor,
  options?: CrudListOptions
) {
  try {
    return await repository.list(actor, options)
  } catch (error) {
    throw error
  }
}
export async function getStoryView(
  actor: CrudActor,
  params: Record<string, string | undefined>
) {
  try {
    return await repository.get(actor, params)
  } catch (error) {
    throw error
  }
}
export async function createStoryView(actor: CrudActor, input: unknown) {
  try {
    return await repository.create(actor, input)
  } catch (error) {
    throw error
  }
}
export async function updateStoryView(
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
export async function deleteStoryView(
  actor: CrudActor,
  params: Record<string, string | undefined>
) {
  try {
    return await repository.remove(actor, params)
  } catch (error) {
    throw error
  }
}
