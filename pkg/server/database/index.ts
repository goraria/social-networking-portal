// @ts-ignore -- Pool is re-exported by the shared structure package.
import { Pool } from "@gorth/structure/cores/pg"
import { drizzle } from "drizzle-orm/node-postgres"
import * as schema from "@/database/schema"
import { databaseUrl, pgPoolMax } from "@/utils/environment"

const configuredPoolMax = Number.parseInt(pgPoolMax ?? "", 10)

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required")
}

const globalForDatabase = globalThis as typeof globalThis & {
  contentReaderPgPool?: InstanceType<typeof Pool>
}

const pool =
  globalForDatabase.contentReaderPgPool ??
  new Pool({
    connectionString: databaseUrl,
    max: Number.isNaN(configuredPoolMax) ? 5 : configuredPoolMax,
  })

if (!globalForDatabase.contentReaderPgPool) {
  pool.on("error", (error: unknown) => {
    console.error("[content-reader-platform-pg-pool-error]", error)
  })
  globalForDatabase.contentReaderPgPool = pool
}

export const database = drizzle({ client: pool })
export { schema }
