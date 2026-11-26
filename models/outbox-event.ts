import "server-only"
import { sql } from "drizzle-orm"
import { getDatabase } from "@/database"
import { rawSocialRows } from "@/models/index"
import { rawSocialPlatformRequest } from "@/services/social-platform"
import { appUrl } from "@/utils/environment"
export async function rawDispatchSocialEvents(onlyAggregateIds?: string[]) {
  if (!onlyAggregateIds)
    await getDatabase().transaction(async (tx) => {
      const due = await rawSocialRows(
        sql`UPDATE post SET status='published',published_at=clock_timestamp(),version=version+1 WHERE status='scheduled' AND scheduled_at<=clock_timestamp() AND deleted_at IS NULL RETURNING id,author_id`,
        tx
      )
      for (const p of due)
        await tx.execute(
          sql`INSERT INTO outbox_event(aggregate_type,aggregate_id,event_type,payload) VALUES('social',${p.id}::uuid,'post.created',${JSON.stringify({ actorId: p.author_id })}::jsonb)`
        )
      await tx.execute(
        sql`UPDATE story SET is_archived=true,status='archived' WHERE expires_at<=clock_timestamp() AND NOT is_archived`
      )
    })
  const lease = crypto.randomUUID(),
    jobs = await rawSocialRows(
      sql`WITH picked AS(SELECT id FROM outbox_event WHERE aggregate_type='social' ${
        onlyAggregateIds
          ? sql`AND aggregate_id IN (${sql.join(
              onlyAggregateIds.map((id) => sql`${id}::uuid`),
              sql`,`
            )})`
          : sql``
      } AND status<>'delivered' AND attempt_count<20 AND available_at<=clock_timestamp() AND (lease_until IS NULL OR lease_until<clock_timestamp()) ORDER BY created_at,id FOR UPDATE SKIP LOCKED LIMIT 1) UPDATE outbox_event o SET lease_token=${lease}::uuid,lease_until=clock_timestamp()+interval '180 seconds',attempt_count=attempt_count+1,status='processing' FROM picked WHERE o.id=picked.id RETURNING o.*`
    )
  let delivered = 0,
    failed = 0
  for (const job of jobs) {
    try {
      const payload = job.payload as {
        actorId: string
        insight?: boolean
        discovery?: boolean
        notification?: boolean
        notificationCursor?: string
      }
      if (!payload.insight) {
        await rawSocialPlatformRequest(
          "insight",
          "/insight/social/event",
          "POST",
          {
            idempotencyKey: job.id,
            name: job.event_type,
            resourceId: job.aggregate_id,
            occurredAt: job.created_at,
          }
        )
        payload.insight = true
      } else if (
        !payload.discovery &&
        String(job.event_type).startsWith("post.")
      ) {
        const [p] = await rawSocialRows(
          sql`SELECT p.*,e.id AS current_event_id FROM post p JOIN LATERAL(SELECT id FROM outbox_event WHERE aggregate_id=p.id AND event_type LIKE 'post.%' ORDER BY created_at DESC,id DESC LIMIT 1)e ON true WHERE p.id=${job.aggregate_id}::uuid`
        )
        if (p)
          await rawSocialPlatformRequest("discovery", "/discovery/sync", "POST", [
            {
              id: p.current_event_id,
              resourceType: "post",
              resourceId: p.id,
              revision: p.version,
              operation:
                p.deleted_at || p.status !== "published" ? "delete" : "upsert",
              ...(!p.deleted_at && p.status === "published"
                ? {
                    document: {
                      title: String(p.content ?? "").slice(0, 120) || "Post",
                      content: p.content,
                      visibility: "private",
                      sourceCreatedAt: new Date(
                        String(p.created_at)
                      ).toISOString(),
                      sourceUpdatedAt: new Date(
                        String(p.updated_at)
                      ).toISOString(),
                    },
                  }
                : {}),
            },
          ])
        payload.discovery = true
      } else if (!payload.notification) {
        let recipients: Record<string, unknown>[] = []
        if (job.event_type === "post.created")
          recipients = await rawSocialRows(
            sql`SELECT u.id,u.external_user_id,u.name,u.email FROM post p JOIN follow f ON f.following_id=p.author_id AND f.status='accepted' JOIN "user" u ON u.id=f.follower_id WHERE p.id=${job.aggregate_id}::uuid AND u.status='active' AND u.id>${payload.notificationCursor ?? "00000000-0000-0000-0000-000000000000"}::uuid AND ${postReadSqlForRecipient()} AND NOT EXISTS(SELECT 1 FROM mute m WHERE m.user_id=u.id AND m.muted_user_id=p.author_id AND (m.expires_at IS NULL OR m.expires_at>clock_timestamp())) ORDER BY u.id LIMIT 8`
          )
        else if (
          [
            "relationship.request",
            "relationship.accept",
            "relationship.follow",
          ].includes(String(job.event_type))
        )
          recipients = await rawSocialRows(
            sql`SELECT u.id,u.external_user_id,u.name,u.email FROM "user" u WHERE u.id=${job.aggregate_id}::uuid AND u.id<>${payload.actorId}::uuid AND u.status='active' AND NOT EXISTS(SELECT 1 FROM block WHERE (blocker_id=u.id AND blocked_id=${payload.actorId}::uuid) OR (blocked_id=u.id AND blocker_id=${payload.actorId}::uuid))`
          )
        for (let i = 0; i < recipients.length; i += 8)
          await Promise.all(
            recipients.slice(i, i + 8).map((r) =>
              rawSocialPlatformRequest(
                "notification",
                "/notification/event",
                "POST",
                {
                  recipientExternalUserId: r.external_user_id,
                  recipientProfile: { name: r.name, email: r.email },
                  deduplicationKey: String(job.id) + ":" + r.id,
                  type: "social.activity",
                  title: "New activity",
                  body: "Open GorMea to view your activity.",
                  actionUrl: new URL(
                    job.event_type === "post.created"
                      ? "/post/" + job.aggregate_id
                      : "/friend",
                    appUrl
                  ).href,
                  resourceType: "social",
                  resourceId: job.aggregate_id,
                  channels: ["email", "push", "web_push"],
                  payload: {},
                }
              )
            )
          )
        if (job.event_type === "post.created" && recipients.length === 8)
          payload.notificationCursor = String(recipients.at(-1)!.id)
        else payload.notification = true
      }
      const complete =
        payload.notification &&
        payload.insight &&
        (!String(job.event_type).startsWith("post.") || payload.discovery)
      await getDatabase().execute(
        sql`UPDATE outbox_event SET payload=${JSON.stringify(payload)}::jsonb,status=${complete ? "delivered" : "pending"},attempt_count=0,processed_at=${complete ? new Date().toISOString() : null}::timestamp,available_at=clock_timestamp(),lease_token=NULL,lease_until=NULL,last_error=NULL WHERE id=${job.id}::uuid AND lease_token=${lease}::uuid`
      )
      if (complete) delivered++
    } catch {
      await getDatabase().execute(
        sql`UPDATE outbox_event SET status='failed',lease_token=NULL,lease_until=NULL,available_at=clock_timestamp()+${Math.min(3600, 2 ** Math.min(Number(job.attempt_count), 12))}*interval '1 second',last_error='platform_unavailable' WHERE id=${job.id}::uuid AND lease_token=${lease}::uuid`
      )
      failed++
    }
  }
  return { claimed: jobs.length, delivered, failed }
}
// Recipient IDs come from the joined user row, never from the publisher payload.
function postReadSqlForRecipient() {
  return sql`p.status='published' AND p.deleted_at IS NULL AND p.published_at<=clock_timestamp() AND p.visibility='public' AND p.group_id IS NULL AND p.community_id IS NULL AND NOT EXISTS(SELECT 1 FROM block WHERE (blocker_id=u.id AND blocked_id=p.author_id) OR (blocked_id=u.id AND blocker_id=p.author_id))`
}
