import { NextResponse } from "next/server";

const PUBLIC_FILE = /\.(.*)$/i;
const AUTH_ROUTES = ["/auth/signin"];

export async function proxy(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  // Skip static/public files
  if (PUBLIC_FILE.test(pathname)) {
    return NextResponse.next();
  }

  // If logged in but trying to visit auth redirect home
  if (token && AUTH_ROUTES.includes(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If not logged in and trying to visit a protected route redirect signin
  if (!token && !AUTH_ROUTES.includes(pathname)) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  // Otherwise allow
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api|images|assets).*)"],
};