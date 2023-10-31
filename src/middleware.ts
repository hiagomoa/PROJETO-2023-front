import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const token = request.cookies.has("token");
  const role = request.cookies.get("role");

  if (token) {
    if (request.nextUrl.pathname === "/") {
      const newRole =
        role?.value === "PROFESSOR"
          ? "professor"
          : role?.value === "STUDENT"
          ? "aluno"
          : "adm";
      return NextResponse.redirect(new URL("/" + newRole, request.nextUrl));
    }
    return NextResponse.next();
  }
  if (
    request.nextUrl.pathname.startsWith("/professor") ||
    request.nextUrl.pathname.startsWith("/aluno") ||
    request.nextUrl.pathname.startsWith("/adm")
  ) {
    if (!token) {
      return NextResponse.redirect(new URL("/", request.nextUrl));
    }
    return NextResponse.next();
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: "/:path*",
};
