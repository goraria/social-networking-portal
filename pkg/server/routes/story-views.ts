import { Router } from "@/lib/http"
import {
  createStoryViewController,
  deleteStoryViewController,
  getStoryViewController,
  listStoryViewsController,
  updateStoryViewController,
} from "@/controllers/story-views"
import { requireAuth } from "@/middlewares/auth"
export function storyViewsRoutes() {
  const router = Router()
  router.get("/", requireAuth(), listStoryViewsController)
  router.post("/", requireAuth(), createStoryViewController)
  router.get("/:storyId/:viewerId", requireAuth(), getStoryViewController)
  router.put("/:storyId/:viewerId", requireAuth(), updateStoryViewController)
  router.patch("/:storyId/:viewerId", requireAuth(), updateStoryViewController)
  router.delete("/:storyId/:viewerId", requireAuth(), deleteStoryViewController)
  return router
}
