"use server"

import { cookies } from "next/headers"

export const getAvailability = async (technicianId: string) => {
  if (!technicianId) {
    return {
      success: false,
      message: "Technician id not found",
    }
  }

  const res = await fetch(
    `${process.env.BACKEND_API_URL}/api/availability/${technicianId}`
  )

  const result = await res.json()
  return result
}

export const createAvailability = async (data: {
  technicianProfileId: string
  date: string
  startTime: string
  endTime: string
  isBooked: boolean
}) => {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get("accessToken")?.value
  if (!accessToken) {
    return {
      success: false,
      message: "User not logged in",
    }
  }
  const res = await fetch(`${process.env.BACKEND_API_URL}/api/availability`, {
    method: "POST",
    headers: {
      Authorization: ` ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  const result = await res.json()

  console.log(result)
  return result
}
