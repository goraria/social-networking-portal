import { expect, it, vi } from "vitest"
import { Hono } from "hono"
import { ZodError } from "@gorth-com/structure/cores/zod"
import type { ApiEnv } from "@/utils/interface"
import { CrudError } from "@/database/crud"
vi.mock("@/middlewares/auth", () => ({
  requireAuth:
    () =>
    async (c: import("hono").Context<ApiEnv>, next: () => Promise<void>) => {
      if (!c.req.header("x-test-sub"))
        return c.json({ error: "unauthorized" }, 401)
      c.set("auth", { user: { id: "verified" } } as never)
      await next()
    },
}))
vi.mock("@/models/user", () => ({
  rawGetUserByExternalId: async () => ({
    id: "2b04711b-c09d-4a21-b55d-3b03f60127b8",
    role: "user",
  }),
}))
import { socialRoutes } from "@/routes/social"
import { postsRoutes } from "@/routes/posts"
import { actSocialStorageCredential } from "@/controllers/social"
const app = new Hono()
  .route("/social/post", postsRoutes)
  .route("/social", socialRoutes)
  .post("/internal/storage/credential", actSocialStorageCredential)
app.onError((e, c) =>
  c.json(
    { error: e.message },
    (e instanceof CrudError
      ? e.status
      : e instanceof ZodError || e instanceof SyntaxError
        ? 400
        : 500) as 400
  )
)
const id = "2b04711b-c09d-4a21-b55d-3b03f60127b8",
  paths = [
    ...new Map(
      app.routes
        .filter(
          (r) => !r.path.includes("/dispatch") && !r.path.includes("/internal")
        )
        .map((r) => {
          const path = r.path.replace(/:[^/]+/g, id)
          return [r.method + " " + path, [r.method, path] as const]
        })
    ).values(),
  ]
it.each(paths)("requires an identity on %s %s", async (method, path) => {
  expect(
    (
      await app.request(path, {
        method,
        headers: { "Content-Type": "application/json" },
        ...(["GET", "HEAD"].includes(method) ? {} : { body: "{}" }),
      })
    ).status
  ).toBe(401)
})
it("rejects malformed JSON, unsupported types and invalid upload contracts before a provider call", async () => {
  for (const v of [
    { body: "{", type: "application/json", status: 400 },
    { body: "{}", type: "text/plain", status: 415 },
    {
      body: JSON.stringify({
        bucket: id,
        filename: "evil.svg",
        contentType: "image/svg+xml",
        size: 100,
      }),
      type: "application/json",
      status: 400,
    },
  ])
    expect(
      (
        await app.request("/social/upload", {
          method: "POST",
          headers: { "x-test-sub": "verified", "Content-Type": v.type },
          body: v.body,
        })
      ).status
    ).toBe(v.status)
})
it("rejects normal browser credentials on backend-only endpoints", async () => {
  for (const path of ["/social/event/dispatch", "/internal/storage/credential"])
    expect(
      (
        await app.request(path, {
          method: "POST",
          headers: {
            Cookie: "session=user",
            "Content-Type": "application/json",
          },
          body: "{}",
        })
      ).status
    ).toBe(403)
})
