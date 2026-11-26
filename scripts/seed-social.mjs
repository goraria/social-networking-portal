import nextEnv from "@next/env"
import postgres from "@gorth-com/structure/cores/postgres"
import { fileURLToPath } from "node:url"
nextEnv.loadEnvConfig(fileURLToPath(new URL("../", import.meta.url)), true)
const { databaseUrl } = await import("../utils/environment.ts")
if (!databaseUrl) throw new Error("DATABASE_URL is required")
const db = postgres(databaseUrl, {
    max: 1,
    prepare: false,
    connect_timeout: 10,
    onnotice() { },
})
// Fixed namespace; never delete by names/email patterns or truncate existing tables.
const id = (kind, n) =>
    `5eeda110-0000-4000-8000-${String(kind * 100 + n).padStart(12, "0")}`
const topics = [
    "Creative coding",
    "Photography",
    "Reading circle",
    "Urban gardens",
    "Healthy cooking",
    "Independent films",
    "Community music",
    "Digital privacy",
    "Local travel",
    "Open source",
]
try {
    await db.begin(async (tx) => {
        for (let n = 1; n <= 10; n++) {
            const uid = id(1, n),
                handle = `gorth_seed_${n}`
            await tx`INSERT INTO "user"(id,external_user_id,email,name,username,metadata) VALUES(${uid},${"seed-social-v1-" + n},${"seed-social-" + n + "@example.invalid"},${"GorMea contributor " + n},${handle},${JSON.stringify({ seed: "gorth-social-v1" })}) ON CONFLICT(id) DO NOTHING`
        }
        for (let n = 1; n <= 10; n++) {
            const uid = id(1, n),
                handle = `gorth_seed_${n}`
            await tx`INSERT INTO profile(user_id,handle,bio) VALUES(${uid},${handle},${"Seed collection: " + topics[n - 1]}) ON CONFLICT(user_id) DO NOTHING`
            await tx`INSERT INTO actor(id,type,user_id,handle,display_name,metadata) VALUES(${id(2, n)},'user',${uid},${handle},${"GorMea contributor " + n},${JSON.stringify({ seed: "gorth-social-v1" })}) ON CONFLICT(id) DO NOTHING`
            for (const [kind, k] of [
                ["group", 3],
                ["community", 4],
                ["page", 5],
            ]) {
                await tx`INSERT INTO actor(id,type,handle,display_name,metadata) VALUES(${id(k + 10, n)},${kind},${"gorth_seed_" + kind + "_" + n},${topics[n - 1]},${JSON.stringify({ seed: "gorth-social-v1" })}) ON CONFLICT(id) DO NOTHING`
                await tx.unsafe(
                    `INSERT INTO "${kind}"(id,actor_id,owner_id,name,description) VALUES($1,$2,$3,$4,$5) ON CONFLICT(id) DO NOTHING`,
                    [
                        id(k, n),
                        id(k + 10, n),
                        uid,
                        topics[n - 1],
                        "Seed collection with persisted membership and access rules.",
                    ]
                )
                await tx.unsafe(
                    `INSERT INTO "${kind}_member"(${kind}_id,user_id,role) VALUES($1,$2,'owner') ON CONFLICT DO NOTHING`,
                    [id(k, n), uid]
                )
            }
            await tx`INSERT INTO topic(id,slug,name,description) VALUES(${id(6, n)},${"gorth-seed-" + n},${topics[n - 1]},'GorMea seed topic') ON CONFLICT(id) DO NOTHING`
            await tx`INSERT INTO event(id,creator_id,name,description,starts_at,ends_at) VALUES(${id(7, n)},${uid},${topics[n - 1] + " meetup"},'Seed event: RSVP is persisted.',clock_timestamp()+interval '7 days',clock_timestamp()+interval '7 days 2 hours') ON CONFLICT(id) DO NOTHING`
            await tx`INSERT INTO event_attendee(event_id,user_id,response) VALUES(${id(7, n)},${uid},'going') ON CONFLICT DO NOTHING`
            await tx`INSERT INTO custom_feed(id,owner_id,name) VALUES(${id(8, n)},${uid},${topics[n - 1]}) ON CONFLICT(id) DO NOTHING`
            for (const [type, k] of [
                ["standard", 20],
                ["tweet", 21],
            ]) {
                await tx`INSERT INTO post(id,author_id,type,content,client_request_id) VALUES(${id(k, n)},${uid},${type},${topics[n - 1] + ": Share practical ideas, ask thoughtful questions, and respect each participant. This is an explicitly seeded GorMea example."},${id(k, n)}) ON CONFLICT(id) DO NOTHING`
                // Index persisted seed content once; update events do not fan out notifications.
                await tx`INSERT INTO outbox_event(id,aggregate_type,aggregate_id,event_type,payload) VALUES(${id(k + 3, n)},'social',${id(k, n)},'post.updated',${JSON.stringify({ actorId: uid })}) ON CONFLICT(id) DO NOTHING`
            }
            await tx`INSERT INTO custom_feed_source(id,feed_id,source_type,source_id) VALUES(${id(22, n)},${id(8, n)},'user',${uid}) ON CONFLICT DO NOTHING`
            const next = id(1, n === 10 ? 1 : n + 1)
            await tx`INSERT INTO follow(follower_id,following_id) VALUES(${uid},${next}) ON CONFLICT DO NOTHING`
            await tx`INSERT INTO friendship(requester_id,addressee_id,status,user_low_id,user_high_id) VALUES(${uid},${next},'accepted',LEAST(${uid}::uuid,${next}::uuid),GREATEST(${uid}::uuid,${next}::uuid)) ON CONFLICT DO NOTHING`
        }
    })
    console.log(
        "Seed complete: 10 contributors, profiles, user actors, groups, communities, pages, topics, events, RSVPs, personal feeds, standard posts, tweets, follows and friendships. No fake media/provider rows or login grants created."
    )
} catch (error) {
    console.error("Seed failed", {
        code: typeof error?.code === "string" ? error.code : "unknown",
        schemaDetail:
            typeof error?.message === "string"
                ? error.message.match(/(?:column|relation) "[a-z_]+"[^\n]{0,90}/)?.[0]
                : undefined,
    })
    process.exitCode = 1
} finally {
    await db.end()
}
