"use client"
import { useState } from "react"
import { Button } from "@gorth-com/primitive/custom/button"
import { Input } from "@gorth-com/primitive/default/input"
import { Checkbox } from "@gorth-com/primitive/default/checkbox"
import { toast } from "@gorth-com/primitive/custom/toast"
import { useUser } from "@/hooks/use-user"
import {
  socialMutation,
  useSocialQuery,
  type SocialHub,
  type SocialPerson,
  type SocialPage,
} from "@/queries/social"
export function HubEditor({
  kind,
  hub,
  onChange,
}: {
  kind: "group" | "community" | "page" | "event"
  hub: SocialHub
  onChange: () => void
}) {
  const { user } = useUser(),
    [open, setOpen] = useState(false),
    [name, setName] = useState(hub.name),
    [description, setDescription] = useState(hub.description ?? ""),
    [visibility, setVisibility] = useState<string>(hub.visibility ?? "public"),
    [approval, setApproval] = useState(Boolean(hub.requiresPostApproval)),
    [busy, setBusy] = useState(false),
    [target, setTarget] = useState(""),
    [peopleQuery, setPeopleQuery] = useState("")
  const people = useSocialQuery<SocialPage<SocialPerson>>(
    "/social/people",
    { q: peopleQuery },
    kind === "event" && hub.ownerId === user?.id && open
  )
  async function invite() {
    setBusy(true)
    try {
      await socialMutation("/social/hub/event/" + hub.id + "/member", {
        action: "invite",
        targetId: target,
      })
      setTarget("")
      toast.add({ type: "success", description: "Invitation sent" })
    } catch (e) {
      toast.add({
        type: "error",
        description: e instanceof Error ? e.message : "Unable to invite",
      })
    } finally {
      setBusy(false)
    }
  }
  if (hub.ownerId !== user?.id) return null
  async function change(remove = false) {
    setBusy(true)
    try {
      await socialMutation(
        "/social/hub/" + kind + "/" + hub.id,
        remove
          ? {}
          : {
              name,
              description,
              ...(kind === "page" ? {} : { visibility }),
              ...(kind === "group" ? { requiresPostApproval: approval } : {}),
            },
        remove ? "DELETE" : "PATCH"
      )
      setOpen(false)
      onChange()
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
    <div className="space-y-2 border-t pt-3">
      <Button variant="outline" onClick={() => setOpen((v) => !v)}>
        Manage {kind}
      </Button>
      {open && (
        <>
          <Input
            aria-label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={120}
          />
          <Input
            aria-label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={2000}
          />
          {kind !== "page" && (
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
          {kind === "group" && (
            <label className="flex items-center gap-2">
              <Checkbox
                checked={approval}
                onCheckedChange={(v) => setApproval(v === true)}
              />
              Require approval for new posts
            </label>
          )}
          <div className="flex gap-2">
            <Button
              disabled={busy || !name.trim()}
              onClick={() => void change()}
            >
              Save
            </Button>
            <Button
              variant="outline"
              disabled={busy}
              onClick={() => {
                if (
                  window.confirm(
                    kind === "event"
                      ? "Cancel this event?"
                      : "Delete this " + kind + "?"
                  )
                )
                  void change(true)
              }}
            >
              {kind === "event" ? "Cancel event" : "Delete " + kind}
            </Button>
          </div>
          {kind === "event" && !hub.cancelledAt && (
            <div className="space-y-2">
              <Input
                aria-label="Search people to invite"
                placeholder="Search people to invite…"
                value={peopleQuery}
                onChange={(e) => setPeopleQuery(e.target.value)}
              />
              <select
                aria-label="Invite to event"
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
              <Button disabled={busy || !target} onClick={() => void invite()}>
                Invite
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
