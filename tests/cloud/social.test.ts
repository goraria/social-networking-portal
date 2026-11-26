import { beforeAll, afterAll, expect, it, vi } from "vitest"
import { sql } from "drizzle-orm"
const external = vi.hoisted(() => ({ asset: vi.fn(), platform: vi.fn() }))
vi.mock("@/services/social-media", async (original) => ({
  ...(await original<typeof import("@/services/social-media")>()),
  rawInspectSocialAsset: external.asset,
}))
vi.mock("@/services/social-platform", () => ({
  rawSocialPlatformRequest: external.platform,
}))
import { getDatabase } from "@/database"
import { rawSocialRows, rawCheckPostAccess, rawCheckInteraction, rawCheckStoryAccess, rawDeniedSocialSubjects } from "@/models/index"
import {
  rawCreateSocialPost,
  rawUpdateSocialPost,
  rawDeleteSocialPost,
  rawListSocialPosts,
  rawHideSocialPost,
  rawCreateSocialStory,
  rawListSocialStories,
  rawViewSocialStory,
} from "@/models/post"
import {
  rawChangeSocialRelationship,
  rawSocialProfile,
  rawSaveSocialProfile,
} from "@/models/follow"
import {
  rawCreateSocialHub,
  rawChangeSocialMembership,
  rawListSocialHubs,
} from "@/services/social-hubs"
import {
  rawGroupReviewQueue,
  rawModerateGroupPost,
  rawSaveFeedSources,
  rawGetFeedSources,
} from "@/models/group"
import { rawDispatchSocialEvents } from "@/models/outbox-event"
import { rawChangeSocialStory } from "@/models/story"
import { rawChangeSocialHub } from "@/services/social-hub-management"
import { rawListSocialMembers } from "@/services/social-members"
import { socialPostSchema } from "@/schemas/social-client"
const ids = Array.from({ length: 6 }, () => crypto.randomUUID()),
  actors = ids.map((userId) => ({ userId, isAdmin: false })),
  prefix = "cloud-social-" + crypto.randomUUID(),
  hubs: { kind: string; id: string }[] = [],
  created: string[] = []
let authBefore: unknown
it("uses live moderation decisions for removed content and restricted actors", async () => {
  const p = await post(2)
  external.platform.mockResolvedValueOnce({
    removedResourceIds: [p.id],
    restrictedSubjects: [],
  })
  await expect(rawCheckPostAccess(String(p.id), ids[2])).rejects.toMatchObject({
    status: 404,
  })
  external.platform.mockResolvedValueOnce({
    removedResourceIds: [],
    restrictedSubjects: [prefix + 2],
  })
  await expect(post(2)).rejects.toMatchObject({ status: 403 })
})
it("persists personal feed sources and enforces ownership", async () => {
  const feed = await rawCreateSocialHub(actors[0], {
    kind: "feed",
    name: "Cloud personal feed",
    description: "",
    visibility: "private",
    requiresPostApproval: false,
  })
  await rawSaveFeedSources(actors[0], String(feed.id), [ids[1]])
  expect(await rawGetFeedSources(actors[0], String(feed.id))).toEqual({
    userIds: [ids[1]],
  })
  await expect(
    rawSaveFeedSources(actors[1], String(feed.id), [])
  ).rejects.toMatchObject({ status: 403 })
  const included = await post(1),
    excluded = await post(0)
  const items = await rawListSocialPosts(actors[0], { feedId: String(feed.id) })
  expect(items.data.map((p) => p.id)).toContain(included.id)
  expect(items.data.map((p) => p.id)).not.toContain(excluded.id)
  expect(items.data.every((p) => p.authorId === ids[1])).toBe(true)
})
const authMetadata = sql`SELECT table_name,column_name,data_type,is_nullable,column_default FROM information_schema.columns WHERE table_schema='public' AND table_name IN('user','session','account','verification','proof','revocation','rate_limit') ORDER BY table_name,ordinal_position`
beforeAll(async () => {
  external.platform.mockResolvedValue({
    data: [],
    removedResourceIds: [],
    restrictedSubjects: [],
  })
  authBefore = await rawSocialRows(authMetadata)
  for (let n = 0; n < ids.length; n++) {
    await getDatabase().execute(
      sql`INSERT INTO "user"(id,external_user_id,email,name) VALUES(${ids[n]}::uuid,${prefix + n},${prefix + n + "@example.invalid"},${"Cloud user " + n})`
    )
    await rawSaveSocialProfile(actors[n], {
      handle: "cloud_" + ids[n].replaceAll("-", "").slice(0, 20),
      bio: "",
      website: "",
      location: "",
      visibility: "public",
    })
  }
  external.asset.mockImplementation(async (id: string) => ({
    id,
    filename: "photo.png",
    contentType: "image/png",
    size: 100,
  }))
  external.platform.mockResolvedValue({
    data: [],
    removedResourceIds: [],
    restrictedSubjects: [],
  })
})
afterAll(async () => {
  try {
    for (const h of hubs) {
      const owner =
        h.kind === "event"
          ? undefined
          : (
              await rawSocialRows(
                sql`SELECT actor_id FROM ${sql.identifier(h.kind)} WHERE id=${h.id}::uuid`
              )
            )[0]
      if (h.kind === "group" || h.kind === "community" || h.kind === "page")
        await getDatabase().execute(
          sql`DELETE FROM ${sql.identifier(h.kind)} WHERE id=${h.id}::uuid`
        )
      if (h.kind === "event")
        await getDatabase().execute(
          sql`DELETE FROM event WHERE id=${h.id}::uuid`
        )
      if (owner?.actor_id)
        await getDatabase().execute(
          sql`DELETE FROM actor WHERE id=${owner.actor_id}::uuid`
        )
    }
    for (const id of ids) {
      await getDatabase().execute(
        sql`DELETE FROM outbox_event WHERE payload->>'actorId'=${id}`
      )
      await getDatabase().execute(sql`DELETE FROM "user" WHERE id=${id}::uuid`)
    }
    expect(await rawSocialRows(authMetadata)).toEqual(authBefore)
  } finally {
    await getDatabase().$client.end()
  }
})
async function post(n = 0, extra: Record<string, unknown> = {}) {
  const p = await rawCreateSocialPost(actors[n], prefix + n, {
    type: "standard",
    content: "Cloud post " + crypto.randomUUID(),
    clientRequestId: crypto.randomUUID(),
    ...extra,
  })
  created.push(String(p.id))
  return p
}
it("serializes real rows to the browser post contract without Faker", async () => {
  const p = await post()
  expect(socialPostSchema.parse(p).author.name).toBe("Cloud user 0")
})
it("denies private posts to unrelated users at detail and list", async () => {
  const p = await post(0, { visibility: "private" })
  await expect(rawCheckPostAccess(String(p.id), ids[2])).rejects.toMatchObject({
    status: 404,
  })
  expect(
    (await rawListSocialPosts(actors[2])).data.map((p) => p.id)
  ).not.toContain(p.id)
})
it("requires accepted following and immediately revokes after unfollow", async () => {
  const p = await post(1, { visibility: "followers" })
  await expect(rawCheckPostAccess(String(p.id), ids[2])).rejects.toMatchObject({
    status: 404,
  })
  await rawChangeSocialRelationship(actors[2], {
    targetId: ids[1],
    action: "follow",
  })
  await expect(rawCheckPostAccess(String(p.id), ids[2])).resolves.toBeTruthy()
  await rawChangeSocialRelationship(actors[2], {
    targetId: ids[1],
    action: "unfollow",
  })
  await expect(rawCheckPostAccess(String(p.id), ids[2])).rejects.toMatchObject({
    status: 404,
  })
})
it("only the addressee can accept a pending friendship", async () => {
  await rawChangeSocialRelationship(actors[0], {
    targetId: ids[1],
    action: "request",
  })
  await expect(
    rawChangeSocialRelationship(actors[0], { targetId: ids[1], action: "accept" })
  ).rejects.toMatchObject({ status: 409 })
  await rawChangeSocialRelationship(actors[1], {
    targetId: ids[0],
    action: "accept",
  })
  const p = await post(0, { visibility: "friends" })
  await expect(rawCheckPostAccess(String(p.id), ids[1])).resolves.toBeTruthy()
  await rawChangeSocialRelationship(actors[1], {
    targetId: ids[0],
    action: "unfriend",
  })
  await expect(rawCheckPostAccess(String(p.id), ids[1])).rejects.toMatchObject({
    status: 404,
  })
})
it("block revokes visibility both ways and removes relationships", async () => {
  const a = await post(2),
    b = await post(3)
  await rawChangeSocialRelationship(actors[2], {
    targetId: ids[3],
    action: "follow",
  })
  await rawChangeSocialRelationship(actors[3], {
    targetId: ids[2],
    action: "block",
  })
  await expect(rawCheckPostAccess(String(a.id), ids[3])).rejects.toMatchObject({
    status: 404,
  })
  await expect(rawCheckPostAccess(String(b.id), ids[2])).rejects.toMatchObject({
    status: 404,
  })
  await expect(
    rawChangeSocialRelationship(actors[2], { targetId: ids[3], action: "unblock" })
  ).resolves.toBeTruthy()
  await expect(rawCheckPostAccess(String(a.id), ids[3])).rejects.toMatchObject({
    status: 404,
  })
  await rawChangeSocialRelationship(actors[3], {
    targetId: ids[2],
    action: "unblock",
  })
})
it("enforces reply and quote policy on direct service requests", async () => {
  const p = await post(3, { replyPolicy: "nobody", quotePolicy: "nobody" })
  await expect(
    rawCheckInteraction(String(p.id), ids[4], "comment")
  ).rejects.toMatchObject({ status: 403 })
  await expect(post(4, { parentPostId: p.id })).rejects.toMatchObject({
    status: 403,
  })
  await expect(post(4, { repostOfId: p.id })).rejects.toMatchObject({
    status: 403,
  })
  await expect(
    rawCheckInteraction(String(p.id), ids[4], "read")
  ).resolves.toBeTruthy()
})
it("deduplicates simultaneous sends and rejects a reused key with another payload", async () => {
  const input = {
      type: "standard",
      content: "Idempotent",
      clientRequestId: crypto.randomUUID(),
    },
    items = await Promise.all([
      rawCreateSocialPost(actors[4], prefix + 4, input),
      rawCreateSocialPost(actors[4], prefix + 4, input),
    ])
  expect(items[0].id).toBe(items[1].id)
  await expect(
    rawCreateSocialPost(actors[4], prefix + 4, { ...input, content: "Changed" })
  ).rejects.toMatchObject({ status: 409 })
})
it("uses optimistic versions and enforces owner edits", async () => {
  const p = await post(4)
  await expect(
    rawUpdateSocialPost(actors[3], String(p.id), { content: "Wrong", version: 1 })
  ).rejects.toMatchObject({ status: 403 })
  const results = await Promise.allSettled([
    rawUpdateSocialPost(actors[4], String(p.id), { content: "One", version: 1 }),
    rawUpdateSocialPost(actors[4], String(p.id), { content: "Two", version: 1 }),
  ])
  expect(results.filter((r) => r.status === "fulfilled")).toHaveLength(1)
  expect(results.filter((r) => r.status === "rejected")).toHaveLength(1)
})
it("soft-deletes content and prevents reading it again", async () => {
  const p = await post(4)
  await rawDeleteSocialPost(actors[4], String(p.id))
  await expect(rawCheckPostAccess(String(p.id), ids[4])).rejects.toMatchObject({
    status: 404,
  })
})
it("filters draft and future scheduled posts out of a normal feed", async () => {
  const draft = await post(5, { status: "draft" }),
    scheduled = await post(5, {
      status: "scheduled",
      scheduledAt: new Date(Date.now() + 3600000).toISOString(),
    })
  const list = await rawListSocialPosts(actors[5])
  expect(list.data.map((p) => p.id)).not.toContain(draft.id)
  expect(list.data.map((p) => p.id)).not.toContain(scheduled.id)
})
it("persists hide and mute decisions without changing other users feeds", async () => {
  const p = await post(5)
  await rawHideSocialPost(actors[4], String(p.id))
  expect(
    (await rawListSocialPosts(actors[4])).data.map((p) => p.id)
  ).not.toContain(p.id)
  await rawChangeSocialRelationship(actors[4], {
    targetId: ids[5],
    action: "mute",
  })
  expect(
    (await rawListSocialPosts(actors[4], { authorId: ids[5] })).data
  ).toHaveLength(0)
  await rawChangeSocialRelationship(actors[4], {
    targetId: ids[5],
    action: "unmute",
  })
})
it("creates a hub with its owner atomically and refuses privilege escalation", async () => {
  const h = await rawCreateSocialHub(actors[0], {
    kind: "group",
    name: "Cloud group",
    description: "",
    visibility: "public",
    requiresPostApproval: true,
  })
  hubs.push({ kind: "group", id: String(h.id) })
  await rawChangeSocialMembership(actors[1], "group", String(h.id), {
    action: "join",
  })
  await expect(
    rawChangeSocialMembership(actors[1], "group", String(h.id), {
      action: "promote",
      targetId: ids[1],
    })
  ).rejects.toMatchObject({ status: 403 })
  const p = await post(1, { groupId: h.id })
  expect(p.status).toBe("draft")
  expect(
    (await rawGroupReviewQueue(actors[0], String(h.id))).data.map((p) => p.id)
  ).toContain(p.id)
  await expect(
    rawModerateGroupPost(actors[1], String(p.id), "approve", 1)
  ).rejects.toMatchObject({ status: 403 })
  await rawModerateGroupPost(actors[0], String(p.id), "approve", 1)
  await rawChangeSocialMembership(actors[0], "group", String(h.id), {
    action: "remove",
    targetId: ids[1],
  })
  await expect(
    rawUpdateSocialPost(actors[1], String(p.id), {
      version: 2,
      content: "removed author",
    })
  ).rejects.toMatchObject({ status: 403 })
  await expect(
    rawChangeSocialMembership(actors[0], "group", String(h.id), {
      action: "leave",
    })
  ).rejects.toMatchObject({ status: 409 })
})
it("persists private group join requests and moderator approval", async () => {
  const h = await rawCreateSocialHub(actors[1], {
    kind: "group",
    name: "Private group",
    description: "",
    visibility: "private",
    requiresPostApproval: false,
  })
  hubs.push({ kind: "group", id: String(h.id) })
  expect(
    (await rawListSocialHubs(actors[2], "group", "", 0, String(h.id))).data
  ).toHaveLength(0)
  expect(
    await rawChangeSocialMembership(actors[2], "group", String(h.id), {
      action: "join",
    })
  ).toMatchObject({ pending: true })
  await rawChangeSocialMembership(actors[1], "group", String(h.id), {
    action: "approve",
    targetId: ids[2],
  })
  expect(
    (await rawListSocialHubs(actors[2], "group", "", 0, String(h.id))).data
  ).toHaveLength(1)
  await rawChangeSocialMembership(actors[2], "group", String(h.id), {
    action: "leave",
  })
  expect(
    (await rawListSocialHubs(actors[2], "group", "", 0, String(h.id))).data
  ).toHaveLength(0)
})
it("persists RSVP and restricts event cancellation to the creator", async () => {
  const e = await rawCreateSocialHub(actors[2], {
    kind: "event",
    name: "Cloud event",
    description: "",
    visibility: "public",
    requiresPostApproval: false,
    startsAt: new Date(Date.now() + 86400000).toISOString(),
  })
  hubs.push({ kind: "event", id: String(e.id) })
  await rawChangeSocialMembership(actors[3], "event", String(e.id), {
    action: "going",
  })
  await expect(
    rawChangeSocialMembership(actors[3], "event", String(e.id), {
      action: "cancel",
    })
  ).rejects.toMatchObject({ status: 403 })
  await rawChangeSocialMembership(actors[2], "event", String(e.id), {
    action: "cancel",
  })
  await expect(
    rawChangeSocialMembership(actors[3], "event", String(e.id), {
      action: "interested",
    })
  ).rejects.toMatchObject({ status: 409 })
})
it("enforces private profile access and server-owned counters", async () => {
  const handle = "private_" + ids[3].slice(0, 8)
  await rawSaveSocialProfile(actors[3], {
    handle,
    bio: "",
    website: "",
    location: "",
    visibility: "private",
  })
  await expect(rawSocialProfile(actors[4], handle)).rejects.toMatchObject({
    status: 404,
  })
  expect(await rawSocialProfile(actors[3], handle)).toMatchObject({
    followerCount: 0,
  })
})
it("binds only validated media and prevents a second post binding", async () => {
  const asset = crypto.randomUUID(),
    p = await post(5, { assetIds: [asset] })
  expect(p.media).toHaveLength(1)
  await expect(post(4, { assetIds: [asset] })).rejects.toThrow()
  external.asset.mockRejectedValueOnce(new Error("foreign asset"))
  await expect(post(3, { assetIds: [crypto.randomUUID()] })).rejects.toThrow(
    "foreign asset"
  )
})
it("expires stories and rejects raw browser-provided media URLs", async () => {
  const s = await rawCreateSocialStory(actors[5], prefix + 5, {
    assetId: crypto.randomUUID(),
    expiresAt: new Date(Date.now() + 60000).toISOString(),
  })
  await rawViewSocialStory(actors[5], String(s.id))
  await expect(
    rawChangeSocialStory(actors[4], String(s.id), { caption: "Wrong" })
  ).rejects.toMatchObject({ status: 403 })
  await rawChangeSocialStory(actors[5], String(s.id), { caption: "Edited story" })
  expect((await rawCheckStoryAccess(String(s.id), ids[5])).caption).toBe(
    "Edited story"
  )
  await getDatabase().execute(
    sql`UPDATE story SET expires_at=clock_timestamp()-interval '1 second' WHERE id=${s.id}::uuid`
  )
  await expect(rawCheckStoryAccess(String(s.id), ids[5])).rejects.toMatchObject({
    status: 404,
  })
  expect(
    (await rawListSocialStories(actors[5])).data.map((s) => s.id)
  ).not.toContain(s.id)
  await expect(
    rawCreateSocialStory(actors[5], prefix + 5, {
      mediaUrl: "https://attacker.invalid",
      expiresAt: new Date(Date.now() + 60000).toISOString(),
    })
  ).rejects.toThrow()
})
it("keeps a failed platform delivery durable and retryable without losing posts", async () => {
  const p = await post(2)
  external.platform.mockRejectedValue(new Error("provider offline"))
  await rawDispatchSocialEvents([String(p.id)])
  const [row] = await rawSocialRows(
    sql`SELECT status,last_error FROM outbox_event WHERE aggregate_id=${p.id}::uuid AND event_type='post.created'`
  )
  expect(row).toMatchObject({
    status: "failed",
    last_error: "platform_unavailable",
  })
  external.platform.mockResolvedValue({
    data: [],
    removedResourceIds: [],
    restrictedSubjects: [],
  })
  await expect(rawCheckPostAccess(String(p.id), ids[2])).resolves.toBeTruthy()
  await getDatabase().execute(
    sql`UPDATE outbox_event SET available_at=clock_timestamp() WHERE aggregate_id=${p.id}::uuid`
  )
  external.platform.mockClear()
  await rawDispatchSocialEvents([String(p.id)])
  const [checkpoint] = await rawSocialRows(
    sql`SELECT payload,status FROM outbox_event WHERE aggregate_id=${p.id}::uuid`
  )
  expect(checkpoint.status).toBe("pending")
  expect((checkpoint.payload as { insight: boolean }).insight).toBe(true)
  expect(external.platform.mock.calls).toHaveLength(1)
  external.platform.mockClear()
  await rawDispatchSocialEvents([String(p.id)])
  expect(external.platform.mock.calls.map((c) => c[0])).toEqual(["discovery"])
  await rawDispatchSocialEvents([String(p.id)])
  const [done] = await rawSocialRows(
    sql`SELECT status FROM outbox_event WHERE aggregate_id=${p.id}::uuid`
  )
  expect(done.status).toBe("delivered")
  external.platform.mockResolvedValue({
    data: [],
    removedResourceIds: [],
    restrictedSubjects: [],
  })
})
it("requires the recipient to approve a private profile follow", async () => {
  await rawSaveSocialProfile(actors[5], {
    handle: "cloud_" + ids[5].replaceAll("-", "").slice(0, 20),
    bio: "",
    website: "",
    location: "",
    visibility: "private",
  })
  await rawChangeSocialRelationship(actors[4], {
    targetId: ids[5],
    action: "follow",
  })
  const [pending] = await rawSocialRows(
    sql`SELECT status FROM follow WHERE follower_id=${ids[4]}::uuid AND following_id=${ids[5]}::uuid`
  )
  expect(pending.status).toBe("pending")
  await expect(
    rawChangeSocialRelationship(actors[4], {
      targetId: ids[5],
      action: "accept-follow",
    })
  ).rejects.toMatchObject({ status: 409 })
  await rawChangeSocialRelationship(actors[5], {
    targetId: ids[4],
    action: "accept-follow",
  })
  const [accepted] = await rawSocialRows(
    sql`SELECT status FROM follow WHERE follower_id=${ids[4]}::uuid AND following_id=${ids[5]}::uuid`
  )
  expect(accepted.status).toBe("accepted")
})
it("lists pending membership only for managers and permits owner hub edits and deletion", async () => {
  const h = await rawCreateSocialHub(actors[0], {
      kind: "group",
      name: "Managed private group",
      description: "",
      visibility: "private",
      requiresPostApproval: false,
    }),
    id = String(h.id)
  hubs.push({ kind: "group", id })
  await rawChangeSocialMembership(actors[1], "group", id, { action: "join" })
  await expect(rawListSocialMembers(actors[1], "group", id)).rejects.toMatchObject(
    { status: 403 }
  )
  expect(
    (await rawListSocialMembers(actors[0], "group", id)).requests.map((x) => x.id)
  ).toContain(ids[1])
  await rawChangeSocialMembership(actors[0], "group", id, {
    action: "approve",
    targetId: ids[1],
  })
  expect((await rawListSocialMembers(actors[1], "group", id)).requests).toEqual([])
  await expect(
    rawChangeSocialHub(actors[1], "group", id, { name: "Wrong" })
  ).rejects.toMatchObject({ status: 403 })
  await rawChangeSocialHub(actors[0], "group", id, { name: "Updated group" })
  expect(
    (await rawListSocialHubs(actors[0], "group", "", 0, id)).data[0].name
  ).toBe("Updated group")
  await rawChangeSocialHub(actors[0], "group", id, {}, true)
  expect((await rawListSocialHubs(actors[0], "group", "", 0, id)).data).toEqual([])
})
it("shows a private event only to its creator, invited people and attendees", async () => {
  const e = await rawCreateSocialHub(actors[0], {
      kind: "event",
      name: "Private event",
      description: "",
      visibility: "private",
      requiresPostApproval: false,
      startsAt: new Date(Date.now() + 3600000).toISOString(),
    }),
    id = String(e.id)
  hubs.push({ kind: "event", id })
  expect((await rawListSocialHubs(actors[1], "event", "", 0, id)).data).toEqual([])
  await rawChangeSocialMembership(actors[0], "event", id, {
    action: "invite",
    targetId: ids[1],
  })
  expect(
    (await rawListSocialHubs(actors[1], "event", "", 0, id)).data
  ).toHaveLength(1)
  expect((await rawListSocialHubs(actors[2], "event", "", 0, id)).data).toEqual([])
  await rawChangeSocialMembership(actors[1], "event", id, { action: "going" })
})
it("filters comment author identities using the current two-way block state", async () => {
  await rawChangeSocialRelationship(actors[2], {
    targetId: ids[3],
    action: "block",
  })
  expect(
    await rawDeniedSocialSubjects(ids[2], [
      prefix + 2,
      prefix + 3,
      "unknown-subject",
    ])
  ).toEqual([prefix + 3, "unknown-subject"])
  expect(await rawDeniedSocialSubjects(ids[3], [prefix + 2])).toEqual([prefix + 2])
  await rawChangeSocialRelationship(actors[2], {
    targetId: ids[3],
    action: "unblock",
  })
  expect(await rawDeniedSocialSubjects(ids[2], [prefix + 3])).toEqual([])
})
