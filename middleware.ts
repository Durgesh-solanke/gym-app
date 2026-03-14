export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/log/:path*",
    "/plan/:path*",
    "/history/:path*",
    "/exercises/:path*",
  ],
};
