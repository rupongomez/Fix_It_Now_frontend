"use server"
import { cookies } from "next/headers"
import { jwtUtils } from "./utils/jwt"
import { JwtPayload } from "jsonwebtoken"

export const getMe = async () => {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get("accessToken")
  console.log(accessToken)
  if (!accessToken) {
    return {
      success: false,
      message: "User not logged in. Please login to continue",
    }
  }

  // TODO: fix failed fetch
  const res = await fetch(`${process.env.BACKEND_API_URL}/api/users/me`, {
    headers: {
      Authorization: `${accessToken.value}`,
    },
    cache: "force-cache",
    next: {
      revalidate: 60 * 60 * 24,
      tags: ["my-profile"],
    },
  })

  const result = await res.json()

  console.log(result)
  return result
}
