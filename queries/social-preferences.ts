"use client"
import { caller } from "@/utils/caller"
export interface SocialPreference {
  notificationType: string
  channel: string
  enabled: boolean
  mutedUntil: string | null
}
export async function socialNotificationPreferences() {
  return caller<SocialPreference[]>({
    url: "/external/notification/preference",
    baseURL: null,
    cache: "no-store",
  })
}
export async function setSocialNotificationPreference(
  channel: string,
  enabled: boolean
) {
  for (const type of ["*", "social.message"])
    await caller({
      url: "/external/notification/preference",
      baseURL: null,
      method: "PUT",
      body: { type, channel, enabled, mutedUntil: null, metadata: {} },
    })
}
