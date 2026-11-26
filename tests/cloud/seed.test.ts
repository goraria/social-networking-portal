import { afterAll, expect, it } from "vitest"
import { sql } from "drizzle-orm"
import { getDatabase } from "@/database"
import { rawSocialRows } from "@/models/index"
const id = (kind: number, n: number) =>
  `5eeda110-0000-4000-8000-${String(kind * 100 + n).padStart(12, "0")}`
it.each([
  ["user", 1],
  ["actor", 2],
  ["group", 3],
  ["community", 4],
  ["page", 5],
  ["topic", 6],
  ["event", 7],
  ["custom_feed", 8],
  ["post", 20],
  ["post", 21],
  ["custom_feed_source", 22],
  ["outbox_event", 23],
  ["outbox_event", 24],
] as const)(
  "has ten persisted seed records in %s, kind %s",
  async (table, kind) => {
    const [row] = await rawSocialRows(
      sql`SELECT count(*)::int n FROM ${sql.identifier(table)} WHERE id IN (${sql.join(
        Array.from({ length: 10 }, (_, n) => sql`${id(kind, n + 1)}::uuid`),
        sql`,`
      )})`
    )
    expect(row.n).toBe(10)
  }
)
it("has ten profiles and ten canonical relationships without generating fake identities", async () => {
  for (const [table, column] of [
    ["profile", "user_id"],
    ["follow", "follower_id"],
    ["friendship", "requester_id"],
  ] as const) {
    const [row] = await rawSocialRows(
      sql`SELECT count(*)::int n FROM ${sql.identifier(table)} WHERE ${sql.identifier(column)} IN (${sql.join(
        Array.from({ length: 10 }, (_, n) => sql`${id(1, n + 1)}::uuid`),
        sql`,`
      )})`
    )
    expect(row.n).toBe(10)
  }
})
afterAll(async () => {
  await getDatabase().$client.end()
})
