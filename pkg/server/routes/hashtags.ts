import { Router } from "@/lib/http"
import {
  createHashtagController,
  deleteHashtagController,
  getHashtagController,
  listHashtagsController,
  updateHashtagController,
} from "@/controllers/hashtags"
import { requireAuth } from "@/middlewares/auth"
export function hashtagsRoutes() {
  const router = Router()
  router.get("/", requireAuth(), listHashtagsController)
  router.post("/", requireAuth(), createHashtagController)
  router.get("/:id", requireAuth(), getHashtagController)
  router.put("/:id", requireAuth(), updateHashtagController)
  router.patch("/:id", requireAuth(), updateHashtagController)
  router.delete("/:id", requireAuth(), deleteHashtagController)
  return router
}
