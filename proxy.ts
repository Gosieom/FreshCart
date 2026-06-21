import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/user/dashboard", "/user/profile", "/user/password"];

const publicRoutes = [
  "/user/login",
  "/user/register",
  "/user/forgot_password",
  "/user/reset_password",
];

export function proxy(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const pathname = req.nextUrl.pathname;

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/user/login", req.url));
  }

  if (isPublicRoute && token) {
    return NextResponse.redirect(new URL("/user/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/user/dashboard/:path*",
    "/user/profile/:path*",
    "/user/password/:path*",
    "/user/login",
    "/user/register",
    "/user/forgot_password",
    "/user/reset_password",
  ],
};