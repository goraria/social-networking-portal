import { Router } from "@/lib/http"
import {
  createPostHashtagController,
  deletePostHashtagController,
  getPostHashtagController,
  listPostHashtagsController,
  updatePostHashtagController,
} from "@/controllers/post-hashtags"
import { requireAuth } from "@/middlewares/auth"
export function postHashtagsRoutes() {
  const router = Router()
  router.get("/", requireAuth(), listPostHashtagsController)
  router.post("/", requireAuth(), createPostHashtagController)
  router.get("/:postId/:hashtagId", requireAuth(), getPostHashtagController)
  router.put("/:postId/:hashtagId", requireAuth(), updatePostHashtagController)
  router.patch("/:postId/:hashtagId", requireAuth(), updatePostHashtagController)
  router.delete("/:postId/:hashtagId", requireAuth(), deletePostHashtagController)
  return router
}
