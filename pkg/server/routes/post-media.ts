import { Router } from "@/lib/http"
import {
  createPostMediaController,
  deletePostMediaController,
  getPostMediaController,
  listPostMediaController,
  updatePostMediaController,
} from "@/controllers/post-media"
import { requireAuth } from "@/middlewares/auth"
export function postMediaRoutes() {
  const router = Router()
  router.get("/", requireAuth(), listPostMediaController)
  router.post("/", requireAuth(), createPostMediaController)
  router.get("/:id", requireAuth(), getPostMediaController)
  router.put("/:id", requireAuth(), updatePostMediaController)
  router.patch("/:id", requireAuth(), updatePostMediaController)
  router.delete("/:id", requireAuth(), deletePostMediaController)
  return router
}
