import { CreatePost } from "@/features/post"

interface PageProps {
  searchParams: Promise<{ type?: string | string[] }>
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams
  const type = Array.isArray(params.type) ? params.type[0] : params.type

  return <CreatePost initialVariant={type === "tweet" ? "tweet" : "post"} />
}
