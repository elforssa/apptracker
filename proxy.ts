import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/password") ||
    pathname.startsWith("/api/auth")
  ) {
    return NextResponse.next();
  }

  const cookie = request.cookies.get("app_auth");
  const expected = btoa(process.env.APP_PASSWORD || "");

  if (!cookie || cookie.value !== expected) {
    return NextResponse.redirect(new URL("/password", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.svg).*)"],
};
