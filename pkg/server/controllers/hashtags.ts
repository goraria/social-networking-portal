import type { NextFunction, Request, Response } from "@/lib/http"
import {
  normalizeParams,
  parsePagination,
  resolveActor,
  sendControllerError,
} from "@/utils/controller"
import {
  createHashtag,
  deleteHashtag,
  getHashtag,
  listHashtags,
  updateHashtag,
} from "@/services/hashtags"

export async function listHashtagsController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    return res
      .status(200)
      .json(
        await listHashtags(await resolveActor(res), {
          limit: parsePagination(req.query.limit, "limit"),
          offset: parsePagination(req.query.offset, "offset"),
        })
      )
  } catch (error) {
    return sendControllerError(error, res, next)
  }
}
export async function getHashtagController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    return res
      .status(200)
      .json({
        data: await getHashtag(
          await resolveActor(res),
          normalizeParams(req.params)
        ),
      })
  } catch (error) {
    return sendControllerError(error, res, next)
  }
}
export async function createHashtagController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    return res
      .status(201)
      .json({ data: await createHashtag(await resolveActor(res), req.body) })
  } catch (error) {
    return sendControllerError(error, res, next)
  }
}
export async function updateHashtagController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    return res
      .status(200)
      .json({
        data: await updateHashtag(
          await resolveActor(res),
          normalizeParams(req.params),
          req.body
        ),
      })
  } catch (error) {
    return sendControllerError(error, res, next)
  }
}
export async function deleteHashtagController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    return res
      .status(200)
      .json({
        data: await deleteHashtag(
          await resolveActor(res),
          normalizeParams(req.params)
        ),
      })
  } catch (error) {
    return sendControllerError(error, res, next)
  }
}
