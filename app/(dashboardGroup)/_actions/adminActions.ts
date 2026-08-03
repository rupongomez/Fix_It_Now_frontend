"use server"

import { cookies } from "next/headers"

export const getAllBookings = async () => {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get("accessToken")
  if (!accessToken) {
    return {
      success: false,
      message: "You are not logged in",
    }
  }
  const res = await fetch(`${process.env.BACKEND_API_URL}/api/admin/bookings`, {
    cache: "no-store",
    headers: {
      Authorization: `${accessToken.value}`,
    },
  })
  return res.json()
}

export const getAllUsers = async () => {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get("accessToken")
  if (!accessToken) {
    return {
      success: false,
      message: "You are not logged in",
    }
  }
  const res = await fetch(`${process.env.BACKEND_API_URL}/api/admin/users`, {
    cache: "no-store",
    headers: {
      Authorization: `${accessToken.value}`,
    },
  })
  return res.json()
}

export const updateUserStatus = async (userId: string, status: string) => {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get("accessToken")
  if (!accessToken) {
    return {
      success: false,
      message: "You are not logged in",
    }
  }
  const res = await fetch(
    `${process.env.BACKEND_API_URL}/api/admin/users/${userId}`,
    {
      method: "PATCH",
      cache: "no-store",
      headers: {
        Authorization: `${accessToken.value}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    }
  )
  return res.json()
}

export const getCategories = async () => {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get("accessToken")
  if (!accessToken) {
    return {
      success: false,
      message: "You are not logged in",
    }
  }
  const res = await fetch(
    `${process.env.BACKEND_API_URL}/api/admin/categories`,
    {
      cache: "no-store",
      headers: {
        Authorization: `${accessToken.value}`,
      },
    }
  )
  return res.json()
}

export const createCategory = async (payload: {
  name: string
  description: string
}) => {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get("accessToken")
  if (!accessToken) {
    return {
      success: false,
      message: "You are not logged in",
    }
  }
  const res = await fetch(
    `${process.env.BACKEND_API_URL}/api/admin/categories`,
    {
      method: "POST",
      cache: "no-store",
      headers: {
        Authorization: `${accessToken.value}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  )
  return res.json()
}
