import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = "http://localhost:5000/api/v1/auth";

async function proxyRequest(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  const endpoint = path.join("/");

  const url = `${BACKEND_URL}/${endpoint}`;

  const headers = new Headers();

  const cookie = req.headers.get("cookie");
  if (cookie) {
    headers.set("cookie", cookie);
  }

  const contentType = req.headers.get("content-type");
  if (contentType) {
    headers.set("content-type", contentType);
  }

  let body: BodyInit | undefined;

  if (req.method !== "GET" && req.method !== "HEAD") {
    body = await req.arrayBuffer();
  }

  const backendRes = await fetch(url, {
    method: req.method,
    headers,
    body,
    credentials: "include",
  });

  const data = await backendRes.text();

  const response = new NextResponse(data, {
    status: backendRes.status,
    headers: {
      "content-type":
        backendRes.headers.get("content-type") || "application/json",
    },
  });

  const setCookie = backendRes.headers.get("set-cookie");

  if (setCookie) {
    response.headers.set("set-cookie", setCookie);
  }

  return response;
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  return proxyRequest(req, context);
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  return proxyRequest(req, context);
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  return proxyRequest(req, context);
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  return proxyRequest(req, context);
}