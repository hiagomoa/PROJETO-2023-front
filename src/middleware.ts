import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const token = request.cookies.has("token");

  if (token) {
    if (request.url.startsWith("/")) {
      return NextResponse.redirect(new URL("/aluno", request.nextUrl));
    }
  }

  if (
    request.url.startsWith("/professor") ||
    request.url.startsWith("/aluno") ||
    request.url.startsWith("/admin")
  ) {
    if (!token) {
      return NextResponse.redirect(new URL("/", request.nextUrl));
    }
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: "/:path*",
};
