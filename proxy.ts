import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import { jwtUtils } from "./service/utils/jwt"
import { redirect } from "next/navigation"
import { logout } from "./service/logout"
import { JwtPayload } from "jsonwebtoken"
import { getNewAccessToken } from "./service/getNewAccessToken"

const AUTH_ROUTES = ["/login", "/register"]
const PUBLIC_ROUTES = ["/", "/services", "/technicians"]
const PROTECTED_ROUTES = ["/profile", "/dashboard", "/bookings", "/payments"]

export async function proxy(request: NextRequest) {
  const pathName = request.nextUrl.pathname
  const cookieStore = await cookies()

  let accessToken = request.cookies.get("accessToken")?.value
  const refreshToken = request.cookies.get("refreshToken")?.value

  let decodedAccessToken = accessToken
    ? jwtUtils.verifyToken(accessToken, process.env.JWT_ACCESS_SECRET as string)
    : null
  const decodedRefreshToken = refreshToken
    ? jwtUtils.verifyToken(
        refreshToken,
        process.env.JWT_REFRESH_SECRET as string
      )
    : null
  if (!decodedAccessToken?.success && decodedRefreshToken?.success) {
    const result = await getNewAccessToken()

    const newAccessToken = result?.data?.accessToken

    if (result.success) {
      cookieStore.set("accessToken", newAccessToken, {
        httpOnly: true,
        maxAge: 60 * 60 * 24,
        sameSite: "lax",
      })

      accessToken = newAccessToken
      decodedAccessToken = jwtUtils.verifyToken(
        accessToken!,
        process.env.JWT_ACCESS_SECRET as string
      )
    }
  }

  let userRole = null

  if (decodedAccessToken?.success && decodedAccessToken.data) {
    userRole = (decodedAccessToken.data as JwtPayload).role
  }
  console.log(userRole)

  if (accessToken && AUTH_ROUTES.includes(pathName)) {
    if (userRole === "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard/admin", request.url))
    } else if (userRole === "CUSTOMER") {
      return NextResponse.redirect(new URL("/dashboard/customer", request.url))
    } else if (userRole === "TECHNICIAN") {
      return NextResponse.redirect(
        new URL("/dashboard/technician", request.url)
      )
    }
  }

  const isPublicRoute = PUBLIC_ROUTES.some(
    (route) => pathName === route || pathName.startsWith(route + "/")
  )

  const isAuthRoute = AUTH_ROUTES.some(
    (route) => pathName === route || pathName.startsWith(route + "/")
  )

  const isProtectedRoute = PROTECTED_ROUTES.some(
    (route) => pathName === route || pathName.startsWith(route + "/")
  )

  if (!accessToken && !isPublicRoute && !isAuthRoute) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("redirectTo", pathName)
    return NextResponse.redirect(loginUrl)
  }

  if (!accessToken && isProtectedRoute) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Authorization: Role based access control
  if (pathName.startsWith("/dashboard/admin") && userRole !== "ADMIN") {
    return NextResponse.redirect(new URL("/not-found", request.url))
  } else if (
    pathName.startsWith("/dashboard/technician") &&
    userRole !== "TECHNICIAN"
  ) {
    return NextResponse.redirect(new URL("/not-found", request.url))
  } else if (
    pathName.startsWith("/dashboard/customer") &&
    userRole !== "CUSTOMER"
  ) {
    return NextResponse.redirect(new URL("/not-found", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|favicon.ico|_next/image|.*\\.png$).*)"],
}
