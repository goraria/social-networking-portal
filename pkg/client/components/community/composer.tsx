"use client"

import { type ReactNode, useEffect, useRef, useState } from "react"
import Image from "next/image"
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  MessageCircle,
  MoreHorizontal,
  Repeat2,
} from "@gorth/primitive/cores/lucide"
import { Badge } from "@gorth/primitive/custom/badge"
import { Button } from "@gorth/primitive/custom/button"
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@gorth/primitive/default/carousel"
import { cn } from "@gorth/primitive/cores/cn"

import { Identify } from "@/components/community/identify"
import { formatPostDate } from "@/utils/formatter"

export interface PostMediaItem {
  id: string
  url: string
  alt: string
}

interface PostContentProps {
  variant: "post" | "tweet"
  content?: string | null
  media?: PostMediaItem[]
  type: string
  visibility: string
  status: string
  isSensitive: boolean
  className?: string
}

interface PostHeaderProps {
  name: string
  username: string
  image?: string | null
  publishedAt: string
  location?: string | null
}

interface PostFooterProps {
  replyCount: number
  repostCount: number
}

interface PostImageProps {
  media: PostMediaItem
  sizes: string
  className?: string
}

interface PostHeadingProps {
  children?: ReactNode
}

interface PostTagProps {
  children: ReactNode
  variant?: "secondary" | "destructive"
}

interface PostTagsProps {
  type: string
  visibility: string
  status: string
  isSensitive: boolean
}

export function PostImage({ media, sizes, className }: PostImageProps) {
  return (
    <div
      className={cn(
        "relative aspect-video w-full overflow-hidden bg-transparent",
        className
      )}
    >
      <Image
        src={media.url}
        alt={media.alt}
        fill
        draggable={false}
        sizes={sizes}
        className="pointer-events-none select-none object-contain"
      />
    </div>
  )
}

export function PostCarousel({ media }: { media: PostMediaItem[] }) {
  const [api, setApi] = useState<CarouselApi>()

  return (
    <Carousel
      setApi={setApi}
      opts={{ loop: true }}
      className="overflow-hidden rounded-xl"
    >
      <CarouselContent>
        {media.map((item) => (
          <CarouselItem key={item.id}>
            <PostImage
              media={item}
              sizes="(min-width: 1024px) 680px, 100vw"
            />
          </CarouselItem>
        ))}
      </CarouselContent>

      {media.length > 1 && (
        <>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="absolute top-1/2 left-4 size-9 -translate-y-1/2 active:translate-y-[-50%]"
            aria-label="Previous image"
            onClick={() => api?.scrollPrev()}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="absolute top-1/2 right-4 size-9 -translate-y-1/2 active:translate-y-[-50%]"
            aria-label="Next image"
            onClick={() => api?.scrollNext()}
          >
            <ChevronRight className="size-4" />
          </Button>
        </>
      )}
    </Carousel>
  )
}

export function PostTweetCarousel({ media }: { media: PostMediaItem[] }) {
  return (
    <Carousel opts={{ align: "start", dragFree: true }} className="w-full">
      <CarouselContent className="ml-0 gap-2 pb-2">
        {media.map((item) => (
          <CarouselItem
            key={item.id}
            className="basis-[82%] pl-0 sm:basis-[68%]"
          >
            <PostImage
              media={item}
              sizes="(min-width: 1024px) 420px, 75vw"
              className="rounded-xl border"
            />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  )
}

export function PostHeading({ children }: PostHeadingProps) {
  const headingRef = useRef<HTMLParagraphElement>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [canExpand, setCanExpand] = useState(false)

  useEffect(() => {
    const heading = headingRef.current
    if (!heading || isExpanded) return

    const updateOverflow = () => {
      setCanExpand(heading.scrollWidth > heading.clientWidth)
    }
    const observer = new ResizeObserver(updateOverflow)

    updateOverflow()
    observer.observe(heading)

    return () => observer.disconnect()
  }, [children, isExpanded])

  return (
    <div className="flex min-w-0 items-start gap-2 text-sm">
      <p
        ref={headingRef}
        className={cn(
          "min-w-0 flex-1",
          isExpanded
            ? "whitespace-pre-wrap break-words"
            : "truncate whitespace-nowrap"
        )}
      >
        {children}
      </p>
      {canExpand && (
        <Button
          type="button"
          variant="link"
          className="h-auto shrink-0 p-0 text-xs"
          onClick={() => setIsExpanded((current) => !current)}
        >
          {isExpanded ? "Show less" : "Show more"}
        </Button>
      )}
    </div>
  )
}

export function PostTag({ children, variant = "secondary" }: PostTagProps) {
  return <Badge variant={variant}>{children}</Badge>
}

export function PostTags({
  type,
  visibility,
  status,
  isSensitive,
}: PostTagsProps) {
  return (
    <div className="flex flex-wrap gap-1">
      <PostTag>{type}</PostTag>
      <PostTag>{visibility}</PostTag>
      <PostTag>{status}</PostTag>
      {isSensitive && <PostTag variant="destructive">Sensitive</PostTag>}
    </div>
  )
}

export function PostContent({
  variant,
  content,
  media,
  type,
  visibility,
  status,
  isSensitive,
  className,
}: PostContentProps) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-2", className)}>
      <PostHeading>{content}</PostHeading>
      {media?.length
        ? variant === "tweet"
          ? <PostTweetCarousel media={media} />
          : <PostCarousel media={media} />
        : null}
      <PostTags
        type={type}
        visibility={visibility}
        status={status}
        isSensitive={isSensitive}
      />
    </div>
  )
}

export function PostHeader({
  name,
  username,
  image,
  publishedAt,
  location,
}: PostHeaderProps) {
  return (
    <div className="flex h-9 min-w-0 items-start justify-between gap-2">
      <Identify
        name={name}
        username={username}
        image={image}
      />
      <div className="text-muted-foreground grid h-9 max-w-[40%] shrink-0 content-between justify-items-end text-xs">
        <span className="truncate">{formatPostDate(publishedAt)}</span>
        {location && (
          <span className="flex min-w-0 items-center gap-1">
            <MapPin className="size-3.5 shrink-0" />
            <span className="truncate">{location}</span>
          </span>
        )}
      </div>
    </div>
  )
}

export function PostFooter({ replyCount, repostCount }: PostFooterProps) {
  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost">
        <MessageCircle className="size-4" />
        {replyCount}
      </Button>
      <Button variant="ghost">
        <Repeat2 className="size-4" />
        {repostCount}
      </Button>
      <Button variant="ghost" size="icon" aria-label="More options">
        <MoreHorizontal className="size-4" />
      </Button>
    </div>
  )
}
