import { NextRequest, NextResponse } from "next/server";

const authPages = [
  "/user/login",
  "/user/register",
  "/user/forgot-password",
  "/user/reset-password",
];

const protectedUserPages = [
  "/user/dashboard",
  "/user/account",
  "/user/password",
];

const protectedAdminPages = ["/admin"];

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = req.cookies.get("token")?.value;

  const isAuthPage = authPages.some((path) => pathname.startsWith(path));
  const isProtectedUserPage = protectedUserPages.some((path) =>
    pathname.startsWith(path)
  );
  const isProtectedAdminPage = protectedAdminPages.some((path) =>
    pathname.startsWith(path)
  );

  // Allow login/register pages to always open.
  // Do NOT redirect from /user/login to dashboard just because token exists.
  if (isAuthPage) {
    return NextResponse.next();
  }

  // Protect normal user pages.
  if (isProtectedUserPage && !token) {
    const loginUrl = new URL("/user/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  // Protect admin pages.
  if (isProtectedAdminPage && !token) {
    const loginUrl = new URL("/user/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/user/login",
    "/user/register",
    "/user/forgot-password",
    "/user/reset-password",
    "/user/dashboard/:path*",
    "/user/account/:path*",
    "/user/password/:path*",
    "/admin/:path*",
  ],
};