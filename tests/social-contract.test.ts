import { expect, it, vi, beforeEach } from "vitest"
import {
  postInputSchema,
  postUpdateSchema,
  feedQuerySchema,
  uploadSchema,
  hubInputSchema,
  profileInputSchema,
  storyInputSchema,
} from "@/schemas/social"
const v = vi.hoisted(() => ({ platform: vi.fn(), rows: vi.fn() }))
vi.mock("@/database", () => ({ getDatabase: () => ({}) }))
vi.mock("@/services/social-platform", () => ({
  rawSocialPlatformRequest: v.platform,
}))
vi.mock("@/models/index", async (original) => ({
  ...(await original<typeof import("@/models/index")>()),
  rawSocialRows: v.rows,
}))
import {
  rawFilterSocialPolicy,
  rawAssertSocialWriteAllowed,
} from "@/services/social-policy"
const id = crypto.randomUUID()
beforeEach(() => {
  vi.clearAllMocks()
  v.rows.mockResolvedValue([{ id, external_user_id: "subject" }])
  v.platform.mockResolvedValue({
    removedResourceIds: [],
    restrictedSubjects: [],
  })
})
it.each([
  "image/svg+xml",
  "text/html",
  "application/javascript",
  "application/octet-stream",
])("rejects executable or unsupported upload type %s", (contentType) => {
  expect(() =>
    uploadSchema.parse({
      bucket: id,
      filename: "unsafe",
      contentType,
      size: 100,
    })
  ).toThrow()
})
it("bounds media, content, search and pagination inputs", () => {
  expect(() =>
    postInputSchema.parse({
      type: "standard",
      content: "x".repeat(10001),
      clientRequestId: id,
    })
  ).toThrow()
  expect(() =>
    postInputSchema.parse({
      type: "standard",
      content: "post",
      clientRequestId: id,
      assetIds: Array(11).fill(id),
    })
  ).toThrow()
  for (const offset of [-1, 100001, Number.POSITIVE_INFINITY])
    expect(() => feedQuerySchema.parse({ offset })).toThrow()
  expect(() =>
    uploadSchema.parse({
      bucket: id,
      filename: "x.png",
      contentType: "image/png",
      size: 101 * 1024 * 1024,
    })
  ).toThrow()
})
it("requires a version on edits and validates event intervals and profile URLs", () => {
  expect(() => postUpdateSchema.parse({ content: "new" })).toThrow()
  expect(() =>
    hubInputSchema.parse({
      kind: "event",
      name: "Event",
      startsAt: "2026-11-03T00:00:00Z",
      endsAt: "2026-11-02T00:00:00Z",
    })
  ).toThrow()
  expect(() =>
    profileInputSchema.parse({ handle: "abc", website: "javascript:alert(1)" })
  ).toThrow()
  expect(() =>
    storyInputSchema.parse({
      mediaUrl: "https://outside.test",
      expiresAt: "2026-11-02T00:00:00Z",
    })
  ).toThrow()
})
it("filters removed content and restricted authors without copying moderation tables", async () => {
  v.platform.mockResolvedValue({
    removedResourceIds: [id],
    restrictedSubjects: [],
  })
  expect(await rawFilterSocialPolicy([{ id }])).toEqual([])
  v.platform.mockResolvedValue({
    removedResourceIds: [],
    restrictedSubjects: ["subject"],
  })
  expect(await rawFilterSocialPolicy([{ id }])).toEqual([])
  await expect(rawAssertSocialWriteAllowed(id)).rejects.toMatchObject({
    status: 403,
  })
})
it("does not silently allow access when the policy provider is unavailable", async () => {
  v.platform.mockRejectedValue(new Error("offline"))
  await expect(rawFilterSocialPolicy([{ id }])).rejects.toThrow()
  await expect(rawAssertSocialWriteAllowed(id)).rejects.toThrow()
})
