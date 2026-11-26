import { Router } from "@/lib/http"
import {
  createPostController,
  deletePostController,
  getPostController,
  listPostsController,
  updatePostController,
} from "@/controllers/posts"
import { requireAuth } from "@/middlewares/auth"
export function postsRoutes() {
  const router = Router()
  router.get("/", requireAuth(), listPostsController)
  router.post("/", requireAuth(), createPostController)
  router.get("/:id", requireAuth(), getPostController)
  router.put("/:id", requireAuth(), updatePostController)
  router.patch("/:id", requireAuth(), updatePostController)
  router.delete("/:id", requireAuth(), deletePostController)
  return router
}
