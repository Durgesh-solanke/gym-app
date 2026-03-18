import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  const { pathname } = req.nextUrl;

  // ── Public paths — no auth needed ─────────────────────────────────────────
  const publicPaths = ["/auth/signin", "/auth/signup", "/pending"];
  const isPublic = publicPaths.some((p) => pathname.startsWith(p));

  if (isPublic) {
    // Already logged in + approved → bounce away from auth pages
    if (token?.status === "APPROVED" && pathname.startsWith("/auth")) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  }

  // ── Not logged in → go to signin ──────────────────────────────────────────
  if (!token) {
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }

  // ── Admin routes — require ADMIN role ─────────────────────────────────────
  if (pathname.startsWith("/admin")) {
    if (token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  }

  // ── Pending users → holding page ──────────────────────────────────────────
  if (token.status === "PENDING") {
    return NextResponse.redirect(new URL("/pending", req.url));
  }

  // ── Rejected users → signin ────────────────────────────────────────────────
  if (token.status === "REJECTED") {
    return NextResponse.redirect(
      new URL("/auth/signin?error=AccessDenied", req.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

