import { handle } from "@hono/vercel"
import { Hono } from "hono"
import { http, httpError, httpNotFound, httpMethods } from "@/middlewares/http"
import { postsRoutes } from "@/routes/posts"
import { usersRoutes } from "@/routes/users"
import { labRoutes } from "@/routes/lab"
import { socialRoutes } from "@/routes/social"
import { sharedRoutes } from "@/routes/shared"
const router = new Hono()
router.use(http)
router.onError(httpError)
router.notFound(httpNotFound)
router.use(httpMethods(router))
router.route("/internal/social/post", postsRoutes)
router.route("/internal/social", socialRoutes)
router.route("/internal/social/user", usersRoutes)
router.route("/internal", labRoutes)
router.route("/internal", sharedRoutes)
export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const GET = handle(router)
export const HEAD = handle(router)
export const POST = handle(router)
export const PUT = handle(router)
export const PATCH = handle(router)
export const DELETE = handle(router)
export const OPTIONS = handle(router)
