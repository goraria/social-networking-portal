import { beforeEach, expect, it, vi } from "vitest"
import { PgDialect } from "drizzle-orm/pg-core"
const f = vi.hoisted(() => ({
  inspect: vi.fn(),
  rows: vi.fn(),
}))
vi.mock("server-only", () => ({}))
vi.mock("@/models/index", async (original) => ({
  ...(await original<typeof import("@/models/index")>()),
  rawSocialRows: f.rows,
}))
vi.mock("@/services/social-policy", () => ({
  rawAssertSocialWriteAllowed: vi.fn(),
}))
vi.mock("@/services/social-media", () => ({ rawInspectSocialAsset: f.inspect }))
import { rawCreatePost, rawUpdatePost } from "@/models/post"
import { postInputSchema, postUpdateSchema } from "@/schemas/social"
const actor = { userId: crypto.randomUUID(), isAdmin: false }
beforeEach(() => {
  vi.clearAllMocks()
})
it("binds the verified local actor and resolved SSO subject to post creation", async () => {
  const assetId = crypto.randomUUID()
  f.rows.mockResolvedValueOnce([{ external_user_id: "verified-subject" }])
  f.rows.mockResolvedValueOnce([])
  f.inspect.mockRejectedValueOnce(new Error("stop before writing"))
  await expect(rawCreatePost(actor, {
    content: "Text",
    type: "standard",
    clientRequestId: crypto.randomUUID(),
    assetIds: [assetId],
    authorId: "attacker",
  })).rejects.toThrow("stop before writing")
  expect(new PgDialect().sqlToQuery(f.rows.mock.calls[0][0]).params).toEqual([
    actor.userId,
  ])
  expect(f.inspect).toHaveBeenCalledWith(assetId, "verified-subject")
})
it("strips caller ownership, actor and counter fields from the create contract", () => {
  const p = postInputSchema.parse({
    type: "standard",
    content: "Text",
    clientRequestId: crypto.randomUUID(),
    authorId: "attacker",
    authorActorId: crypto.randomUUID(),
    repostCount: 999,
  })
  expect(p).not.toHaveProperty("authorId")
  expect(p).not.toHaveProperty("authorActorId")
  expect(p).not.toHaveProperty("repostCount")
  expect(() =>
    postUpdateSchema.parse({ version: 1, authorId: "attacker" })
  ).toThrow()
})
it("validates the post key before calling a mutation service", async () => {
  expect(() =>
    rawUpdatePost(actor, { id: "not-a-uuid" }, { version: 1 })
  ).toThrow()
  expect(f.rows).not.toHaveBeenCalled()
})
