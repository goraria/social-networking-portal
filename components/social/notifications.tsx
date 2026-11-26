"use client"
import { useState } from "react"
import { Button } from "@gorth-com/primitive/custom/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@gorth-com/primitive/default/card"
import {
  useSocialQuery,
  socialMutation,
  type SocialPage,
} from "@/queries/social"
interface Item {
  id: string
  title: string
  body: string
  readAt: string | null
  createdAt: string
}
export function Notifications() {
  const [offset, setOffset] = useState(0),
    query = useSocialQuery<SocialPage<Item>>("/notification", {
      limit: 20,
      offset,
    })
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Notifications</h1>
      {query.isLoading ? (
        <p>Loading…</p>
      ) : query.isError ? (
        <p role="alert">
          Notification service unavailable.{" "}
          <Button onClick={() => void query.refetch()}>Retry</Button>
        </p>
      ) : !query.data?.data.length ? (
        <p>No notifications.</p>
      ) : (
        query.data.data.map((n) => (
          <Card key={n.id}>
            <CardHeader>
              <CardTitle>{n.title}</CardTitle>
              <CardDescription>
                {new Date(n.createdAt).toLocaleString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {n.body}
              {!n.readAt && (
                <Button
                  variant="ghost"
                  onClick={() =>
                    void socialMutation(
                      "/notification/read?id=" + n.id,
                      {},
                      "PATCH"
                    ).then(() => query.refetch())
                  }
                >
                  Mark read
                </Button>
              )}
            </CardContent>
          </Card>
        ))
      )}
      <div className="flex gap-2">
        <Button
          disabled={!offset}
          onClick={() => setOffset((v) => Math.max(0, v - 20))}
        >
          Previous
        </Button>
        <Button
          disabled={(query.data?.data.length ?? 0) < 20}
          onClick={() => setOffset((v) => v + 20)}
        >
          Next
        </Button>
      </div>
    </section>
  )
}
