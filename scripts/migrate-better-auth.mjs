import { readFile } from "node:fs/promises"
import nextEnv from "@next/env"
import postgres from "@gorth-com/structure/cores/postgres"

nextEnv.loadEnvConfig(process.cwd())
const { databaseUrl } = await import("../utils/environment.ts")
if (!databaseUrl) throw new Error("DATABASE_URL is required")
const database = postgres(databaseUrl, { max: 1, prepare: false })
async function domainSnapshot(transaction) {
    return transaction.unsafe(
        'SELECT (SELECT count(*) FROM public."actor") AS "actor", (SELECT count(*) FROM public."profile") AS "profile", (SELECT count(*) FROM public."profile_link") AS "profile_link", (SELECT count(*) FROM public."follow") AS "follow", (SELECT count(*) FROM public."friendship") AS "friendship", (SELECT count(*) FROM public."block") AS "block", (SELECT count(*) FROM public."mute") AS "mute", (SELECT count(*) FROM public."restriction") AS "restriction", (SELECT count(*) FROM public."close_friend") AS "close_friend", (SELECT count(*) FROM public."custom_audience") AS "custom_audience", (SELECT count(*) FROM public."custom_audience_member") AS "custom_audience_member", (SELECT count(*) FROM public."location") AS "location", (SELECT count(*) FROM public."link_preview") AS "link_preview", (SELECT count(*) FROM public."post") AS "post", (SELECT count(*) FROM public."post_audience") AS "post_audience", (SELECT count(*) FROM public."post_channel") AS "post_channel", (SELECT count(*) FROM public."post_media") AS "post_media", (SELECT count(*) FROM public."post_mention") AS "post_mention", (SELECT count(*) FROM public."post_user_tag") AS "post_user_tag", (SELECT count(*) FROM public."post_collaborator") AS "post_collaborator", (SELECT count(*) FROM public."post_repost") AS "post_repost", (SELECT count(*) FROM public."poll") AS "poll", (SELECT count(*) FROM public."poll_option") AS "poll_option", (SELECT count(*) FROM public."poll_vote") AS "poll_vote", (SELECT count(*) FROM public."story") AS "story", (SELECT count(*) FROM public."story_view") AS "story_view", (SELECT count(*) FROM public."story_reply") AS "story_reply", (SELECT count(*) FROM public."story_sticker") AS "story_sticker", (SELECT count(*) FROM public."story_archive") AS "story_archive", (SELECT count(*) FROM public."story_highlight") AS "story_highlight", (SELECT count(*) FROM public."story_highlight_item") AS "story_highlight_item", (SELECT count(*) FROM public."audio_track") AS "audio_track", (SELECT count(*) FROM public."reel_audio") AS "reel_audio", (SELECT count(*) FROM public."reel_clip") AS "reel_clip", (SELECT count(*) FROM public."reel_remix") AS "reel_remix", (SELECT count(*) FROM public."hashtag") AS "hashtag", (SELECT count(*) FROM public."post_hashtag") AS "post_hashtag", (SELECT count(*) FROM public."topic") AS "topic", (SELECT count(*) FROM public."post_topic") AS "post_topic", (SELECT count(*) FROM public."user_topic_follow") AS "user_topic_follow", (SELECT count(*) FROM public."profile_topic") AS "profile_topic", (SELECT count(*) FROM public."custom_feed") AS "custom_feed", (SELECT count(*) FROM public."custom_feed_source") AS "custom_feed_source", (SELECT count(*) FROM public."outbox_event") AS "outbox_event", (SELECT count(*) FROM public."page") AS "page", (SELECT count(*) FROM public."page_member") AS "page_member", (SELECT count(*) FROM public."page_follower") AS "page_follower", (SELECT count(*) FROM public."community") AS "community", (SELECT count(*) FROM public."community_member") AS "community_member", (SELECT count(*) FROM public."community_rule") AS "community_rule", (SELECT count(*) FROM public."community_post") AS "community_post", (SELECT count(*) FROM public."community_flair") AS "community_flair", (SELECT count(*) FROM public."group") AS "group", (SELECT count(*) FROM public."group_member") AS "group_member", (SELECT count(*) FROM public."group_rule") AS "group_rule", (SELECT count(*) FROM public."group_join_request") AS "group_join_request", (SELECT count(*) FROM public."group_post") AS "group_post", (SELECT count(*) FROM public."group_post_approval") AS "group_post_approval", (SELECT count(*) FROM public."group_ban") AS "group_ban", (SELECT count(*) FROM public."event") AS "event", (SELECT count(*) FROM public."event_host") AS "event_host", (SELECT count(*) FROM public."event_attendee") AS "event_attendee", (SELECT count(*) FROM public."event_invitation") AS "event_invitation", (SELECT count(*) FROM public."event_post") AS "event_post", (SELECT count(*) FROM public."report") AS "report", (SELECT count(*) FROM public."moderation_case") AS "moderation_case", (SELECT count(*) FROM public."moderation_action") AS "moderation_action", (SELECT count(*) FROM public."appeal") AS "appeal", (SELECT count(*) FROM public."user_strike") AS "user_strike", (SELECT count(*) FROM public."federated_instance") AS "federated_instance", (SELECT count(*) FROM public."federated_actor") AS "federated_actor", (SELECT count(*) FROM public."federated_post") AS "federated_post", (SELECT count(*) FROM public."federation_activity") AS "federation_activity", (SELECT count(*) FROM public."content_insight_daily") AS "content_insight_daily", (SELECT count(*) FROM public."content_impression") AS "content_impression", (SELECT count(*) FROM public."content_view") AS "content_view", (SELECT count(*) FROM public."feed_event") AS "feed_event", (SELECT count(*) FROM public."user_interest") AS "user_interest", (SELECT count(*) FROM public."trending_topic") AS "trending_topic", (SELECT count(*) FROM public."rate_limit") AS "rate_limit"'
    )
}

try {
    const migration = await readFile(
        new URL("../database/migrations/20261011-better-auth.sql", import.meta.url),
        "utf8"
    )
    const result = await database.begin(async (transaction) => {
        await transaction`SELECT pg_advisory_xact_lock(hashtextextended('gorth:better-auth-migration', 0))`
        const before = await transaction`SELECT id FROM public."user" ORDER BY id`
        const domainBefore = await domainSnapshot(transaction)
        await transaction.unsafe(migration)
        const after = await transaction`SELECT id FROM public."user" ORDER BY id`
        if (JSON.stringify(before) !== JSON.stringify(after))
            throw new Error("User identities changed; rollback")
        const missing =
            await transaction`SELECT count(*)::int AS count FROM public."user" u
      WHERE NOT EXISTS (SELECT 1 FROM public.account a WHERE a.user_id = u.id AND a.provider_id = 'gorth' AND a.account_id = u.external_user_id)`
        if (missing[0].count !== 0)
            throw new Error("Account bindings are incomplete; rollback")
        const domainAfter = await domainSnapshot(transaction)
        if (JSON.stringify(domainBefore) !== JSON.stringify(domainAfter))
            throw new Error("Social data changed; rollback")
        return {
            usersPreserved: after.length,
            accountBindingsVerified: true,
            socialDataPreserved: true,
        }
    })
    console.log(JSON.stringify(result))
} catch {
    console.error(
        "Migration failed; transaction rolled back. No credentials logged."
    )
    process.exitCode = 1
} finally {
    await database.end()
}
