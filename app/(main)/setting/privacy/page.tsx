import Link from "next/link"
export default function Page() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Privacy</h1>
      <p>
        GorMea stores posts on the server. This service does not provide
        end-to-end encryption. Private posts and media require current
        permission; blocking prevents new access in both directions.
      </p>
      <p>
        Already downloaded content cannot be revoked. A signed media link can
        remain valid for up to 60 seconds. Stories expire within 24 hours;
        storage retention is managed separately in Media.
      </p>
      <Link href="/profile">Manage profile visibility</Link>
      <br />
      <Link href="/friend">Manage friends, following and blocks</Link>
      <br />
      <Link href="/moderation">Safety reports and appeals</Link>
    </section>
  )
}
