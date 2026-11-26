import { notFound } from "next/navigation"
import { idSchema } from "@/schemas/social"
import { Discover } from "@/features/discover"
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  if (!idSchema.safeParse(id).success) notFound()
  return <Discover section="stories" id={id} />
}
