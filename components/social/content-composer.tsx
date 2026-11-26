"use client"
import { useEffect, useRef, useState } from "react"
import { Button } from "@gorth-com/primitive/custom/button"
import { Input } from "@gorth-com/primitive/default/input"
import { Textarea } from "@gorth-com/primitive/default/textarea"
import { Card, CardContent } from "@gorth-com/primitive/default/card"
import { toast } from "@gorth-com/primitive/custom/toast"
import { useMediaBucketQuery } from "@/queries/media"
import { socialMutation, uploadSocialFile } from "@/queries/social"
export function ContentComposer({
  type = "standard",
  onChange,
  story = false,
  groupId: initialGroupId,
  communityId: initialCommunityId,
}: {
  groupId?: string
  communityId?: string
  type?: "standard" | "tweet" | "reel"
  onChange: () => void
  story?: boolean
}) {
  const [content, setContent] = useState(""),
    [visibility, setVisibility] = useState("public"),
    [policy, setPolicy] = useState("everyone"),
    [quotePolicy, setQuotePolicy] = useState("everyone"),
    [assets, setAssets] = useState<string[]>([]),
    [bucket, setBucket] = useState(""),
    [progress, setProgress] = useState<number | null>(null),
    [busy, setBusy] = useState(false),
    [schedule, setSchedule] = useState("")
  const groupId = initialGroupId,
    communityId = initialCommunityId
  const buckets = useMediaBucketQuery(),
    abort = useRef<AbortController | null>(null),
    request = useRef<string | null>(null)
  useEffect(() => () => abort.current?.abort(), [])
  useEffect(() => {
    const guard = (e: BeforeUnloadEvent) => {
      if (content || assets.length) {
        e.preventDefault()
      }
    }
    window.addEventListener("beforeunload", guard)
    return () => window.removeEventListener("beforeunload", guard)
  }, [content, assets.length])
  async function submit() {
    setBusy(true)
    try {
      request.current ??= crypto.randomUUID()
      const result = await socialMutation<{ status?: string }>(
        story ? "/social/story" : "/social/post",
        story
          ? {
              assetId: assets[0],
              caption: content,
              visibility,
              expiresAt: new Date(Date.now() + 86400000 - 1000).toISOString(),
            }
          : {
              type,
              content: content || "Media post",
              visibility,
              replyPolicy: policy,
              quotePolicy,
              assetIds: assets,
              clientRequestId: request.current,
              ...(schedule
                ? {
                    status: "scheduled",
                    scheduledAt: new Date(schedule).toISOString(),
                  }
                : {}),
              ...(groupId ? { groupId } : {}),
              ...(communityId ? { communityId } : {}),
            }
      )
      setContent("")
      setAssets([])
      request.current = null
      toast.add({
        type: "success",
        description:
          result.status === "draft"
            ? "Saved for review. View it in My posts."
            : result.status === "scheduled"
              ? "Publication scheduled."
              : "Published",
      })
      onChange()
    } catch (e) {
      toast.add({
        type: "error",
        description: e instanceof Error ? e.message : "Unable to publish",
      })
    } finally {
      setBusy(false)
    }
  }
  return (
    <Card>
      <CardContent className="space-y-3 pt-4">
        <Textarea
          aria-label="Post content"
          maxLength={10000}
          placeholder={story ? "Story caption" : "Share something…"}
          value={content}
          onChange={(e) => {
            setContent(e.target.value)
            request.current = null
          }}
        />
        <div className="flex flex-wrap gap-2">
          <label>
            Visibility{" "}
            <select
              className="h-9 rounded-md border bg-background px-2"
              value={visibility}
              onChange={(e) => {
                setVisibility(e.target.value)
                request.current = null
              }}
            >
              {["public", "followers", "friends", "private"].map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </label>
          {!story && (
            <>
              <label>
                Reply{" "}
                <select
                  className="h-9 rounded-md border bg-background px-2"
                  value={policy}
                  onChange={(e) => {
                    setPolicy(e.target.value)
                    request.current = null
                  }}
                >
                  {[
                    "everyone",
                    "followers",
                    "following",
                    "friends",
                    "nobody",
                  ].map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
              </label>
              <label>
                Quote{" "}
                <select
                  className="h-9 rounded-md border bg-background px-2"
                  value={quotePolicy}
                  onChange={(e) => {
                    setQuotePolicy(e.target.value)
                    request.current = null
                  }}
                >
                  {[
                    "everyone",
                    "followers",
                    "following",
                    "friends",
                    "nobody",
                  ].map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
              </label>
              <Input
                aria-label="Schedule publication"
                type="datetime-local"
                value={schedule}
                onChange={(e) => {
                  setSchedule(e.target.value)
                  request.current = null
                }}
              />
            </>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            aria-label="Media bucket"
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
            accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm"
            disabled={
              !bucket ||
              progress !== null ||
              busy ||
              assets.length >= (story ? 1 : 10)
            }
            onChange={async (e) => {
              const file = e.target.files?.[0]
              e.target.value = ""
              if (!file) return
              abort.current = new AbortController()
              setProgress(0)
              try {
                const id = await uploadSocialFile(
                  file,
                  bucket,
                  abort.current.signal,
                  setProgress
                )
                setAssets((a) => [...a, id])
                request.current = null
              } catch (err) {
                toast.add({
                  type: "error",
                  description:
                    err instanceof Error ? err.message : "Upload failed",
                })
              } finally {
                setProgress(null)
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
          {assets.map((id, i) => (
            <Button
              key={id}
              variant="outline"
              onClick={() => {
                setAssets((a) => a.filter((x) => x !== id))
                request.current = null
              }}
            >
              Remove file {i + 1}
            </Button>
          ))}
          <Button
            disabled={
              busy ||
              progress !== null ||
              (!content.trim() && !assets.length) ||
              (story && !assets.length)
            }
            onClick={() => void submit()}
          >
            {busy ? "Publishing…" : story ? "Publish story" : "Publish"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
