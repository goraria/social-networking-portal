"use client"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@gorth-com/primitive/default/card"
import { NavIdentity } from "@gorth-com/primitive/dashboard/nav-user"
import {
  useSocialQuery,
  type SocialPage,
  type SocialPerson,
} from "@/queries/social"
export function Toolbar({
  currentUser,
}: {
  currentUser: { name: string; handle: string; avatar?: string | null }
}) {
  const q = useSocialQuery<SocialPage<SocialPerson>>("/social/people")
  return (
    <aside className="hidden space-y-4 lg:block">
      <Card>
        <CardHeader>
          <CardTitle>Discover people</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <NavIdentity
            user={{ name: currentUser.name, avatar: currentUser.avatar }}
            description={currentUser.handle}
            url="/profile"
          />
          {q.data?.data.slice(0, 6).map((p) => (
            <NavIdentity
              key={p.id}
              user={{ name: p.name, avatar: p.image }}
              description={p.handle ? "@" + p.handle : undefined}
              url={p.handle ? "/profile/" + p.handle : undefined}
            />
          ))}
          {q.isError && (
            <p className="text-sm text-muted-foreground">
              People are unavailable.
            </p>
          )}
        </CardContent>
      </Card>
    </aside>
  )
}
