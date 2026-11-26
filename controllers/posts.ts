import type { Context } from "hono"
import type { ApiEnv } from "@/utils/interface"
import { parsePagination, resolveActor, readJsonBody } from "@/utils/controller"
import {
  rawListPosts as listPostsServices,
  rawGetPost as getPostServices,
  rawCreatePost as createPostServices,
  rawUpdatePost as updatePostServices,
  rawDeletePost as deletePostServices,
} from "@/models/post"

export async function actListPosts(context: Context<ApiEnv>) {
  try {
    return context.json(
      await listPostsServices(await resolveActor(context), {
        limit: parsePagination(context.req.query("limit"), "limit"),
        offset: parsePagination(context.req.query("offset"), "offset"),
      }),
      200
    )
  } catch (error) {
    throw error
  }
}
export async function actGetPost(context: Context<ApiEnv>) {
  try {
    return context.json(
      {
        data: await getPostServices(
          await resolveActor(context),
          context.req.param()
        ),
      },
      200
    )
  } catch (error) {
    throw error
  }
}
export async function actCreatePost(context: Context<ApiEnv>) {
  try {
    return context.json(
      {
        data: await createPostServices(
          await resolveActor(context),
          await readJsonBody(context)
        ),
      },
      201
    )
  } catch (error) {
    throw error
  }
}
export async function actUpdatePost(context: Context<ApiEnv>) {
  try {
    return context.json(
      {
        data: await updatePostServices(
          await resolveActor(context),
          context.req.param(),
          await readJsonBody(context)
        ),
      },
      200
    )
  } catch (error) {
    throw error
  }
}
export async function actDeletePost(context: Context<ApiEnv>) {
  try {
    return context.json(
      {
        data: await deletePostServices(
          await resolveActor(context),
          context.req.param()
        ),
      },
      200
    )
  } catch (error) {
    throw error
  }
}
