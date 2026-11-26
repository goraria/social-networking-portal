import { Router } from "@/lib/http"
import {
  createBlockController,
  deleteBlockController,
  getBlockController,
  listBlocksController,
  updateBlockController,
} from "@/controllers/blocks"
import { requireAuth } from "@/middlewares/auth"
export function blocksRoutes() {
  const router = Router()
  router.get("/", requireAuth(), listBlocksController)
  router.post("/", requireAuth(), createBlockController)
  router.get("/:blockerId/:blockedId", requireAuth(), getBlockController)
  router.put("/:blockerId/:blockedId", requireAuth(), updateBlockController)
  router.patch("/:blockerId/:blockedId", requireAuth(), updateBlockController)
  router.delete("/:blockerId/:blockedId", requireAuth(), deleteBlockController)
  return router
}
