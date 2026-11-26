"use client"
import { useEffect, useRef, useState } from "react"
import { Button } from "@gorth-com/primitive/custom/button"
import { Input } from "@gorth-com/primitive/default/input"
import { toast } from "@gorth-com/primitive/custom/toast"
import { useMediaBucketQuery } from "@/queries/media"
import { uploadSocialFile, type SocialPost } from "@/queries/social"
export function PostMediaEditor({
  post,
  onUpload,
  onBusy,
}: {
  post: SocialPost
  onUpload: (id: string) => Promise<void>
  onBusy: (busy: boolean) => void
}) {
  const [bucket, setBucket] = useState(""),
    [progress, setProgress] = useState<number | null>(null),
    buckets = useMediaBucketQuery(),
    abort = useRef<AbortController | null>(null)
  useEffect(() => () => abort.current?.abort(), [])
  return (
    <div className="space-y-2">
      <select
        aria-label="Attachment storage"
        className="h-9 rounded-md border bg-background px-2"
        value={bucket}
        onChange={(e) => setBucket(e.target.value)}
      >
        <option value="">Choose storage</option>
        {buckets.data?.map((b) => (
          <option key={b.id} value={b.id}>
            {b.name}
          </option>
        ))}
      </select>
      <Input
        type="file"
        disabled={!bucket || progress !== null}
        accept={
          post.type === "reel"
            ? "video/mp4,video/webm"
            : "image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm"
        }
        onChange={async (e) => {
          const file = e.target.files?.[0]
          e.target.value = ""
          if (!file) return
          abort.current = new AbortController()
          setProgress(0)
          onBusy(true)
          try {
            const id = await uploadSocialFile(
              file,
              bucket,
              abort.current.signal,
              setProgress
            )
            await onUpload(id)
          } catch (error) {
            toast.add({
              type: "error",
              description:
                error instanceof Error ? error.message : "Upload failed",
            })
          } finally {
            setProgress(null)
            onBusy(false)
          }
        }}
      />
      {progress !== null && (
        <>
          <span>{progress}%</span>
          <Button variant="outline" onClick={() => abort.current?.abort()}>
            Cancel upload
          </Button>
        </>
      )}
    </div>
  )
}
