"use client"
import { useState } from "react"
import { Button } from "@gorth-com/primitive/custom/button"
import { NavIdentity } from "@gorth-com/primitive/dashboard/nav-user"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@gorth-com/primitive/default/card"
import { toast } from "@gorth-com/primitive/custom/toast"
import {
  useSocialQuery,
  socialMutation,
  type SocialPerson,
  type SocialPage,
} from "@/queries/social"
import { useUser } from "@/hooks/use-user"
interface Member {
  id: string
  name: string
  image: string | null
  role: string
}
interface Members extends SocialPage<Member> {
  requests: Member[]
  viewerRole: string
}
export function HubMembers({
  kind,
  id,
}: {
  kind: "group" | "community"
  id: string
}) {
  const { user } = useUser(),
    [offset, setOffset] = useState(0),
    [target, setTarget] = useState(""),
    [busy, setBusy] = useState(false),
    q = useSocialQuery<Members>("/social/hub/" + kind + "/" + id + "/member", {
      offset,
    }),
    manager = ["owner", "admin", "moderator"].includes(
      String(q.data?.viewerRole)
    ),
    people = useSocialQuery<SocialPage<SocialPerson>>(
      "/social/people",
      {},
      manager && kind === "community"
    )
  async function act(targetId: string, action: string) {
    setBusy(true)
    try {
      await socialMutation("/social/hub/" + kind + "/" + id + "/member", {
        targetId,
        action,
      })
      await q.refetch()
    } catch (e) {
      toast.add({
        type: "error",
        description:
          e instanceof Error ? e.message : "Unable to update membership",
      })
    } finally {
      setBusy(false)
    }
  }
  if (q.isError) return null
  return (
    <Card>
      <CardHeader>
        <CardTitle>Members</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {q.data?.data.map((m) => (
          <div key={m.id} className="flex flex-wrap items-center gap-2">
            <NavIdentity
              user={{ name: m.name, avatar: m.image }}
              description={m.role}
            />
            {manager && m.role !== "owner" && (
              <>
                <Button
                  disabled={busy}
                  variant="ghost"
                  onClick={() => void act(m.id, "remove")}
                >
                  Remove
                </Button>
                {q.data?.viewerRole === "owner" && (
                  <>
                    <Button
                      disabled={busy}
                      variant="ghost"
                      onClick={() =>
                        void act(
                          m.id,
                          m.role === "moderator" ? "demote" : "promote"
                        )
                      }
                    >
                      {m.role === "moderator" ? "Demote" : "Make moderator"}
                    </Button>
                    {m.id !== user?.id && (
                      <Button
                        disabled={busy}
                        variant="ghost"
                        onClick={() => {
                          if (
                            window.confirm(
                              "Transfer ownership to " + m.name + "?"
                            )
                          )
                            void act(m.id, "transfer")
                        }}
                      >
                        Transfer ownership
                      </Button>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        ))}
        {manager &&
          q.data?.requests.map((m) => (
            <div key={m.id} className="flex items-center gap-2">
              <NavIdentity
                user={{ name: m.name, avatar: m.image }}
                description="Requested to join"
              />
              <Button disabled={busy} onClick={() => void act(m.id, "approve")}>
                Approve
              </Button>
            </div>
          ))}
        {manager && kind === "community" && (
          <div className="flex gap-2">
            <select
              aria-label="Add community member"
              className="h-9 rounded-md border bg-background px-2"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
            >
              <option value="">Choose a person</option>
              {people.data?.data.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <Button
              disabled={busy || !target}
              onClick={() => void act(target, "approve")}
            >
              Add member
            </Button>
          </div>
        )}
        <div className="flex gap-2">
          <Button
            disabled={!offset}
            variant="outline"
            onClick={() => setOffset((v) => Math.max(0, v - 20))}
          >
            Previous
          </Button>
          <Button
            disabled={
              !q.data?.pagination?.hasMore && q.data?.requests.length !== 20
            }
            variant="outline"
            onClick={() => setOffset((v) => v + 20)}
          >
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
