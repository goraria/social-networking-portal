"use client"

import { useMemo, useState } from "react"
import {
  Bookmark,
  Flag,
  Heart,
  MessageCircle,
  Repeat2,
} from "@gorth/primitive/cores/lucide"
import { Avatar, AvatarFallback, AvatarImage } from "@gorth/primitive/custom/avatar"
import { Button } from "@gorth/primitive/custom/button"
import { Textarea } from "@gorth/primitive/default/textarea"

import { AuthRequiredDialog } from "@/components/auth-required-dialog"
import { useAuth } from "@/hooks/use-auth"
import {
  type ResourceComment,
  useResourceCommentMutation,
  useResourceCommentsQuery,
  useResourceInteractionMutation,
  useResourceInteractionStateQuery,
  useResourceInteractionSummaryQuery,
} from "@/services/resource-interactions"

function currentPath() {
  return `${window.location.pathname}${window.location.search}`
}

function countReaction(
  reactions: Array<{ type: string; count: number }> | undefined,
  type: string,
) {
  return Number(reactions?.find((item) => item.type === type)?.count ?? 0)
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
  const target = { resourceId: postId, resourceType }
  const summary = useResourceInteractionSummaryQuery(target)
  const state = useResourceInteractionStateQuery({
    ...target,
    enabled: auth.authenticated,
  })
  const comments = useResourceCommentsQuery({ ...target, limit: 50, offset: 0 })
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
    body?: unknown,
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
      await mutateComment({ ...target, action: "create", body: { content } }).unwrap()
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
    }).unwrap().catch(() => undefined)
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
                selectedReaction === "like" ? undefined : { type: "like" },
              )
            }
          >
            <Heart className="size-4" />
            {countReaction(summary.data?.reactions, "like")}
          </Button>
          <Button variant="ghost" onClick={() => setCommentsOpen((value) => !value)}>
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
            onClick={() => interact("bookmark", bookmarked ? "DELETE" : "PUT", {})}
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
                placeholder={auth.authenticated ? "Write a comment..." : "Sign in to comment"}
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
              <article key={item.id} className="flex gap-3 border-b pb-3 last:border-0">
                <Avatar className="size-8 shrink-0">
                  {item.author.image ? <AvatarImage src={item.author.image} /> : null}
                  <AvatarFallback>
                    {(item.author.name || "G").slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{item.author.name}</p>
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
                        }).unwrap().catch(() => undefined)
                      }}
                    >
                      Like ({item.reactionCount})
                    </button>
                    <button type="button" onClick={() => reply(item)}>
                      Reply ({item.replyCount})
                    </button>
                  </div>
                </div>
              </article>
            ))}
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
