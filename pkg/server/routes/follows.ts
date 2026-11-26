import { Router } from "@/lib/http"
import {
  createFollowController,
  deleteFollowController,
  getFollowController,
  listFollowsController,
  updateFollowController,
} from "@/controllers/follows"
import { requireAuth } from "@/middlewares/auth"
export function followsRoutes() {
  const router = Router()
  router.get("/", requireAuth(), listFollowsController)
  router.post("/", requireAuth(), createFollowController)
  router.get("/:followerId/:followingId", requireAuth(), getFollowController)
  router.put("/:followerId/:followingId", requireAuth(), updateFollowController)
  router.patch("/:followerId/:followingId", requireAuth(), updateFollowController)
  router.delete("/:followerId/:followingId", requireAuth(), deleteFollowController)
  return router
}
