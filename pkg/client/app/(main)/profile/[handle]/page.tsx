import { Profile } from "@/components/social"
import { createProfilePreview } from "@/features/profile/data"

export default async function ProfileHandlePage({
  params,
}: {
  params: Promise<{ handle: string }>
}) {
  const { handle } = await params
  const normalizedHandle = decodeURIComponent(handle).replace(/^@/, "")

  return (
    <Profile
      user={createProfilePreview(normalizedHandle)}
    />
  )
}
