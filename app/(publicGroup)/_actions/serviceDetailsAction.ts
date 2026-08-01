"use server"
import { cookies } from "next/headers"

export const getServiceDetails = async (serviceId: string) => {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get("accessToken")

  const res = await fetch(
    `${process.env.BACKEND_API_URL}/api/services/details/${serviceId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${accessToken?.value}`,
      },
    }
  )

  console.log(res)
  const result = await res.json()

  return result
}
