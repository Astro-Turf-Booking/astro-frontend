import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Cookie key used by the backend for authentication.
 */
export const AUTH_COOKIE_NAME = "token";

/**
 * List of publicly accessible routes.
 */
export const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/signup",
  "/register",
  "/forgot-password",
];

/**
 * Determines whether a given pathname matches any public route.
 */
function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some((route) => {
    if (pathname === route) return true;
    if (route !== "/" && pathname.startsWith(`${route}/`)) return true;
    return false;
  });
}

/**
 * Next.js route protection proxy function.
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // TEMPORARILY DISABLED: Authentication route protection.
  // Uncomment this block to restore authentication.

  /*
  // 1. Allow public routes
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // 2. Check for authentication cookie
  const authToken = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  if (authToken && authToken.trim() !== "") {
    return NextResponse.next();
  }

  // 3. Redirect unauthenticated users to login
  const loginUrl = new URL("/login", request.url);
  const fullOriginalPath = `${pathname}${search}`;
  loginUrl.searchParams.set("callbackUrl", fullOriginalPath);

  return NextResponse.redirect(loginUrl);
  */

  // Allow all routes temporarily
  return NextResponse.next();
}

export default proxy;

/**
 * Matcher configuration.
 */
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|eot|css|js)$).*)",
  ],
};
