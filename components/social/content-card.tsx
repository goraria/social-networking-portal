"use client"
/* eslint-disable @next/next/no-img-element -- Private media needs the user's same-origin cookies, which the image optimizer cannot forward. */
import { useState } from "react"
import Link from "next/link"
import {
  Card,
  CardContent,
  CardHeader,
} from "@gorth-com/primitive/default/card"
import { Button } from "@gorth-com/primitive/custom/button"
import { Textarea } from "@gorth-com/primitive/default/textarea"
import { NavIdentity } from "@gorth-com/primitive/dashboard/nav-user"
import { toast } from "@gorth-com/primitive/custom/toast"
import { PostMediaEditor } from "@/components/social/post-media-editor"
import { PostInteractions } from "@/features/post/interactions"
import {
  socialMutation,
  useSocialQuery,
  type SocialPost,
} from "@/queries/social"
function EmbeddedPost({ id }: { id: string }) {
  const q = useSocialQuery<{ data: SocialPost }>("/social/post/" + id)
  return (
    <blockquote className="rounded-md border p-3">
      {q.data?.data ? (
        <>
          <p className="text-sm font-semibold">{q.data.data.author.name}</p>
          <p className="whitespace-pre-wrap">{q.data.data.content}</p>
        </>
      ) : (
        <p className="text-sm text-muted-foreground">
          Original post unavailable.
        </p>
      )}
    </blockquote>
  )
}
export function ContentCard({
  post,
  currentUserId,
  onChange,
}: {
  post: SocialPost
  currentUserId?: string
  onChange: () => void
}) {
  const [editing, setEditing] = useState(false),
    [draft, setDraft] = useState(post.content ?? ""),
    [version, setVersion] = useState(post.version),
    [busy, setBusy] = useState(false)
  async function act(
    path: string,
    body: unknown,
    method: "POST" | "PATCH" | "DELETE" = "POST"
  ) {
    setBusy(true)
    try {
      await socialMutation(path, body, method)
      setEditing(false)
      onChange()
    } catch (e) {
      toast.add({
        type: "error",
        description: e instanceof Error ? e.message : "Unable to save",
      })
    } finally {
      setBusy(false)
    }
  }
  return (
    <Card>
      <CardHeader>
        <NavIdentity
          user={{ name: post.author.name, avatar: post.author.image }}
          description={
            "@" + (post.author.username ?? post.authorId.slice(0, 8))
          }
          url={
            post.author.username
              ? "/profile/" + post.author.username
              : undefined
          }
        />
        <Link
          href={"/post/" + post.id}
          className="text-xs text-muted-foreground"
        >
          {new Date(post.publishedAt).toLocaleString()} · {post.visibility} ·{" "}
          {post.status}
        </Link>
      </CardHeader>
      <CardContent className="space-y-4">
        {editing ? (
          <>
            <Textarea
              value={draft}
              maxLength={10000}
              onChange={(e) => setDraft(e.target.value)}
            />
            <Button
              disabled={busy}
              onClick={() =>
                void act(
                  "/social/post/" + post.id,
                  { content: draft, version },
                  "PATCH"
                )
              }
            >
              Save
            </Button>
            <PostMediaEditor
              post={post}
              onBusy={setBusy}
              onUpload={(assetId) =>
                act(
                  "/social/post/" + post.id,
                  {
                    version: post.version,
                    assetIds: [assetId],
                    removeAssetIds:
                      post.type === "reel"
                        ? post.media.map((m) => m.assetId)
                        : [],
                  },
                  "PATCH"
                )
              }
            />
            <Button variant="ghost" onClick={() => setEditing(false)}>
              Cancel
            </Button>
          </>
        ) : (
          <p className="whitespace-pre-wrap break-words">{post.content}</p>
        )}
        {post.media.map((m) =>
          m.type === "video" ? (
            <video
              key={m.id}
              src={m.url}
              controls
              preload="metadata"
              className="max-h-[36rem] w-full rounded-lg"
            />
          ) : (
            <img
              key={m.id}
              src={m.url}
              alt={m.alt}
              loading="lazy"
              className="max-h-[36rem] w-full rounded-lg object-contain"
            />
          )
        )}
        {(post.repostOfId || post.quotedPostId) && (
          <EmbeddedPost id={(post.repostOfId || post.quotedPostId)!} />
        )}
        <div className="flex flex-wrap gap-2">
          {currentUserId === post.authorId ? (
            <>
              <Button
                variant="ghost"
                disabled={busy}
                onClick={() => {
                  setDraft(post.content ?? "")
                  setVersion(post.version)
                  setEditing(true)
                }}
              >
                Edit
              </Button>
              <Button
                variant="ghost"
                disabled={busy}
                onClick={() =>
                  void act(
                    "/social/post/" + post.id,
                    {
                      version: post.version,
                      status:
                        post.status === "archived" ? "published" : "archived",
                    },
                    "PATCH"
                  )
                }
              >
                {post.status === "archived" ? "Restore" : "Archive"}
              </Button>
              {post.status === "draft" && (
                <Button
                  variant="ghost"
                  disabled={busy}
                  onClick={() =>
                    void act(
                      "/social/post/" + post.id,
                      { version: post.version, status: "published" },
                      "PATCH"
                    )
                  }
                >
                  Publish / request review
                </Button>
              )}
              {post.media.map((m) => (
                <Button
                  key={m.id}
                  variant="ghost"
                  disabled={busy}
                  onClick={() =>
                    void act(
                      "/social/post/" + post.id,
                      { version: post.version, removeAssetIds: [m.assetId] },
                      "PATCH"
                    )
                  }
                >
                  Remove attachment
                </Button>
              ))}
              <Button
                variant="ghost"
                disabled={busy}
                onClick={() => {
                  if (window.confirm("Delete this post?"))
                    void act("/social/post/" + post.id, {}, "DELETE")
                }}
              >
                Delete
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                disabled={busy}
                onClick={() =>
                  void act("/social/post/" + post.id + "/hide", {})
                }
              >
                Not interested
              </Button>
              <Button
                variant="ghost"
                disabled={busy}
                onClick={() =>
                  void act("/social/relationship", {
                    targetId: post.authorId,
                    action: "mute",
                  })
                }
              >
                Mute author
              </Button>
            </>
          )}
          <Button
            variant="ghost"
            disabled={busy}
            onClick={() =>
              void act("/social/post", {
                type: "standard",
                content: "Reposted a post",
                repostOfId: post.id,
                clientRequestId: crypto.randomUUID(),
              })
            }
          >
            Repost
          </Button>
          <Button
            variant="ghost"
            disabled={busy}
            onClick={() => {
              const quote = window.prompt("Add your quote")
              if (quote?.trim())
                void act("/social/post", {
                  type: "standard",
                  content: quote,
                  quotedPostId: post.id,
                  clientRequestId: crypto.randomUUID(),
                })
            }}
          >
            Quote
          </Button>
        </div>
        <PostInteractions
          postId={post.id}
          resourceType="post"
          fallbackReplyCount={0}
          fallbackRepostCount={post.repostCount}
        />
      </CardContent>
    </Card>
  )
}
