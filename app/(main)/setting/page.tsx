import Link from "next/link"
export default function Page() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Settings</h1>
      <nav className="flex flex-col gap-3">
        <Link href="/profile">Profile and visibility</Link>
        <Link href="/setting/notification">Notification preferences</Link>
        <Link href="/setting/privacy">Privacy</Link>
        <Link href="/billing">Plans and billing</Link>
        <Link href="/moderation">Safety and appeals</Link>
      </nav>
    </section>
  )
}
