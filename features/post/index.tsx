"use client"
import { useState } from "react"
import { Button } from "@gorth-com/primitive/custom/button"
import { Input } from "@gorth-com/primitive/default/input"
import { Spinner } from "@gorth-com/primitive/pattern/spinner"
import { useUser } from "@/hooks/use-user"
import { ContentCard } from "@/components/social/content-card"
import { ContentComposer } from "@/components/social/content-composer"
import {
  useSocialQuery,
  type SocialPage,
  type SocialPost,
} from "@/queries/social"
export function PostTimeline({
  variant = "post",
  authorId,
  postId,
  groupId,
  communityId,
  feedId,
  reel = false,
}: {
  variant?: "post" | "tweet"
  authorId?: string
  postId?: string
  groupId?: string
  communityId?: string
  feedId?: string
  reel?: boolean
}) {
  const { user } = useUser(),
    [offset, setOffset] = useState(0),
    [mode, setMode] = useState("all"),
    [q, setQ] = useState("")
  const query = useSocialQuery<SocialPage<SocialPost> | { data: SocialPost }>(
    postId ? "/social/post/" + postId : "/social/feed",
    {
      limit: 20,
      offset,
      mode: reel ? "reel" : variant === "tweet" ? "tweet" : mode,
      ...(authorId ? { authorId } : {}),
      ...(groupId ? { groupId } : {}),
      ...(communityId ? { communityId } : {}),
      ...(feedId ? { feedId } : {}),
      q,
    },
    !!user
  )
  const posts = Array.isArray(query.data?.data)
    ? query.data.data
    : query.data?.data
      ? [query.data.data]
      : []
  return (
    <section className="flex flex-col gap-4">
      {!postId && !authorId && (
        <>
          <ContentComposer
            type={reel ? "reel" : variant === "tweet" ? "tweet" : "standard"}
            groupId={groupId}
            communityId={communityId}
            onChange={() => void query.refetch()}
          />
          <div className="flex gap-2">
            <Input
              type="search"
              placeholder="Search posts…"
              value={q}
              onChange={(e) => {
                setQ(e.target.value)
                setOffset(0)
              }}
            />
            {!reel &&
              variant === "post" &&
              ["all", "following", "mine"].map((x) => (
                <Button
                  key={x}
                  variant={mode === x ? "default" : "outline"}
                  onClick={() => {
                    setMode(x)
                    setOffset(0)
                  }}
                >
                  {x}
                </Button>
              ))}
          </div>
        </>
      )}
      {query.isLoading ? (
        <Spinner variant="infinite" size={24} />
      ) : query.isError ? (
        <div role="alert">
          Unable to load posts.{" "}
          <Button onClick={() => void query.refetch()}>Retry</Button>
        </div>
      ) : posts.length ? (
        posts.map((p) => (
          <ContentCard
            key={p.id}
            post={p}
            currentUserId={user?.id}
            onChange={() => void query.refetch()}
          />
        ))
      ) : (
        <p className="py-12 text-center text-muted-foreground">
          No posts to show.
        </p>
      )}
      {!postId && (
        <div className="flex gap-2">
          <Button
            disabled={offset === 0}
            onClick={() => setOffset((v) => Math.max(0, v - 20))}
          >
            Previous
          </Button>
          <Button
            disabled={
              !query.data ||
              !("pagination" in query.data) ||
              !query.data.pagination?.hasMore
            }
            onClick={() => setOffset((v) => v + 20)}
          >
            Next
          </Button>
        </div>
      )}
    </section>
  )
}
export function CreatePost({
  initialVariant = "post",
}: {
  initialVariant?: "post" | "tweet"
}) {
  return (
    <ContentComposer
      type={initialVariant === "tweet" ? "tweet" : "standard"}
      onChange={() => {
        window.location.href = initialVariant === "tweet" ? "/tweet" : "/post"
      }}
    />
  )
}
