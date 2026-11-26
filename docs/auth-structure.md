# Social fullstack and native Better Auth

## Authority and runtime

Gorth SSO owns credentials, central identity, account selection and OAuth Provider.
Social is a relying party using Better Auth 1.7.7 Generic OAuth and its native
Drizzle application-session adapter, following the same implementation as Chat,
Video and Reader. It does not create another password authority.

Next.js runs at the root on port 3033. The Hono API is mounted through the thin
`@hono/vercel` catch-all adapter. Backend routes/controllers/services/middlewares
remain at root; UI services live under `services/client`. Original sources stay
unchanged under `pkg`.

## Login, identity, refresh and logout

1. UI uses `authClient.signIn.social({ provider: "gorth" })`.
2. Generic OAuth discovers the SSO issuer and JWKS; requests PKCE, state, nonce,
   `prompt=select_account` and configured RFC 8707 resources.
3. Better Auth validates callback `/auth/callback/gorth` and the ID token before
   creating/updating the native account and application session.
4. The immutable SSO `sub` is stored as `account.accountId` and
   `user.externalUserId`. Email is not an identity-linking fallback.
5. Native account access/refresh tokens are encrypted by Better Auth, kept server-only,
   and refreshed through its server API. Browser token endpoints and account linking
   are disabled. App endpoints authorize native sessions and local policy.
6. `authClient.signOut()` deletes the local app session.
   `disableProviderLogout: true` retains SSO and other apps' sessions.
   A local logout does not magically invalidate previously issued OAuth tokens;
   platform forwarding requires a still-valid local session and is blocked after logout.

A verified native SSO account SID binds the app session to the central session.
Social provisions its local profile during the native session hook when a username
is present; it preserves existing profile handles. This is Social domain behavior,
not a replacement OAuth or credential implementation.

Local role, account status, deletion and bans are checked in the backend.
SSO app claims or browser-supplied roles do not confer Social administrator rights.

## APIs and platform services

Social HTML pages already occupy `/post`, `/profile` and `/story`.
The 12 migrated business route groups therefore use:

- `/social/user`, `/social/profile`
- `/social/post`, `/social/post-channel`, `/social/post-media`, `/social/post-hashtag`
- `/social/follow`, `/social/friendship`, `/social/block`
- `/social/story`, `/social/story-view`, `/social/hashtag`

Each protected route calls `requireAuth()` explicitly. Controllers use Hono
Context directly, not the archived Express compatibility layer. Original domain
services/ownership rules are retained; post creation derives the author from the
verified local actor, not a request's `authorId`.

`/social/lab` performs a fresh identity check, and `/demo/call` runs locally through
Hono. These JSON endpoints do not shadow their HTML demonstration pages.

The seven platform gateways use `NEXT_OAUTH_*_AUDIENCE` as fixed server-only
targets. They forward backend access tokens, never ID tokens, caller cookies or
browser-supplied credentials; they strip upstream cookies and redirects.
They do not bypass the platform service's own audience/scope/authorization checks.

## Freshness and revocation

Routine identity reads use a 120-second freshness policy. Sensitive operations
perform a live SSO check. Concurrent UserInfo requests are bounded/coalesced;
authorization decisions are not stored in that profile cache.

Signed SSO backchannel events are verified before durable revocation receipts and
native-session deletion. DPoP replay reservations remain atomic.
Session credentials are checked again after refresh/live checks to fence a raced
logout. Webhooks and background token clients keep their independent bearer/event
authentication; they do not depend on a browser cookie.

Next proxy uses an optimistic native-cookie presence check only, never a recursive
self-fetch. Backend/API authorization still checks the session and policy.
Native React sessions have no custom 30-second page-reload timer, and background
refetches do not replace an existing account with the initial-loading screen.

## Applied cloud changes

Approved Social migration:

- Old `session` and `verification` renamed `legacy_session` and `legacy_verification`.
- Native `session`, `account`, `verification` and rate-limit ID support added.
- `user.emailVerified` and `user.ssoStatus` added.
- Existing accounts linked solely by SSO subject.
- Legacy tables remain represented in Drizzle so future schema operations do not
  accidentally drop archived authentication data.
- Transaction verified **2 unchanged user UUIDs**, account bindings and unchanged
  counts across **79 domain tables** plus the existing rate-limit table.
- No user/domain data or old auth rows were deleted.

Approved SSO registration migration:

- Client: `gorth-social-networking-portal`.
- Local and existing production callbacks: `/auth/callback/gorth`.
- Local protected-resource audience: `http://localhost:5053` -> `http://localhost:3033`.
- Other client fields, secrets, scopes, resource policy and grants preserved.
- Maintained SSO seed files updated to prevent the old registration from returning.

Migration commands (idempotent, fail closed on unexpected legacy/resource state):

```sh
# Social root
pnpm db:migrate-auth
# SSO root
node database/migrate-social-oauth.mjs
```

No production deployment URL, provider key or private env file was copied/edited.

## Environment and CSS

`utils/environment.ts` is the sole application env reader.
Required values are documented in root `.env.example`:
`NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_AUTH_URL`,
`NEXT_OAUTH_CLIENT_ID`, `NEXT_OAUTH_AUDIENCE`,
`NEXT_SESSION_SECRET`, `DATABASE_URL` and the seven optional service audiences.
The root local configuration was checked through normal runtime loading; only
boolean validity results were printed.

The local stylesheet entry imports Primitive CSS. Tailwind uses explicit active
source directories, excluding `pkg` and `.next` while retaining Primitive component
classes. Caller/fetcher remain byte-identical to the archived Social client versions.

## Verification and outstanding limitation

- Social: TypeScript and ESLint pass; **57 Vitest tests** pass.
- Coverage includes Generic OAuth parameters, local sessions, freshness/live checks,
  SID/subject mismatch, durable revocation, signed/forged logout, CSRF, platform credential filtering, post ownership/local roles, pagination,
  root architecture and CSS watch boundaries.
- SSO: TypeScript, scoped seed lint, formatting and **57 tests** pass.
- Default Turbopack production build attempted twice. The network-enabled attempt
  passed font fetching but stopped when PostCSS worker socket binding was denied:
  `Operation not permitted (os error 1)`. Standalone Tailwind/PostCSS compilation passes.
- No claim of successful production build or real-account interactive browser login.

Official references:

- [Generic OAuth](https://better-auth.com/docs/plugins/generic-oauth)
- [Next.js integration](https://better-auth.com/docs/integrations/next)
- [Hono integration](https://better-auth.com/docs/integrations/hono)
- [Session management](https://better-auth.com/docs/concepts/session-management)
