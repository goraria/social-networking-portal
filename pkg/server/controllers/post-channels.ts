import type { NextFunction, Request, Response } from "@/lib/http"
import {
  normalizeParams,
  parsePagination,
  resolveActor,
  sendControllerError,
} from "@/utils/controller"
import {
  createPostChannel,
  deletePostChannel,
  getPostChannel,
  listPostChannels,
  updatePostChannel,
} from "@/services/post-channels"

export async function listPostChannelsController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    return res
      .status(200)
      .json(
        await listPostChannels(await resolveActor(res), {
          limit: parsePagination(req.query.limit, "limit"),
          offset: parsePagination(req.query.offset, "offset"),
        })
      )
  } catch (error) {
    return sendControllerError(error, res, next)
  }
}
export async function getPostChannelController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    return res
      .status(200)
      .json({
        data: await getPostChannel(
          await resolveActor(res),
          normalizeParams(req.params)
        ),
      })
  } catch (error) {
    return sendControllerError(error, res, next)
  }
}
export async function createPostChannelController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    return res
      .status(201)
      .json({
        data: await createPostChannel(await resolveActor(res), req.body),
      })
  } catch (error) {
    return sendControllerError(error, res, next)
  }
}
export async function updatePostChannelController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    return res
      .status(200)
      .json({
        data: await updatePostChannel(
          await resolveActor(res),
          normalizeParams(req.params),
          req.body
        ),
      })
  } catch (error) {
    return sendControllerError(error, res, next)
  }
}
export async function deletePostChannelController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    return res
      .status(200)
      .json({
        data: await deletePostChannel(
          await resolveActor(res),
          normalizeParams(req.params)
        ),
      })
  } catch (error) {
    return sendControllerError(error, res, next)
  }
}
