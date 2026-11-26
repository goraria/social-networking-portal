import "server-only"
import { Hono } from "hono"

import { actSocialStorageCredential } from "@/controllers/social"

export const internalRoutes = new Hono()
internalRoutes.post("/storage/credential", actSocialStorageCredential)
