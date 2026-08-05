"use server"
import { cookies } from "next/headers"

export const getNewAccessToken = async () => {
  const cookieStore = await cookies()
  const refreshToken = cookieStore.get("refreshToken")

  if (!refreshToken) {
    return {
      success: false,
      message: "User not logged in!",
    }
  }

  const res = await fetch(
    `${process.env.BACKEND_API_URL}/api/auth/refresh-token`,
    {
      headers: {
        Cookie: `refreshToken=${refreshToken.value}`,
      },
      cache: "no-cache",
    }
  )
  const result = await res.json()

  return result
}
