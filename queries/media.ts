"use client"

import {
  createMutationService,
  createQueryService,
  defineMutation,
  defineQuery,
} from "@/utils/caller"

export type MediaType = "image" | "video" | "audio" | "document" | "attachment"
export type MediaVisibility = "private" | "unlisted" | "public"

export interface MediaAsset {
  id: string
  resourceType: string | null
  resourceId: string | null
  type: MediaType
  status: string
  visibility: MediaVisibility
  deliveryPath: string
  originalFilename: string | null
  mimeType: string | null
  bytes: number | null
  width: number | null
  height: number | null
  duration: string | null
  metadata: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

export interface MediaBucket {
  id: string
  name: string
  bucketName: string
  storagePrefix: string
  visibility: MediaVisibility
  allowedTypes: MediaType[]
  maxFileSize: number | null
}

export interface MediaList<T> {
  data: T[]
  pagination: {
    limit: number
    offset: number
    total: number
    hasMore: boolean
  }
}

export interface MediaAssetListInput {
  resourceType?: string
  resourceId?: string
  type?: MediaType
  visibility?: MediaVisibility
  owner?: "me" | "any"
  limit?: number
  offset?: number
}

export interface MediaUploadRequest {
  bucket: string
  file: File
  type: MediaType
  visibility?: MediaVisibility
  resourceType?: string
  resourceId?: string
  metadata?: Record<string, unknown>
}

interface MediaUploadResponse {
  asset: MediaAsset
  upload: {
    id: string
    method: "PUT" | "MULTIPART"
    url: string | null
    headers: Record<string, string>
    expiresAt: string
  }
}

const mediaQueryKey = ["media"] as const

const bucketService = defineQuery<MediaBucket[], void>({
  queryKey: [...mediaQueryKey, "bucket"],
  query: { url: "/external/media/bucket", method: "GET" },
})

const assetListService = defineQuery<
  MediaList<MediaAsset>,
  MediaAssetListInput
>({
  queryKey: (input) => [...mediaQueryKey, "asset", input] as const,
  query: (input) => ({
    url: "/external/media/asset",
    method: "GET",
    unwrapData: false,
    params: { ...input } as Record<string, unknown>,
  }),
})

const assetService = defineQuery<MediaAsset, string | null>({
  queryKey: (id) => [...mediaQueryKey, "asset", id] as const,
  query: (id) => ({ url: `/external/media/asset/${id}`, method: "GET" }),
  queryOptions: (id) => ({ enabled: Boolean(id) }),
})

const deleteAssetService = defineMutation<void, string>({
  query: (id) => ({ url: `/external/media/asset/${id}`, method: "DELETE" }),
  invalidates: (_data, id) => [[...mediaQueryKey, "asset", id]],
})

export const useMediaAssetQuery = createQueryService(assetService)
export const useMediaBucketQuery = createQueryService(bucketService)
export const useMediaAssetListQuery = createQueryService(assetListService)
export const useDeleteMediaAssetMutation =
  createMutationService(deleteAssetService)

async function readJson<T>(response: Response): Promise<T> {
  const payload = (await response.json().catch(() => ({}))) as T & {
    error?: string
  }
  if (!response.ok) {
    throw new Error(payload.error ?? `media_request_failed_${response.status}`)
  }
  return payload
}

export async function uploadMediaFile(input: MediaUploadRequest) {
  const initialized = await readJson<MediaUploadResponse>(
    await fetch("/external/media/upload", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        bucket: input.bucket,
        filename: input.file.name,
        contentType: input.file.type || "application/octet-stream",
        size: input.file.size,
        type: input.type,
        visibility: input.visibility ?? "private",
        resourceType: input.resourceType,
        resourceId: input.resourceId,
        metadata: input.metadata ?? {},
        multipart: false,
      }),
    })
  )

  if (!initialized.upload.url) throw new Error("media_upload_url_missing")
  const uploaded = await fetch(initialized.upload.url, {
    method: "PUT",
    headers: initialized.upload.headers,
    body: input.file,
  })
  if (!uploaded.ok) {
    throw new Error(`media_object_upload_failed_${uploaded.status}`)
  }

  return readJson<MediaAsset>(
    await fetch(`/external/media/upload/${initialized.upload.id}/complete`, {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: "{}",
    })
  )
}
