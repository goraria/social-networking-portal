import { beforeEach, expect, it, vi } from "vitest"
import { Hono } from "hono"
import type { ApiEnv } from "@/utils/interface"
const fixture = vi.hoisted(() => ({
  local: vi.fn(),
  list: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
}))
vi.mock("@/models/user", () => ({ rawGetUserByExternalId: fixture.local }))
vi.mock("@/models/post", () => ({
  rawListPosts: fixture.list,
  rawCreatePost: fixture.create,
  rawUpdatePost: fixture.update,
  rawGetPost: vi.fn(),
  rawDeletePost: vi.fn(),
}))
vi.mock("@/middlewares/auth", () => ({
  requireAuth:
    () =>
    async (
      context: import("hono").Context<ApiEnv>,
      next: () => Promise<void>
    ) => {
      if (!context.req.header("x-test-identity"))
        return context.json({ error: "unauthorized" }, 401)
      context.set("auth", {
        authenticated: true,
        verifiedBy: "single-sign-on",
        user: {
          id: "sso-sub",
          name: "Account",
          email: "fixture@example.test",
          username: "account",
          image: null,
          status: "active",
        },
        app: { role: "admin", roles: ["admin"], permissions: ["admin"] },
        scopes: ["social:read", "social:write"],
        sessionId: "sso-sid",
        localRole: null,
      })
      await next()
    },
}))
import { postsRoutes } from "@/routes/posts"
import { CrudError } from "@/database/crud"
const app = new Hono().route("/social/post", postsRoutes)
app.onError((error, context) =>
  error instanceof CrudError
    ? context.json({ error: error.code }, error.status as 400 | 403)
    : context.json({ error: "internal" }, 500)
)
beforeEach(() => {
  vi.resetAllMocks()
  fixture.local.mockResolvedValue({ id: "local-user", role: "user" })
  fixture.list.mockResolvedValue({
    data: [],
    pagination: { limit: 20, offset: 0 },
  })
  fixture.create.mockResolvedValue({ id: "post" })
  fixture.update.mockResolvedValue({ id: "post" })
})
const headers = {
  "x-test-identity": "verified",
  "Content-Type": "application/json",
}
it("keeps the post API separate from the /post HTML page", async () => {
  expect((await app.request("/post")).status).toBe(404)
  expect((await app.request("/social/post", { headers })).status).toBe(200)
  expect(fixture.local).toHaveBeenCalledWith("sso-sub")
})
it("does not grant admin from SSO application claims", async () => {
  await app.request("/social/post?limit=10&offset=2", { headers })
  expect(fixture.list).toHaveBeenCalledWith(
    { userId: "local-user", isAdmin: false },
    { limit: 10, offset: 2 }
  )
})
it("recognizes only verified Social-local administrative policy", async () => {
  fixture.local.mockResolvedValue({ id: "local-user", role: "admin" })
  await app.request("/social/post", { headers })
  expect(fixture.list.mock.calls[0][0].isAdmin).toBe(true)
})
it("denies anonymous CRUD before calling any service", async () => {
  for (const method of ["GET", "POST", "PATCH", "DELETE"]) {
    expect(
      (
        await app.request(
          "/social/post" + (["PATCH", "DELETE"].includes(method) ? "/id" : ""),
          { method }
        )
      ).status
    ).toBe(401)
  }
  expect(fixture.local).not.toHaveBeenCalled()
  expect(fixture.create).not.toHaveBeenCalled()
})
it("rejects invalid or overflowing pagination", async () => {
  for (const limit of ["abc", "-1", "9007199254740992"]) {
    expect(
      (await app.request("/social/post?limit=" + limit, { headers })).status
    ).toBe(400)
  }
  expect(fixture.list).not.toHaveBeenCalled()
})
it("passes the verified local actor into mutations", async () => {
  const response = await app.request("/social/post", {
    method: "POST",
    headers,
    body: JSON.stringify({ authorId: "attacker", content: "hello" }),
  })
  expect(response.status).toBe(201)
  expect(fixture.create).toHaveBeenCalledWith(
    { userId: "local-user", isAdmin: false },
    { authorId: "attacker", content: "hello" }
  )
})
