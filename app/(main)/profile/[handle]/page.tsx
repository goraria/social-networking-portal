import { Profile } from "@/components/social/profile"
export default async function Page({
  params,
}: {
  params: Promise<{ handle: string }>
}) {
  const { handle } = await params
  return <Profile handle={handle} />
}
