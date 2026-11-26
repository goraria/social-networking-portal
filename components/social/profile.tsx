"use client"
import { useState } from "react"
import { NavProfile } from "@gorth-com/primitive/dashboard/nav-user"
import { Button } from "@gorth-com/primitive/custom/button"
import { Input } from "@gorth-com/primitive/default/input"
import { Textarea } from "@gorth-com/primitive/default/textarea"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@gorth-com/primitive/default/card"
import { Spinner } from "@gorth-com/primitive/pattern/spinner"
import { toast } from "@gorth-com/primitive/custom/toast"
import { PostTimeline } from "@/features/post"
import {
  useSocialQuery,
  socialMutation,
  type SocialIdentity,
} from "@/queries/social"
import { useUser } from "@/hooks/use-user"
import { chatUrl } from "@/utils/environment"
export function Profile({ handle }: { handle?: string }) {
  const { user } = useUser(),
    query = useSocialQuery<{ data: SocialIdentity | null }>(
      handle ? "/social/identity/" + encodeURIComponent(handle) : "/social/me",
      {},
      !!user
    ),
    [editing, setEditing] = useState(false)
  if (query.isLoading) return <Spinner variant="infinite" size={24} />
  if (query.isError)
    return (
      <p role="alert">
        Profile unavailable.{" "}
        <Button onClick={() => void query.refetch()}>Retry</Button>
      </p>
    )
  const p = query.data?.data
  if (!p || editing)
    return (
      <ProfileEditor
        profile={p ?? undefined}
        onSave={() => {
          setEditing(false)
          void query.refetch()
        }}
      />
    )
  const mine = p.id === user?.id
  return (
    <section className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center gap-6">
            <NavProfile
              user={{ name: p.name, avatar: p.image }}
              className="size-32 rounded-[calc(var(--radius)*1.8+4px)] border-4 border-background"
            />
            <div className="flex-1 space-y-1">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                {p.name}
              </h1>
              <p>
                @{p.handle} · {p.followingCount} following · {p.followerCount}{" "}
                followers
              </p>
              <p className="text-muted-foreground">{p.bio}</p>
            </div>
            {mine ? (
              <Button variant="outline" onClick={() => setEditing(true)}>
                Edit profile
              </Button>
            ) : (
              <>
                <Button
                  onClick={() =>
                    void socialMutation("/social/relationship", {
                      targetId: p.id,
                      action: "follow",
                    })
                      .then(() => query.refetch())
                      .catch((e) =>
                        toast.add({ type: "error", description: String(e) })
                      )
                  }
                >
                  Follow
                </Button>
                {chatUrl && (
                  <Button
                    variant="outline"
                    nativeButton={false}
                    render={<a href={new URL("/chat", chatUrl).href} />}
                  >
                    Open GorCer
                  </Button>
                )}
              </>
            )}
          </div>
        </CardHeader>
      </Card>
      <PostTimeline authorId={p.id} />
    </section>
  )
}
function ProfileEditor({
  profile,
  onSave,
}: {
  profile?: SocialIdentity
  onSave: () => void
}) {
  const [handle, setHandle] = useState(profile?.handle ?? ""),
    [bio, setBio] = useState(profile?.bio ?? ""),
    [website, setWebsite] = useState(profile?.website ?? ""),
    [visibility, setVisibility] = useState(profile?.visibility ?? "public"),
    [busy, setBusy] = useState(false)
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {profile ? "Edit profile" : "Create your profile"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Input
          aria-label="Profile handle"
          placeholder="Account handle"
          readOnly={Boolean(profile)}
          value={handle}
          onChange={(e) => setHandle(e.target.value)}
        />
        {profile && (
          <p className="text-sm text-muted-foreground">
            Your account handle is managed by Gorth SSO.
          </p>
        )}
        <Textarea
          aria-label="Biography"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          maxLength={1000}
        />
        <Input
          aria-label="Website"
          placeholder="https://…"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
        <select
          aria-label="Profile visibility"
          className="h-9 rounded-md border bg-background px-2"
          value={visibility}
          onChange={(e) => setVisibility(e.target.value)}
        >
          {["public", "followers", "friends", "private"].map((v) => (
            <option key={v}>{v}</option>
          ))}
        </select>
        <Button
          disabled={busy}
          onClick={async () => {
            setBusy(true)
            try {
              await socialMutation(
                "/social/me",
                { handle, bio, website, visibility },
                "PUT"
              )
              onSave()
            } catch (e) {
              toast.add({
                type: "error",
                description: e instanceof Error ? e.message : "Unable to save",
              })
            } finally {
              setBusy(false)
            }
          }}
        >
          Save
        </Button>
      </CardContent>
    </Card>
  )
}
