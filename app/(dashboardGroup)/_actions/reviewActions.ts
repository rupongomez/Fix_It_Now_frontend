"use server"

import { IReviewFormData } from "@/lib/types/reviews"
import { cookies } from "next/headers"

export const submitReview = async (data: IReviewFormData) => {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get("accessToken")
  console.log(data)
  const res = await fetch(`${process.env.BACKEND_API_URL}/api/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${accessToken?.value}`,
    },
    body: JSON.stringify(data),
  })

  const result = await res.json()
  console.log(result)
  return result
}

export const getReviewsForCustomer = async (bookingId: string) => {
  const res = await fetch(
    `${process.env.BACKEND_API_URL}/api/reviews/${bookingId}`
  )

  const result = await res.json()
  console.log(result)
  return result
}
