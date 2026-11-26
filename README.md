# Gorth Social

Next.js 16 fullstack, TypeScript, Hono and Drizzle PostgreSQL.

## Development

Use the root project, not `pkg/client` or `pkg/server`.

```sh
pnpm dev
```

Local application: http://localhost:3033. Gorth SSO: http://localhost:3000.
Configure root environment using [.env.example](.env.example). Keep secrets private.
`NEXT_SESSION_SECRET` must be at least 32 random bytes; preserve its value across deployments.
`NEXT_AUTH_SECRET`, old `VITE_*`, BFF secrets and the separate backend port 5053 are not used.

## Structure

- `app`, `components`, `features`, `layouts`: original Social UI.
- `app/(api)/[...path]/route.ts`: thin Next.js adapter for `app/api.ts`.
- `routes -> controllers -> services -> database`: backend in the same process.
- `services/client`: same-origin UI services.
- `lib/auth`: official Better Auth Generic OAuth + native application sessions.
- `utils`: environment, formatting, contracts, caller and fetcher.
- `styles/globals.css`: local stylesheet entry importing Primitive CSS.
- `pkg`: preserved source archive, excluded from compilation/lint/Tailwind scanning.

Business APIs use `/social/post`, `/social/profile`, `/social/user`, etc.
This avoids collisions with the existing HTML pages `/post`, `/profile`, `/story`.
Shared services retain `/resource`, `/notification`, `/discovery`, etc.
No `/api` prefix, old `/proxy/social` rewrite, app-to-app HTTP hop or signed BFF RPC.

## Authentication and migration

See [docs/auth-structure.md](docs/auth-structure.md).

The cloud migration and SSO registration update have been applied with approval.
Existing app sessions are archived under `legacy_*`; sign in again after restarting Social.
Existing user UUIDs and Social data are preserved.

## Verification

```sh
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

Typecheck, lint and 57 isolated Vitest tests pass.
SSO typecheck, scoped lint and its 57 tests also pass after the registration update.
Production build remains unverified: this execution environment denies Turbopack's
PostCSS worker socket (`Operation not permitted`). Standalone CSS compilation passes.
The default `next build` remains unchanged. No real-user interactive OAuth login was performed here.
