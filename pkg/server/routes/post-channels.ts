import { Router } from "@/lib/http"
import {
  createPostChannelController,
  deletePostChannelController,
  getPostChannelController,
  listPostChannelsController,
  updatePostChannelController,
} from "@/controllers/post-channels"
import { requireAuth } from "@/middlewares/auth"
export function postChannelsRoutes() {
  const router = Router()
  router.get("/", requireAuth(), listPostChannelsController)
  router.post("/", requireAuth(), createPostChannelController)
  router.get("/:postId/:channel", requireAuth(), getPostChannelController)
  router.put("/:postId/:channel", requireAuth(), updatePostChannelController)
  router.patch("/:postId/:channel", requireAuth(), updatePostChannelController)
  router.delete("/:postId/:channel", requireAuth(), deletePostChannelController)
  return router
}
