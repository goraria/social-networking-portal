import type { NextFunction, Request, Response } from "@/lib/http"
import {
  normalizeParams,
  parsePagination,
  resolveActor,
  sendControllerError,
} from "@/utils/controller"
import {
  createFollow,
  deleteFollow,
  getFollow,
  listFollows,
  updateFollow,
} from "@/services/follows"

export async function listFollowsController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    return res
      .status(200)
      .json(
        await listFollows(await resolveActor(res), {
          limit: parsePagination(req.query.limit, "limit"),
          offset: parsePagination(req.query.offset, "offset"),
        })
      )
  } catch (error) {
    return sendControllerError(error, res, next)
  }
}
export async function getFollowController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    return res
      .status(200)
      .json({
        data: await getFollow(
          await resolveActor(res),
          normalizeParams(req.params)
        ),
      })
  } catch (error) {
    return sendControllerError(error, res, next)
  }
}
export async function createFollowController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    return res
      .status(201)
      .json({ data: await createFollow(await resolveActor(res), req.body) })
  } catch (error) {
    return sendControllerError(error, res, next)
  }
}
export async function updateFollowController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    return res
      .status(200)
      .json({
        data: await updateFollow(
          await resolveActor(res),
          normalizeParams(req.params),
          req.body
        ),
      })
  } catch (error) {
    return sendControllerError(error, res, next)
  }
}
export async function deleteFollowController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    return res
      .status(200)
      .json({
        data: await deleteFollow(
          await resolveActor(res),
          normalizeParams(req.params)
        ),
      })
  } catch (error) {
    return sendControllerError(error, res, next)
  }
}
