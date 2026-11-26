"use client"
import { caller, useCallerQuery } from "@/utils/caller"
import { useAuth } from "@/hooks/use-auth"
export type { SocialPost } from "@/schemas/social-client"
export interface SocialPage<T> {
  data: T[]
  pagination?: { hasMore: boolean; limit: number; offset: number }
}
export interface SocialPerson {
  id: string
  name: string
  username: string | null
  handle: string | null
  image: string | null
  bio: string | null
  followStatus?: string | null
  followRequest?: boolean
  following: boolean
  blocked: boolean
  friendship: { requesterId: string; status: string } | null
}
export interface SocialHub {
  id: string
  name: string
  description: string
  ownerId: string
  visibility?: "public" | "private"
  requiresPostApproval?: boolean
  joined: boolean
  startsAt?: string
  cancelledAt?: string | null
}
export interface SocialIdentity {
  id: string
  user_id: string
  handle: string
  name: string
  username: string | null
  image: string | null
  bio: string | null
  website: string | null
  location: string | null
  visibility: string
  followerCount: number
  followingCount: number
}
export interface SocialStory {
  id: string
  authorId: string
  caption: string
  visibility: string
  expiresAt: string
  mediaUrl: string
  mediaType: "image" | "video"
  name: string
}
export function useSocialQuery<T>(
  path: string,
  params: Record<string, unknown> = {},
  enabled = true
) {
  const auth = useAuth()
  return useCallerQuery<T>({
    url: path,
    method: "GET",
    unwrapData: false,
    params,
    queryKey: ["social", auth.account?.id, path, params],
    queryOptions: {
      enabled: enabled && auth.authenticated,
      retry: false,
      staleTime: 5000,
      refetchOnWindowFocus: true,
    },
  })
}
export async function socialMutation<T = unknown>(
  path: string,
  body: unknown = {},
  method: "POST" | "PUT" | "PATCH" | "DELETE" = "POST"
) {
  const result = await caller<T>({ url: path, method, body })
  if (
    typeof window !== "undefined" &&
    !path.endsWith("/view") &&
    !path.startsWith("/internal/social/upload")
  )
    window.dispatchEvent(
      new CustomEvent("social:data-changed", {
        detail: {
          privacy:
            /^\/(?:social\/(?:relationship|me|hub|moderation)|insight\/)/.test(
              path
            ) ||
            method === "DELETE" ||
            method === "PATCH",
        },
      })
    )
  return result
}
export async function uploadSocialFile(
  file: File,
  bucket: string,
  signal: AbortSignal,
  onProgress: (n: number) => void
) {
  const data = await caller<{
    asset: { id: string }
    upload: { id: string; url: string; headers: Record<string, string> }
  }>({
    url: "/internal/social/upload",
    method: "POST",
    body: {
      bucket,
      filename: file.name,
      contentType: file.type,
      size: file.size,
    },
  })
  try {
    await new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.open("PUT", data.upload.url)
      xhr.timeout = 180000
      for (const [k, v] of Object.entries(data.upload.headers))
        xhr.setRequestHeader(k, v)
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable)
          onProgress(Math.round((e.loaded / e.total) * 100))
      }
      const abort = () => xhr.abort()
      signal.addEventListener("abort", abort, { once: true })
      const done = () => signal.removeEventListener("abort", abort)
      xhr.onload = () => {
        done()
        if (xhr.status >= 200 && xhr.status < 300) resolve()
        else reject(new Error("upload_failed"))
      }
      xhr.onerror = () => {
        done()
        reject(new Error("upload_failed"))
      }
      xhr.ontimeout = () => {
        done()
        reject(new Error("upload_timeout"))
      }
      xhr.onabort = () => {
        done()
        reject(new Error("upload_cancelled"))
      }
      if (signal.aborted) {
        done()
        reject(new Error("upload_cancelled"))
      } else xhr.send(file)
    })
    await caller({
      url: `/internal/social/upload/${data.upload.id}/complete`,
      method: "POST",
      body: {},
    })
    return data.asset.id
  } catch (error) {
    await caller({
      url: `/internal/social/upload/${data.upload.id}`,
      method: "DELETE",
    }).catch(() => undefined)
    throw error
  }
}
