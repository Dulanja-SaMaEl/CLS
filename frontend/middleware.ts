import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const adminSession = request.cookies.get("cls_admin_session")?.value;
  const memberSession = request.cookies.get("cls_member_session")?.value;
  const adminToken = request.cookies.get("cls_admin_token")?.value;
  const memberToken = request.cookies.get("cls_token")?.value;

  const isAdmin =
    adminSession === "true" || adminSession === "1" || Boolean(adminToken);
  const isMember =
    memberSession === "true" ||
    memberSession === "1" ||
    Boolean(memberToken) ||
    isAdmin;

  // Protect /admin and all sub-routes
  if (pathname.startsWith("/admin")) {
    if (!isAdmin) {
      const signInUrl = new URL("/sign-in", request.url);
      signInUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(signInUrl);
    }
  }

  // Protect /member and all sub-routes
  if (pathname.startsWith("/member")) {
    // Both members and admins can access the member hub
    if (!isMember) {
      const signInUrl = new URL("/sign-in", request.url);
      signInUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(signInUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/member/:path*"],
};

