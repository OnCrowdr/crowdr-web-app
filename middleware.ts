import { NextResponse, NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()

  if (!request.cookies.has("token")) {
    // url.pathname = "/login"
    // return NextResponse.redirect(url)
  }

  // Store current request pathname in a custom header
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set("x-pathname", request.nextUrl.pathname)

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

// "Matching Paths"
export const config = {
  matcher: [
    "/dashboard/(.*)",
    "/admin/(.*)",
    "/register-organization",
    // "/confirmation",
    // "/explore",
    // "/explore/(.*)",
    // "/campaigns",
    // "/campaigns/(.*)", // <-- Add this line to match all /campaigns/* routes
    // "/donations",
    // "/donations/(.*)",
    // "/inbox",
    // "/manage-webpage",
    // "/settings/(.*)",
  ],
}

const dashboardRoutes = ["campaigns", "donations", "settings"]
