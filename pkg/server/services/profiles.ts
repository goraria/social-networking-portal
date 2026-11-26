import {
  createCrudRepository,
  crudKey,
  CrudError,
  requireOwnedField,
  type CrudActor,
  type CrudListOptions,
} from "@/database/crud"
import { eq, sql } from "drizzle-orm"
import { database } from "@/database"
import { profilesTable } from "@/database/schema"

const repository = createCrudRepository(
  "profile",
  {
    table: profilesTable,
    keys: [crudKey("userId", profilesTable.userId)],
    createFields: [
      "userId",
      "handle",
      "bio",
      "coverImage",
      "website",
      "location",
      "followerCount",
      "followingCount",
      "postCount",
    ],
    updateFields: [
      "handle",
      "bio",
      "coverImage",
      "website",
      "location",
      "followerCount",
      "followingCount",
      "postCount",
    ],
    orderBy: profilesTable.createdAt,
    touchUpdatedAt: true,
  },
  {
    create: (payload, actor) => requireOwnedField(payload, "userId", actor),
    mutate: (row, actor) => {
      if (!actor.isAdmin) requireOwnedField(row, "userId", actor)
    },
  }
)

export async function listProfiles(
  actor: CrudActor,
  options?: CrudListOptions
) {
  try {
    return await repository.list(actor, options)
  } catch (error) {
    throw error
  }
}
export async function getProfile(
  actor: CrudActor,
  params: Record<string, string | undefined>
) {
  try {
    return await repository.get(actor, params)
  } catch (error) {
    throw error
  }
}
export async function getProfileByHandle(handle: string) {
  const [profile] = await database
    .select()
    .from(profilesTable)
    .where(eq(sql`lower(${profilesTable.handle})`, handle.toLowerCase()))
    .limit(1)

  if (!profile) {
    throw new CrudError(404, "not_found", "Profile not found")
  }

  return profile
}
export async function createProfile(actor: CrudActor, input: unknown) {
  try {
    return await repository.create(actor, input)
  } catch (error) {
    throw error
  }
}
export async function updateProfile(
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
export async function deleteProfile(
  actor: CrudActor,
  params: Record<string, string | undefined>
) {
  try {
    return await repository.remove(actor, params)
  } catch (error) {
    throw error
  }
}
