import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  // Public routes
  const publicRoutes = ["/login", "/signup", "/forgotPassword", "/resetPassword", "/verifyemail"];

  // Protected routes
  const protectedRoutes = ["/profile", "/complaints", "/dashboard", "/upload", "/testing"];

  // Redirect logged-in users away from login/signup
  if (token && publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/profile", request.url));
  }

  // Redirect root "/" to login if not logged in
  if (pathname === "/" && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Check protected routes
  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (!token && isProtectedRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/profile/:path*",
    "/upload/:path*",
    "/testing/:path*",
    "/complaints/:path*",
    "/dashboard/:path*",
    "/login",
    "/signup",
  ],
};
