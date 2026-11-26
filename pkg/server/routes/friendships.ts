import { Router } from "@/lib/http"
import {
  createFriendshipController,
  deleteFriendshipController,
  getFriendshipController,
  listFriendshipsController,
  updateFriendshipController,
} from "@/controllers/friendships"
import { requireAuth } from "@/middlewares/auth"
export function friendshipsRoutes() {
  const router = Router()
  router.get("/", requireAuth(), listFriendshipsController)
  router.post("/", requireAuth(), createFriendshipController)
  router.get("/:requesterId/:addresseeId", requireAuth(), getFriendshipController)
  router.put("/:requesterId/:addresseeId", requireAuth(), updateFriendshipController)
  router.patch("/:requesterId/:addresseeId", requireAuth(), updateFriendshipController)
  router.delete("/:requesterId/:addresseeId", requireAuth(), deleteFriendshipController)
  return router
}
