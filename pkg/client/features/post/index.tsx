"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Globe2,
  ImagePlus,
  MessageCircle,
  Plus,
  Send,
} from "@gorth/primitive/cores/lucide"
import { Button } from "@gorth/primitive/custom/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@gorth/primitive/default/select"
import { Card, CardContent } from "@gorth/primitive/default/card"
import { Checkbox } from "@gorth/primitive/default/checkbox"
import { Input } from "@gorth/primitive/default/input"
import { Label } from "@gorth/primitive/default/label"
import { Textarea } from "@gorth/primitive/default/textarea"
import { toast } from "@gorth/primitive/custom/toast"
import { Spinner } from "@gorth/primitive/pattern/spinner"

import {
  Identify,
  IdentifyAvatar,
  Post,
  PostContent,
  PostHeader,
  Tweet,
} from "@/components/community"
import { previewPosts, type TimelinePost } from "@/features/post/data"
import { PostInteractions } from "@/features/post/interactions"
import { useUser } from "@/hooks/use-user"
import {
  interactionPolicies,
  postVisibilities,
} from "@/schemas/post"
import { useCreatePost, usePostList } from "@/services/post"

type TimelineVariant = "post" | "tweet"
type Visibility = (typeof postVisibilities)[number]
type InteractionPolicy = (typeof interactionPolicies)[number]

interface PostComposerProps {
  variant: TimelineVariant
  name: string
  avatar?: string | null
}

function PostComposer({ variant, name, avatar }: PostComposerProps) {
  const [content, setContent] = useState("")
  const [location, setLocation] = useState("")
  const [languageCode, setLanguageCode] = useState("en")
  const [visibility, setVisibility] = useState<Visibility>("public")
  const [replyPolicy, setReplyPolicy] =
    useState<InteractionPolicy>("everyone")
  const [isSensitive, setIsSensitive] = useState(false)
  const [createPost, createState] = useCreatePost()

  async function submitPost() {
    const value = content.trim()
    if (!value || createState.isLoading) return

    try {
      await createPost({
        type: variant === "tweet" ? "tweet" : "standard",
        format: "text",
        status: "published",
        visibility,
        replyPolicy,
        quotePolicy: "everyone",
        content: value,
        location: location.trim() || null,
        languageCode: languageCode.trim() || null,
        isSensitive,
      }).unwrap()
      setContent("")
      setLocation("")
      setIsSensitive(false)
      toast.add({
        type: "success",
        description: variant === "tweet" ? "Tweet published" : "Post published",
      })
    } catch (error) {
      toast.add({
        type: "error",
        description: error instanceof Error ? error.message : "Unable to publish",
      })
    }
  }

  return (
    <Card size="sm">
      <CardContent>
        <div className="flex gap-3">
          <IdentifyAvatar name={name} src={avatar} />
          <Textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder={
              variant === "tweet" ? "What is happening?" : "Share something..."
            }
            className="min-h-32 resize-y"
            maxLength={10_000}
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="grid gap-1.5">
            <Label htmlFor={`${variant}-location`}>Location</Label>
            <Input
              id={`${variant}-location`}
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              placeholder="Optional location"
              maxLength={255}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor={`${variant}-language`}>Language</Label>
            <Input
              id={`${variant}-language`}
              value={languageCode}
              onChange={(event) => setLanguageCode(event.target.value)}
              placeholder="en"
              maxLength={16}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={visibility}
            onValueChange={(value) => setVisibility(value as Visibility)}
          >
            <SelectTrigger aria-label="Post visibility">
              <Globe2 className="size-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {postVisibilities.map((value) => (
                <SelectItem key={value} value={value}>
                  {value.replace("_", " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={replyPolicy}
            onValueChange={(value) => setReplyPolicy(value as InteractionPolicy)}
          >
            <SelectTrigger aria-label="Reply policy">
              <MessageCircle className="size-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {interactionPolicies.map((value) => (
                <SelectItem key={value} value={value}>
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Label className="flex h-9 items-center gap-2 rounded-md border px-2.5">
            <Checkbox
              checked={isSensitive}
              onCheckedChange={(checked) => setIsSensitive(checked === true)}
            />
            Sensitive
          </Label>

          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" size="icon" disabled aria-label="Add media">
              <ImagePlus className="size-4" />
            </Button>
            <Button
              onClick={() => void submitPost()}
              disabled={!content.trim() || createState.isLoading}
            >
              <Send className="size-4" />
              {variant === "tweet" ? "Tweet" : "Post"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface PostItemProps {
  post: TimelinePost
  variant: TimelineVariant
  currentUser: {
    id: string
    name: string
    username: string | null
    image: string | null
  }
}

function PostItem({ post, variant, currentUser }: PostItemProps) {
  const isCurrentUser = post.authorId === currentUser.id
  const name = isCurrentUser
    ? currentUser.name
    : (post.author?.name ?? "Social user")
  const handle = isCurrentUser
    ? `@${currentUser.username ?? "user"}`
    : `@${post.author?.username ?? post.authorId.slice(0, 8)}`
  const image = isCurrentUser ? currentUser.image : post.author?.image

  const header = (
    <PostHeader
      name={name}
      username={handle}
      image={image}
      publishedAt={post.publishedAt}
      location={post.location}
    />
  )
  const content = (
    <PostContent
      variant={variant}
      content={post.content}
      media={post.media}
      type={post.type}
      visibility={post.visibility}
      status={post.status}
      isSensitive={post.isSensitive}
      className={variant === "tweet" ? "pl-[46px]" : undefined}
    />
  )
  const footer = (
    <PostInteractions
      postId={post.id}
      resourceType={post.type === "tweet" ? "tweet" : "post"}
      fallbackReplyCount={post.replyCount}
      fallbackRepostCount={post.repostCount}
    />
  )

  return variant === "post" ? (
    <Post header={header} content={content} footer={footer} />
  ) : (
    <Tweet header={header} content={content} footer={footer} />
  )
}

export function PostTimeline({ variant }: { variant: TimelineVariant }) {
  const { user, isLoading } = useUser()
  const query = usePostList({ enabled: Boolean(user), limit: 50 })
  const posts: TimelinePost[] = [...(query.data ?? []), ...previewPosts]

  if (isLoading || !user) {
    return (
      <div className="flex min-h-48 items-center justify-center">
        <Spinner variant="infinite" size={24} />
      </div>
    )
  }

  return (
    <section className="flex min-w-0 flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <Identify
          name={user.name}
          username={user.username ?? "user"}
          image={user.image}
        />
        <Button
          nativeButton={false}
          render={<Link href={`/create?type=${variant}`} />}
        >
          <Plus className="size-4" />
          Create
        </Button>
      </div>

      {posts.length ? (
        <div className="flex flex-col gap-4 lg:gap-6">
          {posts.map((post) => (
            <PostItem
              key={post.id}
              post={post}
              variant={variant}
              currentUser={user}
            />
          ))}
        </div>
      ) : (
        <Card size="sm">
          <CardContent className="text-muted-foreground py-6 text-center">
            No {variant === "tweet" ? "tweets" : "posts"} yet. Create the first one.
          </CardContent>
        </Card>
      )}
    </section>
  )
}

export function CreatePost({
  initialVariant = "post",
}: {
  initialVariant?: TimelineVariant
}) {
  const { user, isLoading } = useUser()
  const [variant, setVariant] = useState<TimelineVariant>(initialVariant)

  if (isLoading || !user) {
    return (
      <div className="flex min-h-48 items-center justify-center">
        <Spinner variant="infinite" size={24} />
      </div>
    )
  }

  return (
    <section className="flex min-w-0 flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Create</h1>
          <p className="text-sm text-muted-foreground">
            Choose how this update should appear in the feed.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={variant === "post" ? "default" : "outline"}
            onClick={() => setVariant("post")}
          >
            Post
          </Button>
          <Button
            variant={variant === "tweet" ? "default" : "outline"}
            onClick={() => setVariant("tweet")}
          >
            Tweet
          </Button>
        </div>
      </div>

      <PostComposer
        variant={variant}
        name={user.name}
        avatar={user.image}
      />
    </section>
  )
}
