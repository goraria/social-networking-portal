"use client"
/* eslint-disable @next/next/no-img-element -- Private media requires the current account's same-origin cookies. */
import { useState } from "react"
import { Button } from "@gorth-com/primitive/custom/button"
import { Input } from "@gorth-com/primitive/default/input"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@gorth-com/primitive/default/card"
import { toast } from "@gorth-com/primitive/custom/toast"
import { useUser } from "@/hooks/use-user"
import { socialMutation, type SocialStory } from "@/queries/social"
export function StoryCard({
  story,
  onChange,
}: {
  story: SocialStory
  onChange: () => void
}) {
  const { user } = useUser(),
    [editing, setEditing] = useState(false),
    [caption, setCaption] = useState(story.caption ?? ""),
    [visibility, setVisibility] = useState(story.visibility),
    [busy, setBusy] = useState(false)
  async function change(remove = false) {
    setBusy(true)
    try {
      await socialMutation(
        "/social/story/" + story.id,
        remove ? {} : { caption, visibility },
        remove ? "DELETE" : "PATCH"
      )
      setEditing(false)
      onChange()
    } catch (e) {
      toast.add({
        type: "error",
        description: e instanceof Error ? e.message : "Unable to save story",
      })
    } finally {
      setBusy(false)
    }
  }
  const viewed = () =>
    void socialMutation("/social/story/" + story.id + "/view").catch(
      () => undefined
    )
  return (
    <Card>
      <CardHeader>
        <CardTitle>{story.name}</CardTitle>
        <CardDescription>
          {story.caption} · expires {new Date(story.expiresAt).toLocaleString()}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {story.mediaType === "video" ? (
          <video
            src={story.mediaUrl}
            controls
            className="max-h-96 rounded-lg"
            onLoadedMetadata={viewed}
          />
        ) : (
          <img
            src={story.mediaUrl}
            alt={story.caption}
            className="max-h-96 rounded-lg"
            onLoad={viewed}
          />
        )}{" "}
        {user?.id === story.authorId && (
          <>
            {editing && (
              <>
                <Input
                  aria-label="Story caption"
                  value={caption}
                  maxLength={2000}
                  onChange={(e) => setCaption(e.target.value)}
                />
                <select
                  aria-label="Story visibility"
                  className="h-9 rounded-md border bg-background px-2"
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value)}
                >
                  {["public", "followers", "friends", "private"].map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
                <Button disabled={busy} onClick={() => void change()}>
                  Save
                </Button>
              </>
            )}
            <Button
              disabled={busy}
              variant="outline"
              onClick={() => setEditing((v) => !v)}
            >
              {editing ? "Cancel" : "Edit story"}
            </Button>
            <Button
              disabled={busy}
              variant="outline"
              onClick={() => {
                if (window.confirm("Delete this story?")) void change(true)
              }}
            >
              Delete story
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}
