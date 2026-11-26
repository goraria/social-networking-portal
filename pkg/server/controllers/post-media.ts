import type { NextFunction, Request, Response } from "@/lib/http"
import {
  normalizeParams,
  parsePagination,
  resolveActor,
  sendControllerError,
} from "@/utils/controller"
import {
  createPostMedia,
  deletePostMedia,
  getPostMedia,
  listPostMedia,
  updatePostMedia,
} from "@/services/post-media"

export async function listPostMediaController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    return res
      .status(200)
      .json(
        await listPostMedia(await resolveActor(res), {
          limit: parsePagination(req.query.limit, "limit"),
          offset: parsePagination(req.query.offset, "offset"),
        })
      )
  } catch (error) {
    return sendControllerError(error, res, next)
  }
}
export async function getPostMediaController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    return res
      .status(200)
      .json({
        data: await getPostMedia(
          await resolveActor(res),
          normalizeParams(req.params)
        ),
      })
  } catch (error) {
    return sendControllerError(error, res, next)
  }
}
export async function createPostMediaController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    return res
      .status(201)
      .json({ data: await createPostMedia(await resolveActor(res), req.body) })
  } catch (error) {
    return sendControllerError(error, res, next)
  }
}
export async function updatePostMediaController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    return res
      .status(200)
      .json({
        data: await updatePostMedia(
          await resolveActor(res),
          normalizeParams(req.params),
          req.body
        ),
      })
  } catch (error) {
    return sendControllerError(error, res, next)
  }
}
export async function deletePostMediaController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    return res
      .status(200)
      .json({
        data: await deletePostMedia(
          await resolveActor(res),
          normalizeParams(req.params)
        ),
      })
  } catch (error) {
    return sendControllerError(error, res, next)
  }
}
