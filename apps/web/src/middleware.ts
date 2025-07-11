import { NextRequest, NextResponse } from "next/server";

// Supported game slugs
const SUPPORTED_GAMES = ["mk", "sf", "tk", "gg", "bb", "uni"];

export function middleware(request: NextRequest) {
  const { pathname, hostname } = request.nextUrl;

  // Skip middleware for static files and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/static") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Extract subdomain
  const subdomain = hostname.split(".")[0];

  // Check if subdomain is a valid game slug
  if (SUPPORTED_GAMES.includes(subdomain)) {
    // Rewrite the URL to include the game slug in the path
    const url = request.nextUrl.clone();

    // If the path is just '/', redirect to the game-specific home
    if (pathname === "/") {
      url.pathname = `/${subdomain}`;
      return NextResponse.redirect(url);
    }

    // If the path doesn't start with the game slug, add it
    if (!pathname.startsWith(`/${subdomain}`)) {
      url.pathname = `/${subdomain}${pathname}`;
      return NextResponse.rewrite(url);
    }
  }

  // Handle main domain (irfgc.ir) - show game selection or main hub
  if (hostname === "irfgc.ir" || hostname === "localhost") {
    // If accessing a game-specific path without subdomain, redirect to main hub
    if (SUPPORTED_GAMES.some((game) => pathname.startsWith(`/${game}`))) {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
