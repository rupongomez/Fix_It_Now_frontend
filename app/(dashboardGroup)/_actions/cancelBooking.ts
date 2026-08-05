"use server"

import { cookies } from "next/headers"

export const cancelBooking = async (bookingId: string) => {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get("accessToken")?.value
  const response = await fetch(
    `${process.env.BACKEND_API_URL}/api/booking/update-status/${bookingId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${accessToken}`,
      },
      body: JSON.stringify({ status: "CANCELLED" }),
    }
  )
  const result = await response.json()

  return result
}
