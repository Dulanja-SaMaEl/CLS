import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const adminSession = request.cookies.get("cls_admin_session")?.value;
  const memberSession = request.cookies.get("cls_member_session")?.value;

  // Protect /admin and all sub-routes
  if (pathname.startsWith("/admin")) {
    if (adminSession !== "true") {
      const signInUrl = new URL("/sign-in", request.url);
      signInUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(signInUrl);
    }
  }

  // Protect /member and all sub-routes
  if (pathname.startsWith("/member")) {
    // Both members and admins can access the member hub
    if (memberSession !== "true" && adminSession !== "true") {
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
