import nextEnv from "@next/env"
import { spawnSync } from "node:child_process"
import { fileURLToPath } from "node:url"
const root = fileURLToPath(new URL("../", import.meta.url))
nextEnv.loadEnvConfig(root, true)
const r = spawnSync(
  process.execPath,
  [
    fileURLToPath(
      new URL("../node_modules/vitest/vitest.mjs", import.meta.url)
    ),
    "run",
    "--config",
    "vitest.database.config.ts",
    "--configLoader",
    "native",
    "--no-cache",
    "--no-fsModuleCache",
    ...process.argv.slice(2),
  ],
  { cwd: root, stdio: "inherit" }
)
process.exitCode = r.status ?? 1
