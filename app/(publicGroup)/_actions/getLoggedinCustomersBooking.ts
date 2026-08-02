"use server"

import { cookies } from "next/headers"

export const getLoggedInCustomersBooking = async () => {
  const cookieStore = await cookies()

  const accessToken = cookieStore.get("accessToken")

  const res = await fetch(
    `${process.env.BACKEND_API_URL}/api/payments/checkout`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${accessToken?.value}`,
      },
    }
  )
  return res.json()
}
