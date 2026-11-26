"use client"
import { useState } from "react"
import { Button } from "@gorth-com/primitive/custom/button"
import { useSocialQuery, type SocialPost } from "@/queries/social"
import { ContentCard } from "@/components/social/content-card"
import { useUser } from "@/hooks/use-user"
export function Saved() {
  const [offset, setOffset] = useState(0),
    q = useSocialQuery<
      | { data: { resource: { resourceId: string } }[] }
      | { resource: { resourceId: string } }[]
    >("/resource/me/bookmark", {
      limit: 20,
      offset,
      type: "bookmark",
      resourceType: "post",
    })
  const entries = Array.isArray(q.data) ? q.data : (q.data?.data ?? [])
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Saved posts</h1>
      {q.isError ? (
        <p role="alert">
          Saved posts unavailable.{" "}
          <Button onClick={() => void q.refetch()}>Retry</Button>
        </p>
      ) : q.isLoading ? (
        <p>Loading…</p>
      ) : entries.length ? (
        entries.map((x) => (
          <SavedPost key={x.resource.resourceId} id={x.resource.resourceId} />
        ))
      ) : (
        <p>No saved posts.</p>
      )}
      <div className="flex gap-2">
        <Button
          disabled={!offset}
          onClick={() => setOffset((v) => Math.max(0, v - 20))}
        >
          Previous
        </Button>
        <Button
          disabled={entries.length < 20}
          onClick={() => setOffset((v) => v + 20)}
        >
          Next
        </Button>
      </div>
    </section>
  )
}
function SavedPost({ id }: { id: string }) {
  const { user } = useUser(),
    q = useSocialQuery<{ data: SocialPost }>("/social/post/" + id)
  return q.data?.data ? (
    <ContentCard
      post={q.data.data}
      currentUserId={user?.id}
      onChange={() => void q.refetch()}
    />
  ) : null
}
