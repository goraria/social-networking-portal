import type { Context } from "hono"
import type { ApiEnv } from "@/utils/interface"
import { resolveActor } from "@/utils/controller"
import { rawReadAppCredentials } from "@/models/session"
import { rawAssertSocialWriteAllowed } from "@/services/social-policy"
import { rawSocialError, rawCheckInteraction, rawCheckStoryAccess, rawSocialRows, rawDeniedSocialSubjects } from "@/models/index"
import { sql } from "drizzle-orm"
import * as schema from "@/schemas/social"
import {
  rawListSocialPosts as listSocialPostsServices,
  rawHideSocialPost as hideSocialPostServices,
  rawListSocialStories as listSocialStoriesServices,
  rawCreateSocialStory as createSocialStoryServices,
  rawViewSocialStory as viewSocialStoryServices,
} from "@/models/post"
import {
  rawChangeSocialRelationship as changeSocialRelationshipServices,
  rawSocialPeople as socialPeopleServices,
  rawSocialProfile as socialProfileServices,
  rawSaveSocialProfile as saveSocialProfileServices,
} from "@/models/follow"
import {
  rawListSocialHubs as listSocialHubsServices,
  rawCreateSocialHub as createSocialHubServices,
  rawChangeSocialMembership as changeSocialMembershipServices,
} from "@/services/social-hubs"
import {
  rawCreateSocialUpload as createSocialUploadServices,
  rawFinishSocialUpload as finishSocialUploadServices,
  rawSocialAssetUrl as socialAssetUrlServices,
  rawSocialStorageCredential as socialStorageCredentialServices,
} from "@/services/social-media"
import { rawVerifySocialBackend } from "@/services/social-platform"
import { rawDispatchSocialEvents as dispatchSocialEventsServices } from "@/models/outbox-event"
import { z } from "@gorth-com/structure/cores/zod"
import { rawListSocialMembers as listSocialMembersServices } from "@/services/social-members"
export async function actListSocialMembers(c: Context<ApiEnv>) {
  const query = schema.feedQuerySchema.parse(c.req.query())
  return c.json(
    await listSocialMembersServices(
      await resolveActor(c),
      z.enum(["group", "community"]).parse(c.req.param("kind")),
      id(c),
      query.offset
    ),
    200
  )
}
import { rawChangeSocialHub as changeSocialHubServices } from "@/services/social-hub-management"
export async function actChangeSocialHub(c: Context<ApiEnv>) {
  return c.json(
    {
      data: await changeSocialHubServices(
        await resolveActor(c),
        z
          .enum(["group", "community", "page", "event"])
          .parse(c.req.param("kind")),
        id(c),
        c.req.method === "DELETE"
          ? {}
          : schema.hubUpdateSchema.parse(await body(c)),
        c.req.method === "DELETE"
      ),
    },
    200
  )
}
import { rawRestrictSocialAccount as restrictSocialAccountServices } from "@/services/social-moderation"
export async function actRestrictSocialAccount(c: Context<ApiEnv>) {
  return c.json(
    {
      data: await restrictSocialAccountServices(
        await resolveActor(c),
        schema.restrictionInputSchema.parse(await body(c)),
        await token(c)
      ),
    },
    201
  )
}
import { rawGetFeedSources as getFeedSourcesServices } from "@/models/group"
export async function actGetFeedSources(c: Context<ApiEnv>) {
  return c.json(
    { data: await getFeedSourcesServices(await resolveActor(c), id(c)) },
    200
  )
}
import { rawChangeSocialStory as changeSocialStoryServices } from "@/models/story"
export async function actChangeSocialStory(c: Context<ApiEnv>) {
  return c.json(
    {
      data: await changeSocialStoryServices(
        await resolveActor(c),
        id(c),
        c.req.method === "DELETE"
          ? {}
          : schema.storyUpdateSchema.parse(await body(c)),
        c.req.method === "DELETE"
      ),
    },
    200
  )
}
import {
  rawGroupReviewQueue as groupReviewQueueServices,
  rawModerateGroupPost as moderateGroupPostServices,
  rawSaveFeedSources as saveFeedSourcesServices,
} from "@/models/group"
export async function actGroupReviewQueue(c: Context<ApiEnv>) {
  return c.json(
    await groupReviewQueueServices(await resolveActor(c), id(c)),
    200
  )
}
export async function actModerateGroupPost(c: Context<ApiEnv>) {
  const v = schema.moderationDecisionSchema.parse(await body(c))
  return c.json(
    {
      data: await moderateGroupPostServices(
        await resolveActor(c),
        id(c),
        v.decision,
        v.version
      ),
    },
    200
  )
}
export async function actSaveFeedSources(c: Context<ApiEnv>) {
  const v = schema.feedSourcesSchema.parse(await body(c))
  return c.json(
    {
      data: await saveFeedSourcesServices(
        await resolveActor(c),
        id(c),
        v.userIds
      ),
    },
    200
  )
}
import { rawReportSocialPost as reportSocialPostServices } from "@/services/social-moderation"
export async function actReportSocialPost(c: Context<ApiEnv>) {
  return c.json(
    {
      data: await reportSocialPostServices(
        await resolveActor(c),
        id(c),
        schema.reportInputSchema.parse(await body(c)),
        await token(c)
      ),
    },
    201
  )
}
import { rawSearchSocialPosts as searchSocialPostsServices } from "@/services/social-search"
export async function actSearchSocialPosts(c: Context<ApiEnv>) {
  return c.json(
    await searchSocialPostsServices(
      await resolveActor(c),
      z.string().trim().min(1).max(200).parse(c.req.query("q"))
    ),
    200
  )
}
const kindSchema = z.enum(schema.hubKinds)
async function token(c: Context<ApiEnv>) {
  const bearer = c.req.header("authorization")
  if (bearer?.startsWith("Bearer ")) return bearer.slice(7)
  const credentials = await rawReadAppCredentials(c.req.raw.headers)
  if (!credentials) rawSocialError(401, "unauthorized")
  return credentials.credentials.accessToken
}
function id(c: Context<ApiEnv>) {
  return schema.idSchema.parse(c.req.param("id"))
}
async function body(c: Context<ApiEnv>) {
  if (!c.req.header("content-type")?.includes("application/json"))
    rawSocialError(415, "json_required")
  return c.req.json()
}
export async function actListSocialPosts(c: Context<ApiEnv>) {
  return c.json(
    await listSocialPostsServices(
      await resolveActor(c),
      schema.feedQuerySchema.parse(c.req.query())
    ),
    200
  )
}
export async function actHideSocialPost(c: Context<ApiEnv>) {
  return c.json(
    { data: await hideSocialPostServices(await resolveActor(c), id(c)) },
    200
  )
}
export async function actSocialAccess(c: Context<ApiEnv>) {
  const v = schema.accessInputSchema.parse(await body(c)),
    actor = await resolveActor(c)
  if (v.resourceType === "story") {
    if (v.action !== "read") await rawAssertSocialWriteAllowed(actor.userId)
    await rawCheckStoryAccess(v.resourceId, actor.userId)
  } else await rawCheckInteraction(v.resourceId, actor.userId, v.action)
  return c.json(
    {
      allowed: true,
      deniedSubjects: await rawDeniedSocialSubjects(
        actor.userId,
        v.subjects
      ),
    },
    200
  )
}
export async function actSocialPeople(c: Context<ApiEnv>) {
  const q = schema.feedQuerySchema.parse(c.req.query())
  return c.json(
    await socialPeopleServices(await resolveActor(c), q.q, q.offset),
    200
  )
}
export async function actChangeSocialRelationship(c: Context<ApiEnv>) {
  return c.json(
    {
      data: await changeSocialRelationshipServices(
        await resolveActor(c),
        schema.relationshipSchema.parse(await body(c))
      ),
    },
    200
  )
}
export async function actSocialProfile(c: Context<ApiEnv>) {
  return c.json(
    {
      data: await socialProfileServices(
        await resolveActor(c),
        z.string().min(1).max(64).parse(c.req.param("handle"))
      ),
    },
    200
  )
}
export async function actSaveSocialProfile(c: Context<ApiEnv>) {
  return c.json(
    {
      data: await saveSocialProfileServices(
        await resolveActor(c),
        schema.profileInputSchema.parse(await body(c))
      ),
    },
    200
  )
}
export async function actSocialMe(c: Context<ApiEnv>) {
  const a = await resolveActor(c)
  const [p] = await rawSocialRows(
    sql`SELECT handle FROM profile WHERE user_id=${a.userId}::uuid`
  )
  return c.json(
    { data: p ? await socialProfileServices(a, String(p.handle)) : null },
    200
  )
}
export async function actListSocialHubs(c: Context<ApiEnv>) {
  const q = schema.feedQuerySchema.parse(c.req.query())
  return c.json(
    await listSocialHubsServices(
      await resolveActor(c),
      kindSchema.parse(c.req.param("kind")),
      q.q,
      q.offset,
      c.req.param("id") ? id(c) : undefined
    ),
    200
  )
}
export async function actCreateSocialHub(c: Context<ApiEnv>) {
  return c.json(
    {
      data: await createSocialHubServices(
        await resolveActor(c),
        schema.hubInputSchema.parse(await body(c))
      ),
    },
    201
  )
}
export async function actChangeSocialMembership(c: Context<ApiEnv>) {
  return c.json(
    {
      data: await changeSocialMembershipServices(
        await resolveActor(c),
        z
          .enum(["group", "community", "page", "event"])
          .parse(c.req.param("kind")),
        id(c),
        schema.membershipSchema.parse(await body(c))
      ),
    },
    200
  )
}
export async function actListSocialStories(c: Context<ApiEnv>) {
  return c.json(
    await listSocialStoriesServices(
      await resolveActor(c),
      schema.feedQuerySchema.parse(c.req.query()),
      c.req.query("id") ? schema.idSchema.parse(c.req.query("id")) : undefined
    ),
    200
  )
}
export async function actCreateSocialStory(c: Context<ApiEnv>) {
  return c.json(
    {
      data: await createSocialStoryServices(
        await resolveActor(c),
        c.get("auth").user.id,
        await body(c)
      ),
    },
    201
  )
}
export async function actViewSocialStory(c: Context<ApiEnv>) {
  return c.json(
    { data: await viewSocialStoryServices(await resolveActor(c), id(c)) },
    200
  )
}
export async function actCreateSocialUpload(c: Context<ApiEnv>) {
  await resolveActor(c)
  return c.json(
    {
      data: await createSocialUploadServices(
        schema.uploadSchema.parse(await body(c)),
        await token(c)
      ),
    },
    201
  )
}
export async function actFinishSocialUpload(c: Context<ApiEnv>) {
  await resolveActor(c)
  return c.json(
    {
      data: await finishSocialUploadServices(
        id(c),
        await token(c),
        c.req.method === "DELETE"
      ),
    },
    200
  )
}
export async function actSocialAssetUrl(c: Context<ApiEnv>) {
  const a = await resolveActor(c),
    result = await socialAssetUrlServices(id(c), a.userId),
    target = new URL(result.url)
  if (target.protocol !== "https:" || target.username || target.password)
    rawSocialError(503, "invalid_asset_url")
  return c.redirect(result.url, 307)
}
export async function actSocialStorageCredential(c: Context<ApiEnv>) {
  await rawVerifySocialBackend(c.req.raw, true)
  const v = z.object({ bucketName: z.string().min(1) }).parse(await body(c))
  return c.json(socialStorageCredentialServices(v.bucketName), 200)
}
export async function actDispatchSocialEvents(c: Context<ApiEnv>) {
  await rawVerifySocialBackend(c.req.raw)
  return c.json(await dispatchSocialEventsServices(), 200)
}
