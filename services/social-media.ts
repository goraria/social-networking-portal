import "server-only"
import { sql } from "drizzle-orm"
import { rawSocialPlatformRequest } from "@/services/social-platform"
import { rawSocialRows, rawCheckPostAccess, rawCheckStoryAccess, rawSocialError } from "@/models/index"
import * as env from "@/utils/environment"
import type { z } from "@gorth-com/structure/cores/zod"
import { uploadSchema } from "@/schemas/social"
export async function rawInspectSocialAsset(id: string, owner: string) {
  const a = await rawSocialPlatformRequest<{
    id: string
    filename: string
    contentType: string
    size: number
  }>("media", "/media/social/asset", "POST", {
    assetId: id,
    ownerExternalUserId: owner,
  })
  if (
    a.id !== id ||
    ![
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "video/mp4",
      "video/webm",
    ].includes(a.contentType) ||
    a.size <= 0 ||
    a.size > 100 * 1024 * 1024
  )
    rawSocialError(400, "unsafe_asset")
  return a
}
export async function rawCreateSocialUpload(
  input: z.infer<typeof uploadSchema>,
  token: string
) {
  return rawSocialPlatformRequest(
    "media",
    "/media/upload",
    "POST",
    {
      ...input,
      type: input.contentType.startsWith("video/") ? "video" : "image",
      visibility: "private",
      resourceType: "social-content",
      metadata: {},
      multipart: false,
    },
    token
  )
}
export async function rawFinishSocialUpload(
  id: string,
  token: string,
  abort = false
) {
  const session = await rawSocialPlatformRequest<{
    asset: { application: string; resourceType: string }
  }>("media", `/media/upload/${id}`, "GET", undefined, token)
  if (
    session.asset.application !== "social" ||
    session.asset.resourceType !== "social-content"
  )
    rawSocialError(403, "invalid_upload_binding")
  return rawSocialPlatformRequest(
    "media",
    `/media/upload/${id}/${abort ? "abort" : "complete"}`,
    "POST",
    {},
    token
  )
}
export async function rawSocialAssetUrl(assetId: string, userId: string) {
  const [m] = await rawSocialRows(
    sql`SELECT post_id FROM post_media WHERE media_asset_id=${assetId}::uuid`
  )
  if (m) await rawCheckPostAccess(String(m.post_id), userId)
  else {
    const [s] = await rawSocialRows(
      sql`SELECT id FROM story WHERE media_asset_id=${assetId}::uuid`
    )
    if (!s) rawSocialError(404, "asset_not_found")
    await rawCheckStoryAccess(String(s.id), userId)
  }
  return rawSocialPlatformRequest<{ url: string; expiresIn: number }>(
    "media",
    "/media/social/asset-url",
    "POST",
    { assetId }
  )
}
export function rawSocialStorageCredential(bucketName: string) {
  if (
    !env.awsEndpointUrlS3 ||
    !env.awsBucket ||
    !env.awsAccessKeyId ||
    !env.awsSecretAccessKey ||
    !env.awsRegion
  )
    rawSocialError(503, "storage_not_configured")
  const url = new URL(env.awsEndpointUrlS3)
  if (
    url.protocol !== "https:" ||
    url.username ||
    url.password ||
    url.search ||
    url.hash ||
    url.pathname !== "/" ||
    bucketName !== env.awsBucket
  )
    rawSocialError(403, "storage_profile_mismatch")
  return {
    endpoint: env.awsEndpointUrlS3,
    region: env.awsRegion,
    bucketName: env.awsBucket,
    accessKeyId: env.awsAccessKeyId,
    secretAccessKey: env.awsSecretAccessKey,
  }
}
