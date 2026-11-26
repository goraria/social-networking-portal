import Image from "next/image"
import { Button } from "@gorth/primitive/custom/button"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@gorth/primitive/custom/tabs"
import { Card } from "@gorth/primitive/default/card"
import {
  Identify,
  IdentifyAvatar,
  Post,
  PostContent,
  PostFooter,
  PostHeader,
  Tweet,
} from "@/components/community"
import { suggestedProfiles } from "@/components/social/data"
import { previewPosts } from "@/features/post/data"

interface ProfileProps {
  user: {
    name: string
    email: string
    username?: string | null
    avatar?: string | null
    image?: string | null
    bio?: string
    followerCount?: number
    followingCount?: number
  }
}

const profileTabs = [
  { value: "media", label: "Media" },
  { value: "community", label: "Community" },
  { value: "friends", label: "Friends" },
  { value: "groups", label: "Groups" },
  { value: "events", label: "Events" },
  { value: "about", label: "About" },
] as const

export function Profile({ user }: ProfileProps) {
  const username = user.username ?? user.email.split("@")[0] ?? "visitor"
  const handle = `@${username}`
  const avatar = user.avatar ?? user.image
  const bio =
    user.bio ??
    "Making things, collecting moments, and finding the good stuff in between."
  const profileMedia = previewPosts.flatMap((post) => post.media ?? [])

  return (
    <section className="flex min-w-0 flex-col gap-4">
      <Card className="overflow-hidden py-0">
        <div className="bg-primary/15 h-40" />
        <div className="p-5">
          <div className="-mt-16 flex items-end justify-between">
            <IdentifyAvatar
              name={user.name}
              src={avatar}
              size="lg"
              className="ring-background size-24 ring-4"
            />
            <Button variant="outline">Edit profile</Button>
          </div>

          <h1 className="mt-4 text-2xl font-semibold">{user.name}</h1>
          <p className="text-muted-foreground text-sm">{handle}</p>
          <p className="mt-4 max-w-md text-sm leading-6">
            {bio}
          </p>
          <div className="mt-5 flex gap-6 text-sm">
            <span>
              <strong>{user.followingCount ?? 248}</strong>{" "}
              <span className="text-muted-foreground">Following</span>
            </span>
            <span>
              <strong>{user.followerCount?.toLocaleString() ?? "1.8k"}</strong>{" "}
              <span className="text-muted-foreground">Followers</span>
            </span>
          </div>
        </div>
      </Card>

      <Tabs defaultValue="media" className="w-full">
        <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <TabsList className="w-max justify-start">
            {profileTabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value="media" className="pt-4">
          <div className="grid grid-cols-3 gap-1">
            {profileMedia.map((media, index) => (
              <div
                key={media.id}
                className="relative aspect-square overflow-hidden rounded-md"
              >
                <Image
                  fill
                  sizes="(min-width: 768px) 220px, 33vw"
                  src={media.url}
                  alt={`${user.name} media ${index + 1}`}
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="community" className="space-y-6 pt-4">
          {previewPosts.slice(0, 6).map((post) => {
            const header = (
              <PostHeader
                name={user.name}
                username={handle}
                image={avatar}
                publishedAt={post.publishedAt}
                location={post.location}
              />
            )
            const content = (
              <PostContent
                variant={post.type === "tweet" ? "tweet" : "post"}
                content={post.content}
                media={post.media}
                type={post.type}
                visibility={post.visibility}
                status={post.status}
                isSensitive={post.isSensitive}
                className={post.type === "tweet" ? "pl-[46px]" : undefined}
              />
            )
            const footer = (
              <PostFooter
                replyCount={post.replyCount}
                repostCount={post.repostCount}
              />
            )

            return post.type === "tweet" ? (
              <Tweet
                key={post.id}
                header={header}
                content={content}
                footer={footer}
              />
            ) : (
              <Post
                key={post.id}
                header={header}
                content={content}
                footer={footer}
              />
            )
          })}
        </TabsContent>

        <TabsContent value="friends" className="pt-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {suggestedProfiles.map((profile) => (
              <div key={profile.id} className="flex items-center gap-2.5">
                <Identify
                  name={profile.name}
                  username={profile.handle}
                  image={profile.avatar}
                  className="flex-1"
                />
                <Button variant="outline" size="sm">
                  View
                </Button>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="groups" className="pt-4">
          <p className="text-muted-foreground text-sm">
            Groups joined by {user.name} will appear here.
          </p>
        </TabsContent>

        <TabsContent value="events" className="pt-4">
          <p className="text-muted-foreground text-sm">
            Upcoming and past events will appear here.
          </p>
        </TabsContent>

        <TabsContent value="about" className="pt-4">
          <dl className="grid gap-3 text-sm sm:grid-cols-[8rem_1fr]">
            <dt className="text-muted-foreground">Username</dt>
            <dd>{handle}</dd>
            <dt className="text-muted-foreground">Bio</dt>
            <dd>
              {bio}
            </dd>
          </dl>
        </TabsContent>
      </Tabs>
    </section>
  )
}
