import { NextRequest } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

async function handler(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;

  const backendUrl = `${BACKEND_URL}/api/v1/auth/${path.join("/")}${
    request.nextUrl.search
  }`;

  const headers = new Headers();

  const authorization = request.headers.get("authorization");
  const cookie = request.headers.get("cookie");
  const contentType = request.headers.get("content-type");

  if (authorization) {
    headers.set("Authorization", authorization);
  }

  if (cookie) {
    headers.set("Cookie", cookie);
  }

  if (contentType) {
    headers.set("Content-Type", contentType);
  }

  let body: BodyInit | undefined;

  if (request.method !== "GET" && request.method !== "HEAD") {
    body = await request.arrayBuffer();
  }

  const backendResponse = await fetch(backendUrl, {
    method: request.method,
    headers,
    body,
  });

  const responseHeaders = new Headers();

  const responseContentType = backendResponse.headers.get("content-type");
  const setCookie = backendResponse.headers.get("set-cookie");

  if (responseContentType) {
    responseHeaders.set("Content-Type", responseContentType);
  }

  if (setCookie) {
    responseHeaders.set("Set-Cookie", setCookie);
  }

  const responseBody = await backendResponse.arrayBuffer();

  return new Response(responseBody, {
    status: backendResponse.status,
    headers: responseHeaders,
  });
}

export const GET = handler;
export const POST = handler;
export const PATCH = handler;
export const PUT = handler;
export const DELETE = handler;