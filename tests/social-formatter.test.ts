import { expect, it } from "vitest"
import { formatSocialValue } from "@/utils/social-formatter"
it("returns UTC ISO timestamps consistently in nested SQL DTOs", () => {
  expect(
    formatSocialValue({
      createdAt: "2026-10-28 12:34:56.123456",
      expires_at: "2026-10-28T13:34:56",
      media: [{ updatedAt: new Date("2026-10-28T00:00:00Z") }],
    })
  ).toEqual({
    createdAt: "2026-10-28T12:34:56.123Z",
    expires_at: "2026-10-28T13:34:56.000Z",
    media: [{ updatedAt: "2026-10-28T00:00:00.000Z" }],
  })
})
it("preserves content, IDs, policy objects and explicit UTC offsets", () => {
  expect(
    formatSocialValue({
      content: "2026-10-28 12:34:56",
      id: "uuid",
      startsAt: "2026-10-28T12:00:00+07:00",
      payload: { actorId: "subject" },
    })
  ).toEqual({
    content: "2026-10-28 12:34:56",
    id: "uuid",
    startsAt: "2026-10-28T05:00:00.000Z",
    payload: { actorId: "subject" },
  })
})
