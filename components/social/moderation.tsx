"use client"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@gorth-com/primitive/custom/button"
import { Textarea } from "@gorth-com/primitive/default/textarea"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@gorth-com/primitive/default/card"
import { toast } from "@gorth-com/primitive/custom/toast"
import { useUser } from "@/hooks/use-user"
import {
  useSocialQuery,
  socialMutation,
  type SocialPage,
  type SocialPerson,
} from "@/queries/social"
interface Report {
  id: string
  resourceId: string
  reason: string
  details: string
  status: string
}
interface Enforcement {
  id: string
  resourceId: string
  reason: string
  type: string
  revokedAt: string | null
  expiresAt: string | null
}
interface Appeal {
  id: string
  reason: string
  status: string
}
export function Moderation() {
  const { user } = useUser(),
    [offset, setOffset] = useState(0),
    [reason, setReason] = useState(""),
    [target, setTarget] = useState(""),
    [kind, setKind] = useState("warning"),
    [busy, setBusy] = useState(false),
    reports = useSocialQuery<SocialPage<Report>>("/insight/moderation/report", {
      limit: 20,
      offset,
    }),
    mine = useSocialQuery<SocialPage<Enforcement>>("/insight/enforcement/me", {
      limit: 20,
      offset,
    }),
    appeals = useSocialQuery<SocialPage<Appeal>>(
      "/insight/appeal",
      { limit: 20, offset },
      reports.isSuccess
    ),
    people = useSocialQuery<SocialPage<SocialPerson>>(
      "/social/people",
      {},
      ["admin", "master"].includes(String(user?.role))
    )
  async function act(
    path: string,
    body: unknown,
    method: "POST" | "PATCH" = "POST"
  ) {
    setBusy(true)
    try {
      await socialMutation(path, body, method)
      await Promise.all([reports.refetch(), mine.refetch(), appeals.refetch()])
      toast.add({ type: "success", description: "Saved" })
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
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Safety and appeals</h1>
      <Textarea
        aria-label="Decision or appeal reason"
        placeholder="Explain your decision or appeal…"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        maxLength={2000}
      />
      <Card>
        <CardHeader>
          <CardTitle>Your restrictions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {mine.isError ? (
            <p>
              Unable to load restrictions.{" "}
              <Button onClick={() => void mine.refetch()}>Retry</Button>
            </p>
          ) : !mine.data?.data.length ? (
            <p>No restrictions to show.</p>
          ) : (
            mine.data.data.map((e) => (
              <div key={e.id} className="space-y-2 border-b pb-3">
                <p>
                  {e.type} · {e.reason}
                </p>
                <p className="text-sm text-muted-foreground">
                  {e.revokedAt
                    ? "Revoked"
                    : e.expiresAt
                      ? "Expires " + new Date(e.expiresAt).toLocaleString()
                      : "No expiration"}
                </p>
                <Button
                  variant="outline"
                  disabled={busy || !reason.trim() || !!e.revokedAt}
                  onClick={() =>
                    void act("/insight/enforcement/" + e.id + "/appeal", {
                      reason,
                    })
                  }
                >
                  Appeal
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>
      {reports.isSuccess && (
        <>
          <h2 className="text-xl font-semibold">Moderation queue</h2>
          {!reports.data?.data.length && <p>No reports.</p>}
          {reports.data?.data.map((r) => (
            <Card key={r.id}>
              <CardHeader>
                <CardTitle>
                  {r.reason} · {r.status}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>{r.details}</p>
                <Link href={"/post/" + r.resourceId}>View reported post</Link>
                <div className="flex flex-wrap gap-2">
                  {["reviewing", "resolved", "dismissed"].map((status) => (
                    <Button
                      key={status}
                      variant="outline"
                      disabled={busy || !reason.trim()}
                      onClick={() =>
                        void act(
                          "/insight/moderation/report/" + r.id,
                          { status, decision: reason },
                          "PATCH"
                        )
                      }
                    >
                      {status}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    disabled={busy || !reason.trim()}
                    onClick={() => {
                      if (window.confirm("Remove this reported content?"))
                        void act("/insight/enforcement", {
                          resourceType: "post",
                          resourceId: r.resourceId,
                          type: "content_removal",
                          reason,
                        })
                    }}
                  >
                    Remove content
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          <h2 className="text-xl font-semibold">Appeal queue</h2>
          {appeals.data?.data.map((a) => (
            <Card key={a.id}>
              <CardContent className="space-y-2 pt-4">
                <p>
                  {a.reason} · {a.status}
                </p>
                {a.status === "pending" &&
                  [true, false].map((accepted) => (
                    <Button
                      key={String(accepted)}
                      variant="outline"
                      disabled={busy || !reason.trim()}
                      onClick={() =>
                        void act(
                          "/insight/appeal/" + a.id,
                          { accepted, resolution: reason },
                          "PATCH"
                        )
                      }
                    >
                      {accepted ? "Accept appeal" : "Reject appeal"}
                    </Button>
                  ))}
              </CardContent>
            </Card>
          ))}
        </>
      )}
      {reports.isSuccess &&
        ["admin", "master"].includes(String(user?.role)) && (
          <Card>
            <CardHeader>
              <CardTitle>Account restrictions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <select
                aria-label="Account"
                className="h-9 rounded-md border bg-background px-2"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
              >
                <option value="">Choose an account</option>
                {people.data?.data.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              <select
                aria-label="Restriction type"
                className="h-9 rounded-md border bg-background px-2"
                value={kind}
                onChange={(e) => setKind(e.target.value)}
              >
                {["warning", "feature_restriction", "suspension", "ban"].map(
                  (k) => (
                    <option key={k}>{k}</option>
                  )
                )}
              </select>
              <Button
                disabled={busy || !target || !reason.trim()}
                onClick={() => {
                  if (window.confirm("Apply this account restriction?"))
                    void act("/social/moderation/restriction", {
                      targetId: target,
                      type: kind,
                      reason,
                    })
                }}
              >
                Apply restriction
              </Button>
            </CardContent>
          </Card>
        )}
      <div className="flex gap-2">
        <Button
          disabled={!offset}
          onClick={() => setOffset((v) => Math.max(0, v - 20))}
        >
          Previous
        </Button>
        <Button
          disabled={
            (reports.isSuccess
              ? reports.data?.data.length
              : mine.data?.data.length) !== 20
          }
          onClick={() => setOffset((v) => v + 20)}
        >
          Next
        </Button>
      </div>
    </section>
  )
}
