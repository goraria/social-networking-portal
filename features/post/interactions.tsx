"use client"

import { useMemo, useState } from "react"
import {
  Bookmark,
  Flag,
  Heart,
  MessageCircle,
  Repeat2,
} from "@gorth-com/primitive/cores/lucide"
import { NavIdentity } from "@gorth-com/primitive/dashboard/nav-user"
import { Button } from "@gorth-com/primitive/custom/button"
import { Textarea } from "@gorth-com/primitive/default/textarea"

import { AuthRequiredDialog } from "@/components/auth-required-dialog"
import { useAuth } from "@/hooks/use-auth"
import {
  type ResourceComment,
  useResourceCommentMutation,
  useResourceCommentsQuery,
  useResourceInteractionMutation,
  useResourceInteractionStateQuery,
  useResourceInteractionSummaryQuery,
} from "@/queries/resource-interactions"

function currentPath() {
  return `${window.location.pathname}${window.location.search}`
}

function countReaction(
  reactions: Array<{ type: string; count: number }> | undefined,
  type: string
) {
  return Number(reactions?.find((item) => item.type === type)?.count ?? 0)
}
function ReplyThread({
  target,
  parentId,
  depth,
}: {
  target: { resourceId: string; resourceType: string }
  parentId: string
  depth: number
}) {
  const [open, setOpen] = useState(false),
    [offset, setOffset] = useState(0),
    q = useResourceCommentsQuery({
      ...target,
      parentId,
      limit: 10,
      offset,
      enabled: open,
    }),
    [mutate] = useResourceCommentMutation(),
    auth = useAuth()
  return (
    <div className="space-y-2 border-l pl-3">
      <Button variant="ghost" onClick={() => setOpen((v) => !v)}>
        {open ? "Hide replies" : "Show replies"}
      </Button>
      {open &&
        q.data?.data.map((c) => (
          <div key={c.id} className="space-y-1">
            <NavIdentity
              user={{ name: c.author.name, avatar: c.author.image }}
            />
            <p className="whitespace-pre-wrap text-sm">{c.content}</p>
            {auth.account?.id === c.author.id && (
              <Button
                variant="ghost"
                onClick={() => {
                  if (window.confirm("Delete reply?"))
                    void mutate({
                      ...target,
                      commentId: c.id,
                      action: "delete",
                    })
                      .unwrap()
                      .catch(() => undefined)
                }}
              >
                Delete
              </Button>
            )}
            {c.replyCount > 0 && depth < 5 && (
              <ReplyThread target={target} parentId={c.id} depth={depth + 1} />
            )}
          </div>
        ))}
      {open && (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            disabled={!offset}
            onClick={() => setOffset((v) => Math.max(0, v - 10))}
          >
            Previous replies
          </Button>
          <Button
            variant="ghost"
            disabled={!q.data?.pagination.hasMore}
            onClick={() => setOffset((v) => v + 10)}
          >
            Next replies
          </Button>
        </div>
      )}
    </div>
  )
}

export function PostInteractions({
  postId,
  resourceType,
  fallbackReplyCount,
  fallbackRepostCount,
}: {
  postId: string
  resourceType: "post" | "tweet"
  fallbackReplyCount: number
  fallbackRepostCount: number
}) {
  const auth = useAuth()
  const [commentOffset, setCommentOffset] = useState(0)
  const target = { resourceId: postId, resourceType }
  const summary = useResourceInteractionSummaryQuery(target)
  const state = useResourceInteractionStateQuery({
    ...target,
    enabled: auth.authenticated,
  })
  const comments = useResourceCommentsQuery({
    ...target,
    limit: 20,
    offset: commentOffset,
  })
  const [mutateInteraction, interactionState] = useResourceInteractionMutation()
  const [mutateComment, commentState] = useResourceCommentMutation()
  const [commentsOpen, setCommentsOpen] = useState(false)
  const [comment, setComment] = useState("")
  const [authDialogOpen, setAuthDialogOpen] = useState(false)
  const [returnTo, setReturnTo] = useState("/")

  const items = useMemo(() => comments.data?.data ?? [], [comments.data?.data])
  const selectedReaction = state.data?.reaction
  const bookmarked = state.data?.saves.includes("bookmark") ?? false
  const replyCount = summary.data?.resource
    ? (comments.data?.pagination.total ?? 0)
    : fallbackReplyCount

  function requireAccount() {
    if (auth.authenticated) return true
    setReturnTo(currentPath())
    setAuthDialogOpen(true)
    return false
  }

  function interact(
    action: "reaction" | "bookmark" | "share" | "report",
    method: "POST" | "PUT" | "DELETE",
    body?: unknown
  ) {
    if (!requireAccount()) return
    void mutateInteraction({ ...target, action, method, body })
      .unwrap()
      .catch(() => undefined)
  }

  async function submitComment() {
    const content = comment.trim()
    if (!content || !requireAccount()) return
    try {
      await mutateComment({
        ...target,
        action: "create",
        body: { content },
      }).unwrap()
      setComment("")
    } catch {
      // The shared caller renders the API error.
    }
  }

  function reply(item: ResourceComment) {
    if (!requireAccount()) return
    const content = window.prompt("Reply")?.trim()
    if (!content) return
    void mutateComment({
      ...target,
      action: "create",
      body: { content, parentId: item.id },
    })
      .unwrap()
      .catch(() => undefined)
  }

  function report() {
    if (!requireAccount()) return
    const reason = window.prompt("Reason for reporting this post?")?.trim()
    if (reason) interact("report", "POST", { reason })
  }

  const busy = interactionState.isLoading

  return (
    <>
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-1">
          <Button
            variant={selectedReaction === "like" ? "default" : "ghost"}
            disabled={busy}
            onClick={() =>
              interact(
                "reaction",
                selectedReaction === "like" ? "DELETE" : "PUT",
                selectedReaction === "like" ? undefined : { type: "like" }
              )
            }
          >
            <Heart className="size-4" />
            {countReaction(summary.data?.reactions, "like")}
          </Button>
          <Button
            variant="ghost"
            onClick={() => setCommentsOpen((value) => !value)}
          >
            <MessageCircle className="size-4" />
            {replyCount}
          </Button>
          <Button
            variant="ghost"
            disabled={busy}
            onClick={() =>
              interact("share", "POST", {
                channel: "internal",
                destination: window.location.href,
              })
            }
          >
            <Repeat2 className="size-4" />
            {fallbackRepostCount}
          </Button>
          <Button
            variant={bookmarked ? "default" : "ghost"}
            size="icon"
            aria-label={bookmarked ? "Remove bookmark" : "Bookmark"}
            disabled={busy}
            onClick={() =>
              interact("bookmark", bookmarked ? "DELETE" : "PUT", {})
            }
          >
            <Bookmark className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Report post"
            disabled={busy}
            onClick={report}
          >
            <Flag className="size-4" />
          </Button>
        </div>

        {commentsOpen ? (
          <div className="flex flex-col gap-3 border-t pt-3">
            <form
              className="flex flex-col gap-2"
              onSubmit={(event) => {
                event.preventDefault()
                void submitComment()
              }}
            >
              <Textarea
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                placeholder={
                  auth.authenticated
                    ? "Write a comment..."
                    : "Sign in to comment"
                }
                maxLength={10_000}
              />
              <Button
                type="submit"
                className="self-end"
                disabled={!comment.trim() || commentState.isLoading}
              >
                Comment
              </Button>
            </form>
            {items.map((item) => (
              <article
                key={item.id}
                className="flex flex-col gap-2 border-b pb-3 last:border-0"
              >
                <NavIdentity
                  user={{ name: item.author.name, avatar: item.author.image }}
                  description={
                    item.author.username ? `@${item.author.username}` : null
                  }
                  url={
                    item.author.username
                      ? `/profile/${encodeURIComponent(item.author.username.replace(/^@/, ""))}`
                      : undefined
                  }
                  hover
                />
                <div className="min-w-0 flex-1 pl-11">
                  <p className="text-muted-foreground whitespace-pre-wrap text-sm">
                    {item.content}
                  </p>
                  <div className="mt-1 flex gap-3 text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        if (!requireAccount()) return
                        void mutateComment({
                          ...target,
                          commentId: item.id,
                          action: "react",
                          body: { type: "like" },
                        })
                          .unwrap()
                          .catch(() => undefined)
                      }}
                    >
                      Like ({item.reactionCount})
                    </button>
                    <button type="button" onClick={() => reply(item)}>
                      Reply ({item.replyCount})
                    </button>
                    {auth.account?.id === item.author.id && (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            const content = window
                              .prompt("Edit comment", item.content)
                              ?.trim()
                            if (content)
                              void mutateComment({
                                ...target,
                                commentId: item.id,
                                action: "update",
                                body: { content },
                              })
                                .unwrap()
                                .catch(() => undefined)
                          }}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm("Delete this comment?"))
                              void mutateComment({
                                ...target,
                                commentId: item.id,
                                action: "delete",
                              })
                                .unwrap()
                                .catch(() => undefined)
                          }}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                  {item.replyCount > 0 && (
                    <ReplyThread target={target} parentId={item.id} depth={0} />
                  )}
                </div>
              </article>
            ))}
            <div className="flex gap-2">
              <Button
                variant="ghost"
                disabled={!commentOffset}
                onClick={() => setCommentOffset((v) => Math.max(0, v - 20))}
              >
                Previous comments
              </Button>
              <Button
                variant="ghost"
                disabled={!comments.data?.pagination.hasMore}
                onClick={() => setCommentOffset((v) => v + 20)}
              >
                Next comments
              </Button>
            </div>
            {!items.length ? (
              <p className="text-muted-foreground text-sm">No comments yet.</p>
            ) : null}
          </div>
        ) : null}
      </div>

      <AuthRequiredDialog
        open={authDialogOpen}
        onOpenChange={setAuthDialogOpen}
        returnTo={returnTo}
      />
    </>
  )
}
