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
interface IQuery {
  searchTerms?: string
  page: number
  limit: number
}
export const getAllUsers = async (query: IQuery) => {
  const params = new URLSearchParams()
  if (query.searchTerms) {
    //   Backend expects "searchTerm" (singular)
    params.set("searchTerm", query.searchTerms)
  }

  if (query.page !== null) {
    params.set("page", query.page.toString())
  }
  if (query.limit !== null) {
    params.set("limit", query.limit.toString())
  }

  params.toString()
  const cookieStore = await cookies()
  const accessToken = cookieStore.get("accessToken")
  if (!accessToken) {
    return {
      success: false,
      message: "You are not logged in",
    }
  }
  const res = await fetch(
    `${process.env.BACKEND_API_URL}/api/admin/users?${params.toString()}`,
    {
      cache: "no-store",
      headers: {
        Authorization: `${accessToken.value}`,
      },
    }
  )
  const result = await res.json()

  return result
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
