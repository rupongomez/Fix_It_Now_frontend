"use server"
import { cookies } from "next/headers"

export const getBookingsForTechnician = async () => {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get("accessToken")

  if (!accessToken) {
    return {
      success: false,
      message: "User not logged in",
    }
  }
  const res = await fetch(
    `${process.env.BACKEND_API_URL}/api/technician/bookings`,
    {
      headers: {
        Authorization: `${accessToken.value}`,
      },
    }
  )

  const result = await res.json()
  return result
}
