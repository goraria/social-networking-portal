import type { NextFunction, Request, Response } from "@/lib/http"
import {
  normalizeParams,
  parsePagination,
  resolveActor,
  sendControllerError,
} from "@/utils/controller"
import {
  createPostHashtag,
  deletePostHashtag,
  getPostHashtag,
  listPostHashtags,
  updatePostHashtag,
} from "@/services/post-hashtags"

export async function listPostHashtagsController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    return res
      .status(200)
      .json(
        await listPostHashtags(await resolveActor(res), {
          limit: parsePagination(req.query.limit, "limit"),
          offset: parsePagination(req.query.offset, "offset"),
        })
      )
  } catch (error) {
    return sendControllerError(error, res, next)
  }
}
export async function getPostHashtagController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    return res
      .status(200)
      .json({
        data: await getPostHashtag(
          await resolveActor(res),
          normalizeParams(req.params)
        ),
      })
  } catch (error) {
    return sendControllerError(error, res, next)
  }
}
export async function createPostHashtagController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    return res
      .status(201)
      .json({
        data: await createPostHashtag(await resolveActor(res), req.body),
      })
  } catch (error) {
    return sendControllerError(error, res, next)
  }
}
export async function updatePostHashtagController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    return res
      .status(200)
      .json({
        data: await updatePostHashtag(
          await resolveActor(res),
          normalizeParams(req.params),
          req.body
        ),
      })
  } catch (error) {
    return sendControllerError(error, res, next)
  }
}
export async function deletePostHashtagController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    return res
      .status(200)
      .json({
        data: await deletePostHashtag(
          await resolveActor(res),
          normalizeParams(req.params)
        ),
      })
  } catch (error) {
    return sendControllerError(error, res, next)
  }
}
