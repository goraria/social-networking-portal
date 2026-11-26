"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { LoadingScreen } from "@/features/shared/loading"
import { useUser } from "@/hooks/use-user"
import { useCurrentProfileQuery } from "@/services/profile"

export default function ProfilePage() {
  const router = useRouter()
  const { user, isLoading } = useUser()
  const profileQuery = useCurrentProfileQuery({
    enabled: Boolean(user),
    userId: user?.id,
  })

  useEffect(() => {
    if (profileQuery.data?.handle) {
      router.replace(
        `/profile/${encodeURIComponent(profileQuery.data.handle)}`
      )
    }
  }, [profileQuery.data?.handle, router])

  return <LoadingScreen className={isLoading ? undefined : "bg-background"} />
}
