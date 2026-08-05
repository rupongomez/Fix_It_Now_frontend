"use server"
import { cookies } from "next/headers"
import { success } from "zod"

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

export const updateBookingStatusByTechnician = async (
  bookingId: string,
  newStatus: string
) => {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get("accessToken")
  if (!accessToken) {
    return {
      success: false,
      message: "You are not logged in",
    }
  }
  const res = await fetch(
    `${process.env.BACKEND_API_URL}/api/technician/booking/${bookingId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${accessToken.value}`,
      },
      body: JSON.stringify({ status: newStatus }),
    }
  )

  const result = await res.json()
  return result
}
