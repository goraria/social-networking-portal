import type { NextRequest } from "next/server";

import {
  accessTokenCookie,
  mediaStorageServerUrl,
} from "@/utils/environment";
import { forwardRouteRequest } from "@/services/route";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface RouteContext {
  params: Promise<{ path: string[] }>;
}

const bodyMethods = new Set(["POST", "PUT", "PATCH", "DELETE"]);
const forwardedHeaders = [
  "accept",
  "content-type",
  "if-match",
  "if-none-match",
  "idempotency-key",
  "x-request-id",
] as const;

function hasValidOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  return !origin || origin === request.nextUrl.origin;
}

async function proxyMediaRequest(request: NextRequest, context: RouteContext) {
  if (bodyMethods.has(request.method) && !hasValidOrigin(request)) {
    return Response.json({ error: "invalid_origin" }, { status: 403 });
  }
  if (!mediaStorageServerUrl) {
    return Response.json(
      { error: "missing_media_storage_server_url" },
      { status: 500 },
    );
  }

  const { path } = await context.params;
  const target = new URL(
    `/media/${path.map((segment) => encodeURIComponent(segment)).join("/")}`,
    mediaStorageServerUrl,
  );
  target.search = request.nextUrl.search;

  const headers = new Headers();
  for (const name of forwardedHeaders) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }
  const accessToken = request.cookies.get(accessTokenCookie)?.value;
  if (accessToken) headers.set("authorization", `Bearer ${accessToken}`);

  return forwardRouteRequest({
    url: target,
    method: request.method,
    headers,
    body: bodyMethods.has(request.method) ? await request.arrayBuffer() : undefined,
  });
}

export const GET = proxyMediaRequest;
export const HEAD = proxyMediaRequest;
export const POST = proxyMediaRequest;
export const PUT = proxyMediaRequest;
export const PATCH = proxyMediaRequest;
export const DELETE = proxyMediaRequest;
