import type { Context } from "hono"
import { CrudError, type CrudActor } from "@/database/crud"
import { rawGetUserByExternalId } from "@/models/user"
import type { ApiEnv } from "@/utils/interface"
export async function readJsonBody(context: Context<ApiEnv>) {
  if (
    context.req.header("content-type")?.split(";")[0]?.trim().toLowerCase() !==
    "application/json"
  )
    throw new CrudError(415, "json_required", "JSON content type is required")
  return context.req.json()
}

export function parsePagination(value: unknown, field: "limit" | "offset") {
  if (value === undefined) return undefined
  if (
    typeof value !== "string" ||
    !/^\d+$/.test(value) ||
    !Number.isSafeInteger(Number(value))
  )
    throw new CrudError(
      400,
      "invalid_pagination",
      field + " must be a safe integer"
    )
  return Number(value)
}
export async function resolveActor(
  context: Context<ApiEnv>
): Promise<CrudActor> {
  const auth = context.get("auth")
  if (!auth?.user)
    throw new CrudError(401, "unauthorized", "Authentication is required")
  const user = await rawGetUserByExternalId(auth.user.id)
  if (!user)
    throw new CrudError(409, "social_user_not_synced", "Local user is missing")
  // Administrative rights belong to Social, never the SSO app claim.
  return {
    userId: user.id,
    isAdmin: user.role === "admin" || user.role === "master",
  }
}
