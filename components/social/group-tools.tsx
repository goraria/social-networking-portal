"use client"
import { useState } from "react"
import { Button } from "@gorth-com/primitive/custom/button"
import { Checkbox } from "@gorth-com/primitive/default/checkbox"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@gorth-com/primitive/default/card"
import { toast } from "@gorth-com/primitive/custom/toast"
import { PostTimeline } from "@/features/post"
import {
  useSocialQuery,
  socialMutation,
  type SocialPost,
  type SocialPage,
  type SocialPerson,
} from "@/queries/social"
export function GroupQueue({ id }: { id: string }) {
  const q = useSocialQuery<SocialPage<SocialPost>>(
    "/social/group/" + id + "/queue"
  )
  if (q.isError || !q.data?.data.length) return null
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending moderation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {q.data.data.map((p) => (
          <div key={p.id}>
            <p>
              {p.author.name}: {p.content}
            </p>
            {["approve", "reject"].map((decision) => (
              <Button
                key={decision}
                variant="outline"
                onClick={() =>
                  void socialMutation("/social/post/" + p.id + "/review", {
                    decision,
                    version: p.version,
                  })
                    .then(() => q.refetch())
                    .catch((e) =>
                      toast.add({ type: "error", description: String(e) })
                    )
                }
              >
                {decision}
              </Button>
            ))}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
export function FeedDetail({ id }: { id: string }) {
  const [draft, setDraft] = useState<string[] | null>(null),
    [busy, setBusy] = useState(false),
    [revision, setRevision] = useState(0),
    people = useSocialQuery<SocialPage<SocialPerson>>("/social/people"),
    sources = useSocialQuery<{ data: { userIds: string[] } }>(
      "/social/feed/" + id + "/source"
    ),
    selected = draft ?? sources.data?.data.userIds ?? []
  return (
    <section className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Choose feed sources</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {people.data?.data.map((p) => (
            <label key={p.id} className="flex items-center gap-2">
              <Checkbox
                checked={selected.includes(p.id)}
                onCheckedChange={(checked) =>
                  setDraft(
                    checked
                      ? [...selected, p.id]
                      : selected.filter((id) => id !== p.id)
                  )
                }
              />
              {p.name}
            </label>
          ))}
          <Button
            disabled={busy}
            onClick={async () => {
              setBusy(true)
              try {
                await socialMutation(
                  "/social/feed/" + id + "/source",
                  { userIds: selected },
                  "PUT"
                )
                setRevision((v) => v + 1)
              } catch (e) {
                toast.add({ type: "error", description: String(e) })
              } finally {
                setBusy(false)
              }
            }}
          >
            Save sources
          </Button>
        </CardContent>
      </Card>
      <PostTimeline key={revision} feedId={id} />
    </section>
  )
}
