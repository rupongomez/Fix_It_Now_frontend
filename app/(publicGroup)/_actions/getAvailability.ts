"use server"
import { success } from "zod"

export const getAvailability = async (technicianId: string) => {
  if (!technicianId) {
    return {
      success: false,
      message: "Technician not found",
    }
  }
  const res = await fetch(
    `${process.env.BACKEND_API_URL}/api/availability/${technicianId}`
  )

  const result = await res.json()
  return result
}
