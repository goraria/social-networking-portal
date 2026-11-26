import { afterEach, beforeEach, expect, it, vi } from "vitest"
const f = vi.hoisted(() => ({
  identity: {
    account: { id: "first" } as { id: string } | null,
    authenticated: true,
  },
  query: vi.fn((options: unknown) => options),
  call: vi.fn(),
}))
vi.mock("@/hooks/use-auth", () => ({ useAuth: () => f.identity }))
vi.mock("@/utils/caller", () => ({ caller: f.call, useCallerQuery: f.query }))
import { socialMutation, useSocialQuery } from "@/queries/social"
beforeEach(() => {
  vi.clearAllMocks()
  f.identity.account = { id: "first" }
  f.identity.authenticated = true
  f.call.mockResolvedValue({ id: "saved" })
})
afterEach(() => vi.unstubAllGlobals())
it("isolates domain query caches between accounts and stops requests after logout", () => {
  useSocialQuery("/social/post")
  const first = f.query.mock.calls.at(-1)![0]
  f.identity.account = { id: "second" }
  useSocialQuery("/social/post")
  expect(f.query.mock.calls.at(-1)![0]).not.toEqual(first)
  f.identity.account = null
  f.identity.authenticated = false
  useSocialQuery("/social/post")
  expect(f.query.mock.calls.at(-1)![0]).toMatchObject({
    queryOptions: { enabled: false },
  })
})
it("invalidates privacy-sensitive data on relationship changes without looping story view receipts", async () => {
  const browser = new EventTarget(),
    events: Event[] = []
  vi.stubGlobal("window", browser)
  browser.addEventListener("social:data-changed", (e) => events.push(e))
  expect(
    await socialMutation("/social/relationship", { action: "block" })
  ).toEqual({ id: "saved" })
  expect((events[0] as CustomEvent).detail).toEqual({ privacy: true })
  await socialMutation("/social/story/story-id/view")
  expect(events).toHaveLength(1)
})
