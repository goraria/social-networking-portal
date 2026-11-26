import { notFound } from "next/navigation"
import { Discover } from "@/features/discover"
import { entries } from "@/features/discover/data"

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!entries.groups.some((entry) => entry.id === id)) notFound()
  return <Discover section="groups" id={id} />
}
