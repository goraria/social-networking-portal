import { Hono } from "hono"
import { requireAuth } from "@/middlewares/auth"
import * as controller from "@/controllers/social"
export const socialRoutes = new Hono()
socialRoutes.get("/feed", requireAuth(), controller.actListSocialPosts)
socialRoutes.put("/feed/:id/source", requireAuth(), controller.actSaveFeedSources)
socialRoutes.get("/feed/:id/source", requireAuth(), controller.actGetFeedSources)
socialRoutes.get("/group/:id/queue", requireAuth(), controller.actGroupReviewQueue)
socialRoutes.post(
  "/post/:id/review",
  requireAuth(),
  controller.actModerateGroupPost
)
socialRoutes.get("/search", requireAuth(), controller.actSearchSocialPosts)
socialRoutes.post("/post/:id/hide", requireAuth(), controller.actHideSocialPost)
socialRoutes.post(
  "/post/:id/report",
  requireAuth(),
  controller.actReportSocialPost
)
socialRoutes.post(
  "/moderation/restriction",
  requireAuth(),
  controller.actRestrictSocialAccount
)
socialRoutes.post(
  "/access",
  requireAuth({ requiredScopes: ["social:read"] }),
  controller.actSocialAccess
)
socialRoutes.get("/people", requireAuth(), controller.actSocialPeople)
socialRoutes.post(
  "/relationship",
  requireAuth(),
  controller.actChangeSocialRelationship
)
socialRoutes.get("/me", requireAuth(), controller.actSocialMe)
socialRoutes.put("/me", requireAuth(), controller.actSaveSocialProfile)
socialRoutes.get("/identity/:handle", requireAuth(), controller.actSocialProfile)
socialRoutes.get("/hub/:kind", requireAuth(), controller.actListSocialHubs)
socialRoutes.get("/hub/:kind/:id", requireAuth(), controller.actListSocialHubs)
socialRoutes.post("/hub", requireAuth(), controller.actCreateSocialHub)
socialRoutes.get(
  "/hub/:kind/:id/member",
  requireAuth(),
  controller.actListSocialMembers
)
socialRoutes.patch("/hub/:kind/:id", requireAuth(), controller.actChangeSocialHub)
socialRoutes.delete("/hub/:kind/:id", requireAuth(), controller.actChangeSocialHub)
socialRoutes.post(
  "/hub/:kind/:id/member",
  requireAuth(),
  controller.actChangeSocialMembership
)
socialRoutes.get("/story", requireAuth(), controller.actListSocialStories)
socialRoutes.post("/story", requireAuth(), controller.actCreateSocialStory)
socialRoutes.post("/story/:id/view", requireAuth(), controller.actViewSocialStory)
socialRoutes.patch("/story/:id", requireAuth(), controller.actChangeSocialStory)
socialRoutes.delete("/story/:id", requireAuth(), controller.actChangeSocialStory)
socialRoutes.get("/asset/:id", requireAuth(), controller.actSocialAssetUrl)
socialRoutes.post("/upload", requireAuth(), controller.actCreateSocialUpload)
socialRoutes.post(
  "/upload/:id/complete",
  requireAuth(),
  controller.actFinishSocialUpload
)
socialRoutes.delete("/upload/:id", requireAuth(), controller.actFinishSocialUpload)
socialRoutes.post("/event/dispatch", controller.actDispatchSocialEvents)
