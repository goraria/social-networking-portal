import { eq } from "drizzle-orm"
import { database } from "@/database"
import {
  createCrudRepository,
  crudKey,
  requireOwnedField,
  type CrudActor,
  type CrudListOptions,
} from "@/database/crud"
import { storiesTable } from "@/database/schema"

const repository = createCrudRepository(
  "story",
  {
    table: storiesTable,
    keys: [crudKey("id", storiesTable.id)],
    createFields: [
      "authorId",
      "mediaType",
      "mediaUrl",
      "caption",
      "visibility",
      "expiresAt",
    ],
    updateFields: [
      "mediaType",
      "mediaUrl",
      "caption",
      "visibility",
      "expiresAt",
    ],
    dateFields: ["expiresAt"],
    orderBy: storiesTable.createdAt,
  },
  {
    create: (payload, actor) => requireOwnedField(payload, "authorId", actor),
    mutate: (row, actor) => {
      if (!actor.isAdmin) requireOwnedField(row, "authorId", actor)
    },
  }
)

export async function isStoryOwner(storyId: string | null, actor: CrudActor) {
  try {
    if (!storyId) return false
    const [story] = await database
      .select({ authorId: storiesTable.authorId })
      .from(storiesTable)
      .where(eq(storiesTable.id, storyId))
      .limit(1)
    return actor.isAdmin || story?.authorId === actor.userId
  } catch (error) {
    throw error
  }
}
export async function listStories(actor: CrudActor, options?: CrudListOptions) {
  try {
    return await repository.list(actor, options)
  } catch (error) {
    throw error
  }
}
export async function getStory(
  actor: CrudActor,
  params: Record<string, string | undefined>
) {
  try {
    return await repository.get(actor, params)
  } catch (error) {
    throw error
  }
}
export async function createStory(actor: CrudActor, input: unknown) {
  try {
    return await repository.create(actor, input)
  } catch (error) {
    throw error
  }
}
export async function updateStory(
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
export async function deleteStory(
  actor: CrudActor,
  params: Record<string, string | undefined>
) {
  try {
    return await repository.remove(actor, params)
  } catch (error) {
    throw error
  }
}
