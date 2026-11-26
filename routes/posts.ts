import { Hono } from "hono"
import {
  actCreatePost,
  actDeletePost,
  actGetPost,
  actListPosts,
  actUpdatePost,
} from "@/controllers/posts"
import { requireAuth } from "@/middlewares/auth"
export const postsRoutes = new Hono()
postsRoutes.get("/", requireAuth(), actListPosts)
postsRoutes.post("/", requireAuth(), actCreatePost)
postsRoutes.get("/:id", requireAuth(), actGetPost)
postsRoutes.put("/:id", requireAuth(), actUpdatePost)
postsRoutes.patch("/:id", requireAuth(), actUpdatePost)
postsRoutes.delete("/:id", requireAuth(), actDeletePost)
