import type { NextFunction, Request, Response } from "@/lib/http"
import {
  normalizeParams,
  parsePagination,
  resolveActor,
  sendControllerError,
} from "@/utils/controller"
import {
  createProfile,
  deleteProfile,
  getProfile,
  getProfileByHandle,
  listProfiles,
  updateProfile,
} from "@/services/profiles"

export async function listProfilesController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    return res.status(200).json(
      await listProfiles(await resolveActor(res), {
        limit: parsePagination(req.query.limit, "limit"),
        offset: parsePagination(req.query.offset, "offset"),
      })
    )
  } catch (error) {
    return sendControllerError(error, res, next)
  }
}
export async function getProfileController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { handle } = normalizeParams(req.params)

    if (!handle) {
      return res.status(400).json({ error: "profile_handle_required" })
    }

    return res.status(200).json({ data: await getProfileByHandle(handle) })
  } catch (error) {
    return sendControllerError(error, res, next)
  }
}
export async function getCurrentProfileController(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const actor = await resolveActor(res)

    return res
      .status(200)
      .json({ data: await getProfile(actor, { userId: actor.userId }) })
  } catch (error) {
    return sendControllerError(error, res, next)
  }
}
export async function createProfileController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    return res
      .status(201)
      .json({ data: await createProfile(await resolveActor(res), req.body) })
  } catch (error) {
    return sendControllerError(error, res, next)
  }
}
export async function updateProfileController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    return res.status(200).json({
      data: await updateProfile(
        await resolveActor(res),
        normalizeParams(req.params),
        req.body
      ),
    })
  } catch (error) {
    return sendControllerError(error, res, next)
  }
}
export async function deleteProfileController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    return res.status(200).json({
      data: await deleteProfile(
        await resolveActor(res),
        normalizeParams(req.params)
      ),
    })
  } catch (error) {
    return sendControllerError(error, res, next)
  }
}
