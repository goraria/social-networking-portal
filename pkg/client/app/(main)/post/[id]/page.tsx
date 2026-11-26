import { notFound } from "next/navigation"
import { Discover } from "@/features/discover"
import { entries } from "@/features/discover/data"

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!entries.posts.some((entry) => entry.id === id)) notFound()
  return <Discover section="posts" id={id} />
}
