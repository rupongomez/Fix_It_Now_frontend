"use server"
import { cookies } from "next/headers"

export const checkoutService = async (serviceId: string) => {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get("accessToken")

  const res = await fetch(
    `${process.env.BACKEND_API_URL}/api/payments/checkout`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${accessToken?.value}`,
      },
      body: JSON.stringify(serviceId),
    }
  )

  console.log(res)
  const result = await res.json()
  return result
}
