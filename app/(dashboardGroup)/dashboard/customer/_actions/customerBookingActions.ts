"use server"

import { cookies } from "next/headers"

export const getLoggedInCustomersBookings = async () => {
  const cookieStore = await cookies()

  const accessToken = cookieStore.get("accessToken")

  const res = await fetch(`${process.env.BACKEND_API_URL}/api/booking`, {
    headers: {
      Authorization: `${accessToken?.value}`,
    },
  })

  return res.json()
}
