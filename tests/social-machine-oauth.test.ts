import { beforeAll, beforeEach, expect, it, vi } from "vitest"
import {
  generateKeyPair,
  exportJWK,
  SignJWT,
} from "@gorth-com/structure/cores/jose"
vi.mock("@/utils/environment", () => ({
  appUrl: "https://social-machine.test",
  authUrl: "https://sso-machine.test",
  oauthAudience: "https://social-audience.test",
  isProduction: true,
  oauthNotifyAudience: "https://notify-machine.test",
  oauthResourceAudience: "https://resource-machine.test",
  oauthDiscoveryAudience: "https://discovery-machine.test",
  oauthMediaAudience: "https://media-machine.test",
  oauthInsightAudience: "https://insight-machine.test",
}))
import { rawVerifySocialBackend } from "@/services/social-platform"
let pair: Awaited<ReturnType<typeof generateKeyPair>>,
  key: Awaited<ReturnType<typeof exportJWK>>
beforeAll(async () => {
  pair = await generateKeyPair("ES256")
  key = {
    ...(await exportJWK(pair.publicKey)),
    kid: "social-machine-key",
    alg: "ES256",
  }
})
beforeEach(() => {
  vi.spyOn(globalThis, "fetch").mockImplementation(async (input) => {
    const url = input instanceof Request ? input.url : String(input)
    if (url !== "https://sso-machine.test/auth/jwks")
      throw new Error("Unexpected network")
    return Response.json({ keys: [key] })
  })
})
async function token(override: Record<string, unknown> = {}, typ = "at+jwt") {
  const now = Math.floor(Date.now() / 1000)
  return new SignJWT({
    iss: "https://sso-machine.test/auth",
    aud: "https://social-audience.test",
    sub: "existing-confidential",
    client_id: "existing-confidential",
    iat: now,
    exp: now + 120,
    scope: "social:dispatch",
    ...override,
  })
    .setProtectedHeader({ alg: "ES256", kid: "social-machine-key", typ })
    .sign(pair.privateKey)
}
function request(
  bearer?: string,
  headers: Record<string, string | undefined> = {}
) {
  const wire = new Headers()
  for (const [name, value] of Object.entries(headers))
    if (value !== undefined) wire.set(name, value)
  if (bearer) wire.set("Authorization", "Bearer " + bearer)
  return new Request("https://social-machine.test/social/event/dispatch", {
    headers: wire,
  })
}
it("verifies a real signed machine JWT through the native Better Auth verifier", async () => {
  await expect(
    rawVerifySocialBackend(request(await token()))
  ).resolves.toBeUndefined()
})
it.each([
  { scope: "social:read" },
  { sub: "user", sid: "session" },
  { client_id: "different" },
  { iss: "https://foreign.test/auth" },
  { aud: "https://foreign.test" },
  { exp: 1 },
  { iat: 9999999999, exp: 99999999999 },
  { cnf: { jkt: "bound-proof" } },
  { status: "inactive" },
])("rejects invalid or user grants %j", async (override) => {
  await expect(
    rawVerifySocialBackend(request(await token(override)))
  ).rejects.toBeTruthy()
})
it("rejects missing, ID, overlong and tampered tokens", async () => {
  await expect(rawVerifySocialBackend(request())).rejects.toBeTruthy()
  await expect(
    rawVerifySocialBackend(request(await token({}, "JWT")))
  ).rejects.toBeTruthy()
  const now = Math.floor(Date.now() / 1000)
  await expect(
    rawVerifySocialBackend(request(await token({ exp: now + 3600 })))
  ).rejects.toBeTruthy()
  const parts = (await token()).split(".")
  parts[2] = "A".repeat(parts[2]!.length)
  await expect(
    rawVerifySocialBackend(request(parts.join(".")))
  ).rejects.toBeTruthy()
})
it.each([
  { Cookie: "session=normal" },
  { Origin: "https://social-machine.test" },
  { "Sec-Fetch-Site": "same-origin" },
])("rejects browser headers even with valid tokens %j", async (headers) => {
  await expect(
    rawVerifySocialBackend(request(await token(), headers))
  ).rejects.toMatchObject({ status: 403 })
})
it("requires the storage URL audience and a 120-second lifetime", async () => {
  const storage = {
    aud: "https://social-machine.test/internal/storage/credential",
    scope: "storage:social:credential",
  }
  await expect(
    rawVerifySocialBackend(request(await token(storage)), true)
  ).resolves.toBeUndefined()
  await expect(
    rawVerifySocialBackend(request(await token()), true)
  ).rejects.toBeTruthy()
  await expect(
    rawVerifySocialBackend(
      request(
        await token({ ...storage, exp: Math.floor(Date.now() / 1000) + 300 })
      ),
      true
    )
  ).rejects.toBeTruthy()
})
