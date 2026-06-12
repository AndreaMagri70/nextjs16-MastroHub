import { auth } from "@/lib/auth";

export default auth.middleware({
  loginUrl: "/login",
});

export const config = {
  matcher: [
    {
      source: "/dashboard/:path*",
      missing: [{ type: "header", key: "next-action" }],
    },
    {
      source: "/admin/:path*",
      missing: [{ type: "header", key: "next-action" }],
    },
    {
      source: "/clients/:path*",
      missing: [{ type: "header", key: "next-action" }],
    },
    {
      source: "/quotes/:path*",
      missing: [{ type: "header", key: "next-action" }],
    },
    {
      source: "/construction-sites/:path*",
      missing: [{ type: "header", key: "next-action" }],
    },
  ],
};