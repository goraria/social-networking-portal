"use client"
import { useState } from "react"
import Link from "next/link"
import { NavIdentity } from "@gorth-com/primitive/dashboard/nav-user"
import { Button } from "@gorth-com/primitive/custom/button"
import { Input } from "@gorth-com/primitive/default/input"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@gorth-com/primitive/default/card"
import { Spinner } from "@gorth-com/primitive/pattern/spinner"
import { toast } from "@gorth-com/primitive/custom/toast"
import { PostTimeline } from "@/features/post"
import { HubEditor } from "@/components/social/hub-editor"
import { HubMembers } from "@/components/social/hub-members"
import { StoryCard } from "@/components/social/story-card"
import { GroupQueue, FeedDetail } from "@/components/social/group-tools"
import { ContentComposer } from "@/components/social/content-composer"
import { useUser } from "@/hooks/use-user"
import {
  useSocialQuery,
  socialMutation,
  type SocialPage,
  type SocialPerson,
  type SocialHub,
  type SocialStory,
} from "@/queries/social"
import { sections, type Section } from "./data"
export function Discover({ section, id }: { section: Section; id?: string }) {
  if (section === "posts" || section === "reels")
    return <PostTimeline postId={id} reel={section === "reels"} />
  if (section === "friends") return <PeopleDirectory />
  if (section === "stories") return <Stories storyId={id} />
  return <Hubs section={section} id={id} />
}
export function PeopleDirectory() {
  const { user } = useUser(),
    [q, setQ] = useState(""),
    [offset, setOffset] = useState(0),
    [busy, setBusy] = useState(false),
    query = useSocialQuery<SocialPage<SocialPerson>>(
      "/social/people",
      { q, offset },
      !!user
    )
  async function act(targetId: string, action: string) {
    setBusy(true)
    try {
      await socialMutation("/social/relationship", { targetId, action })
      await query.refetch()
    } catch (e) {
      toast.add({
        type: "error",
        description:
          e instanceof Error ? e.message : "Unable to update relationship",
      })
    } finally {
      setBusy(false)
    }
  }
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">People</h1>
      <Input
        placeholder="Search people…"
        value={q}
        onChange={(e) => {
          setQ(e.target.value)
          setOffset(0)
        }}
      />
      {query.isLoading ? (
        <Spinner variant="infinite" size={24} />
      ) : query.isError ? (
        <p role="alert">
          Unable to load people.{" "}
          <Button onClick={() => void query.refetch()}>Retry</Button>
        </p>
      ) : !query.data?.data.length ? (
        <p>No people found.</p>
      ) : (
        query.data.data.map((p) => (
          <Card key={p.id}>
            <CardContent className="flex flex-wrap items-center gap-2 pt-4">
              <NavIdentity
                user={{ name: p.name, avatar: p.image }}
                description={p.handle ? "@" + p.handle : undefined}
                url={p.handle ? "/profile/" + p.handle : undefined}
              />
              <Button
                disabled={busy}
                variant="outline"
                onClick={() =>
                  void act(
                    p.id,
                    p.following || p.followStatus === "pending"
                      ? "unfollow"
                      : "follow"
                  )
                }
              >
                {p.following
                  ? "Unfollow"
                  : p.followStatus === "pending"
                    ? "Cancel follow request"
                    : "Follow"}
              </Button>
              {p.followRequest && (
                <>
                  <Button
                    disabled={busy}
                    onClick={() => void act(p.id, "accept-follow")}
                  >
                    Accept follow
                  </Button>
                  <Button
                    disabled={busy}
                    variant="outline"
                    onClick={() => void act(p.id, "reject-follow")}
                  >
                    Reject follow
                  </Button>
                </>
              )}
              {p.friendship?.status === "accepted" ? (
                <Button
                  disabled={busy}
                  variant="outline"
                  onClick={() => void act(p.id, "unfriend")}
                >
                  Unfriend
                </Button>
              ) : p.friendship?.status === "pending" &&
                p.friendship.requesterId !== user?.id ? (
                <>
                  <Button
                    disabled={busy}
                    onClick={() => void act(p.id, "accept")}
                  >
                    Accept
                  </Button>
                  <Button
                    disabled={busy}
                    variant="outline"
                    onClick={() => void act(p.id, "reject")}
                  >
                    Reject
                  </Button>
                </>
              ) : (
                <Button
                  disabled={busy || p.friendship?.status === "pending"}
                  onClick={() => void act(p.id, "request")}
                >
                  {p.friendship?.status === "pending"
                    ? "Requested"
                    : "Add friend"}
                </Button>
              )}
              <Button
                disabled={busy}
                variant="ghost"
                onClick={() => void act(p.id, p.blocked ? "unblock" : "block")}
              >
                {p.blocked ? "Unblock" : "Block"}
              </Button>
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
function Hubs({
  section,
  id,
}: {
  section: Exclude<Section, "posts" | "reels" | "friends" | "stories">
  id?: string
}) {
  const { user } = useUser()
  const kind = (
      {
        groups: "group",
        communities: "community",
        pages: "page",
        events: "event",
        topics: "topic",
        feeds: "feed",
      } as const
    )[section],
    [q, setQ] = useState(""),
    [offset, setOffset] = useState(0),
    [name, setName] = useState(""),
    [description, setDescription] = useState(""),
    [startsAt, setStartsAt] = useState(""),
    [visibility, setVisibility] = useState("public"),
    [busy, setBusy] = useState(false)
  const query = useSocialQuery<SocialPage<SocialHub>>(
    "/social/hub/" + kind + (id ? "/" + id : ""),
    { q, offset }
  )
  async function act(path: string, body: unknown) {
    setBusy(true)
    try {
      const result = await socialMutation<{ pending?: boolean }>(path, body)
      if (result.pending)
        toast.add({ type: "success", description: "Join request sent" })
      await query.refetch()
      setName("")
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
      <h1 className="text-2xl font-bold">{sections[section]}</h1>
      <Input
        placeholder="Search…"
        value={q}
        onChange={(e) => {
          setQ(e.target.value)
          setOffset(0)
        }}
      />
      {!id && kind !== "topic" && (
        <Card>
          <CardContent className="space-y-2 pt-4">
            <Input
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            {kind !== "page" && kind !== "feed" && (
              <select
                aria-label="Visibility"
                className="h-9 rounded-md border bg-background px-2"
                value={visibility}
                onChange={(e) => setVisibility(e.target.value)}
              >
                <option>public</option>
                <option>private</option>
              </select>
            )}
            {kind === "event" && (
              <Input
                aria-label="Event start"
                type="datetime-local"
                value={startsAt}
                onChange={(e) => setStartsAt(e.target.value)}
              />
            )}
            <Button
              disabled={busy || !name.trim()}
              onClick={() =>
                void act("/social/hub", {
                  kind,
                  name,
                  description,
                  visibility,
                  ...(startsAt
                    ? { startsAt: new Date(startsAt).toISOString() }
                    : {}),
                })
              }
            >
              Create
            </Button>
          </CardContent>
        </Card>
      )}
      {query.isLoading ? (
        <Spinner variant="infinite" size={24} />
      ) : query.isError ? (
        <p role="alert">
          Unable to load.{" "}
          <Button onClick={() => void query.refetch()}>Retry</Button>
        </p>
      ) : !query.data?.data.length ? (
        <div>
          <p>No results or this item is private.</p>
          {id && kind === "group" && (
            <Button
              disabled={busy}
              onClick={() =>
                void act("/social/hub/group/" + id + "/member", {
                  action: "join",
                })
              }
            >
              Request to join
            </Button>
          )}
        </div>
      ) : (
        query.data.data.map((h) => (
          <Card key={h.id}>
            <CardHeader>
              <CardTitle>
                <Link
                  href={
                    "/" +
                    (
                      {
                        groups: "group",
                        communities: "community",
                        pages: "page",
                        events: "event",
                        topics: "topic",
                        feeds: "feed",
                      } as const
                    )[section] +
                    "/" +
                    h.id
                  }
                >
                  {h.name}
                </Link>
              </CardTitle>
              <CardDescription>{h.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {h.startsAt && (
                <p>
                  {new Date(h.startsAt).toLocaleString()}{" "}
                  {h.cancelledAt ? "· Cancelled" : ""}
                </p>
              )}
              {kind !== "topic" && kind !== "feed" && (
                <div className="flex flex-wrap gap-2">
                  {(kind === "event"
                    ? [
                        "going",
                        "interested",
                        "declined",
                        ...(h.ownerId === user?.id ? ["cancel"] : []),
                      ]
                    : [h.joined ? "leave" : "join"]
                  ).map((action) => (
                    <Button
                      key={action}
                      disabled={busy}
                      variant="outline"
                      onClick={() =>
                        void act(
                          "/social/hub/" + kind + "/" + h.id + "/member",
                          { action }
                        )
                      }
                    >
                      {action}
                    </Button>
                  ))}
                </div>
              )}
              {kind !== "topic" && kind !== "feed" && (
                <HubEditor
                  kind={kind}
                  hub={h}
                  onChange={() => void query.refetch()}
                />
              )}
            </CardContent>
          </Card>
        ))
      )}
      {id && kind === "group" && (
        <>
          <GroupQueue id={id} />
          <PostTimeline groupId={id} />
        </>
      )}
      {id && (kind === "group" || kind === "community") && (
        <HubMembers kind={kind} id={id} />
      )}
      {id && kind === "community" && <PostTimeline communityId={id} />}
      {id && kind === "feed" && <FeedDetail id={id} />}{" "}
      {!id && (
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
      )}
    </section>
  )
}
function Stories({ storyId }: { storyId?: string }) {
  const [offset, setOffset] = useState(0),
    query = useSocialQuery<SocialPage<SocialStory>>("/social/story", {
      offset,
      limit: 20,
      ...(storyId ? { id: storyId } : {}),
    })
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Stories</h1>
      <ContentComposer story onChange={() => void query.refetch()} />
      {query.isLoading ? (
        <Spinner variant="infinite" size={24} />
      ) : query.isError ? (
        <p role="alert">Unable to load stories.</p>
      ) : !query.data?.data.length ? (
        <p>No active stories.</p>
      ) : (
        query.data.data
          .filter((s) => !storyId || s.id === storyId)
          .map((s) => (
            <StoryCard
              key={s.id}
              story={s}
              onChange={() => void query.refetch()}
            />
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
