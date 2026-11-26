import { Router } from "@/lib/http"
import {
  createStoryController,
  deleteStoryController,
  getStoryController,
  listStoriesController,
  updateStoryController,
} from "@/controllers/stories"
import { requireAuth } from "@/middlewares/auth"
export function storiesRoutes() {
  const router = Router()
  router.get("/", requireAuth(), listStoriesController)
  router.post("/", requireAuth(), createStoryController)
  router.get("/:id", requireAuth(), getStoryController)
  router.put("/:id", requireAuth(), updateStoryController)
  router.patch("/:id", requireAuth(), updateStoryController)
  router.delete("/:id", requireAuth(), deleteStoryController)
  return router
}
