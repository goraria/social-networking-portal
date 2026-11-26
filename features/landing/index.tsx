"use client"

import Link from "next/link"
import {
  ArrowRight,
  MessageCircle,
  ShieldCheck,
  Users,
} from "@gorth-com/primitive/cores/lucide"
import { Badge } from "@gorth-com/primitive/custom/badge"
import { Button } from "@gorth-com/primitive/custom/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@gorth-com/primitive/default/card"

import { useAuth } from "@/hooks/use-auth"

const features = [
  {
    title: "Share naturally",
    description: "Publish rich posts or concise tweets from the same account.",
    icon: MessageCircle,
  },
  {
    title: "Find your people",
    description:
      "Follow creators, join conversations, and discover communities.",
    icon: Users,
  },
  {
    title: "Stay in control",
    description: "Choose who can view, reply to, and interact with every post.",
    icon: ShieldCheck,
  },
]

export function Landing() {
  const auth = useAuth()

  return (
    <div className="flex flex-1 flex-col gap-20 py-10 md:py-20">
      <section className="mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-2">
        <div className="flex flex-col items-start gap-6">
          <Badge variant="secondary">A simpler social space</Badge>
          <div className="space-y-4">
            <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Share what matters. Keep the conversation moving.
            </h1>
            <p className="max-w-2xl leading-7 text-base text-muted-foreground sm:text-lg">
              GorMea brings posts, short-form thoughts, communities, and the
              people you follow into one focused experience.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {auth.authenticated ? (
              <Button nativeButton={false} render={<Link href="/post" />}>
                Open your feed
                <ArrowRight className="size-4" />
              </Button>
            ) : (
              <Button
                onClick={() => auth.login("/post")}
                disabled={auth.loading || auth.signingIn}
              >
                Get started
                <ArrowRight className="size-4" />
              </Button>
            )}
            <Button
              nativeButton={false}
              render={<Link href="#features" />}
              variant="outline"
            >
              Learn more
            </Button>
          </div>
        </div>

        <Card className="overflow-hidden bg-primary/5">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                G
              </div>
              <div className="min-w-0">
                <CardTitle>Goraria</CardTitle>
                <CardDescription>@goraria · just now</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <p className="text-lg leading-7">
              Building a calmer place for ideas, updates, and real
              conversations.
            </p>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-lg bg-background p-3">
                <p className="font-semibold">Posts</p>
                <p className="text-xs text-muted-foreground">Tell the story</p>
              </div>
              <div className="rounded-lg bg-background p-3">
                <p className="font-semibold">Tweets</p>
                <p className="text-xs text-muted-foreground">Keep it quick</p>
              </div>
              <div className="rounded-lg bg-background p-3">
                <p className="font-semibold">Groups</p>
                <p className="text-xs text-muted-foreground">
                  Meet your people
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section id="features" className="mx-auto w-full max-w-6xl scroll-mt-24">
        <div className="mb-8 max-w-2xl space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            One identity, two ways to share
          </h2>
          <p className="text-muted-foreground">
            Use posts when you need room and tweets when the thought should stay
            short. Both use the same social graph and privacy controls.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title}>
              <CardHeader>
                <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <feature.icon className="size-5" />
                </div>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
