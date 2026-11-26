import { faker } from "@faker-js/faker"

import type { Post } from "@/schemas/post"

export interface TimelinePostAuthor {
  name: string
  username: string
  image: string
}

export interface TimelinePostMedia {
  id: string
  url: string
  alt: string
}

export interface TimelinePost extends Post {
  author?: TimelinePostAuthor
  media?: TimelinePostMedia[]
}

faker.seed(20260914)

const authors: (TimelinePostAuthor & { id: string })[] = Array.from(
  { length: 6 },
  () => {
    const firstName = faker.person.firstName()
    const lastName = faker.person.lastName()

    return {
      id: faker.string.uuid(),
      name: faker.person.fullName({ firstName, lastName }),
      username: faker.internet
        .username({ firstName, lastName })
        .toLowerCase(),
      image: faker.image.avatar(),
    }
  }
)

export const previewPosts: TimelinePost[] = Array.from(
  { length: 12 },
  (_, index): TimelinePost => {
    const author = authors[index % authors.length]
    const publishedAt = faker.date
      .between({
        from: "2026-09-12T06:30:00.000Z",
        to: "2026-09-14T06:30:00.000Z",
      })
      .toISOString()
    const media = Array.from(
      { length: faker.number.int({ min: 1, max: 4 }) },
      (): TimelinePostMedia => ({
        id: faker.string.uuid(),
        url: faker.image.urlPicsumPhotos({
          width: 1200,
          height: 900,
          blur: 0,
          grayscale: false,
        }),
        alt: faker.lorem.words({ min: 3, max: 6 }),
      })
    )

    return {
      id: faker.string.uuid(),
      authorId: author.id,
      authorActorId: null,
      author: {
        name: author.name,
        username: author.username,
        image: author.image,
      },
      media,
      type: index % 3 === 0 ? "tweet" : "standard",
      format: media.length > 1 ? "carousel" : "image",
      status: "published",
      visibility: index % 5 === 0 ? "followers" : "public",
      replyPolicy: "everyone",
      quotePolicy: "everyone",
      rootPostId: null,
      parentPostId: null,
      quotedPostId: null,
      repostOfId: null,
      content: faker.lorem.paragraph({ min: 1, max: 2 }),
      location:
        index % 3 === 0
          ? `${faker.location.city()}, ${faker.location.country()}`
          : null,
      locationId: null,
      linkPreviewId: null,
      languageCode: "en",
      isSensitive: false,
      replyCount: faker.number.int({ min: 0, max: 180 }),
      repostCount: faker.number.int({ min: 0, max: 90 }),
      quoteCount: faker.number.int({ min: 0, max: 40 }),
      viewCount: faker.number.int({ min: 200, max: 50_000 }),
      scheduledAt: null,
      editedAt: null,
      publishedAt,
      createdAt: publishedAt,
      updatedAt: publishedAt,
      deletedAt: null,
      archivedAt: null,
    }
  }
).sort(
  (left, right) =>
    new Date(right.publishedAt).getTime() -
    new Date(left.publishedAt).getTime()
)
