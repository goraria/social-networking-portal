import { Hono } from "hono"
import { requireAuth } from "@/middlewares/auth"
import { getSafeHeaders } from "@/utils/formatter"
import type { DemoApiData } from "@/utils/interface"

export const labRoutes = new Hono()
labRoutes.get("/social/lab", requireAuth({ freshProfile: true }), (context) =>
  context.json({ data: context.get("auth") })
)
labRoutes.post("/demo/call", requireAuth(), async (context) => {
  const url = new URL(context.req.url)
  const data: DemoApiData = {
    id: "hono-demo",
    source: "Hono route",
    route: url.pathname,
    url: url.href,
    method: context.req.method,
    status: "ok",
    generatedAt: new Date().toISOString(),
    params: Object.fromEntries(url.searchParams),
    body: await context.req.json(),
    headers: getSafeHeaders(context.req.raw.headers),
    cookieNames: [],
    hasAuthorization: context.req.header("authorization") !== undefined,
  }
  return context.json({ data, message: "Demo API loaded" })
})
