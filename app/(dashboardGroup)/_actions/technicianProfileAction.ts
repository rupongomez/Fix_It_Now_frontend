"use server"

import { jwtUtils } from "@/service/utils/jwt"
import { JwtPayload } from "jsonwebtoken"
import { cookies } from "next/headers"

export const getTechnicianProfileById = async (id: string) => {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get("accessToken")?.value
  if (!accessToken) {
    return {
      success: false,
      message: "User not logged in",
    }
  }

  const verifiedToken = jwtUtils.verifyToken(
    accessToken,
    process.env.JWT_ACCESS_SECRET!
  ) as JwtPayload

  if (!verifiedToken.success) {
    return {
      success: false,
      message: "Invalid Token.",
    }
  }

  if (verifiedToken.data.id !== id) {
    return {
      success: false,
      message: "Forbidden access",
    }
  }

  const res = await fetch(
    `${process.env.BACKEND_API_URL}/api/technician/profile/${id}`
  )
  const result = await res.json()
  return result
}

interface TechnicianProfileData {
  bio: string
  experience: number
  hourlyRate: number
  service: string[]
  location: string
}

export const updateTechnicianProfile = async (
  profileData: TechnicianProfileData
) => {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get("accessToken")?.value
  if (!accessToken) {
    return {
      success: false,
      message: "User not logged in",
    }
  }

  const res = await fetch(
    `${process.env.BACKEND_API_URL}/api/technician/update-profile`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${accessToken}`,
      },
      body: JSON.stringify(profileData),
    }
  )
  const result = await res.json()

  return result
}
