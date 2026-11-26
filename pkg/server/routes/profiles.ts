import { Router } from "@/lib/http"
import {
  createProfileController,
  deleteProfileController,
  getCurrentProfileController,
  getProfileController,
  listProfilesController,
  updateProfileController,
} from "@/controllers/profiles"
import { requireAuth } from "@/middlewares/auth"
export function profilesRoutes() {
  const router = Router()
  router.get("/", requireAuth(), listProfilesController)
  router.post("/", requireAuth(), createProfileController)
  router.get("/me", requireAuth(), getCurrentProfileController)
  router.get("/:handle", requireAuth(), getProfileController)
  router.put("/:userId", requireAuth(), updateProfileController)
  router.patch("/:userId", requireAuth(), updateProfileController)
  router.delete("/:userId", requireAuth(), deleteProfileController)
  return router
}
