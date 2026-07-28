"use server"
import jwt, { JwtPayload } from "jsonwebtoken"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { LoginState, RegisterActionResult } from "./types"

export const LoginAction = async (
  prevState: LoginState,
  formData: FormData
) => {
  const cookieStore = await cookies()
  const email = formData.get("email")
  const password = formData.get("password")

  const payload = {
    email,
    password,
  }

  const res = await fetch(`${process.env.BACKEND_API_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })

  const result = await res.json()
  if (result.success) {
    cookieStore.set("accessToken", result.data.accessToken, {
      httpOnly: true,
      maxAge: 60 * 60 * 24,
      sameSite: "lax",
    })

    cookieStore.set("refreshToken", result.data.refreshToken, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30,
      sameSite: "lax",
    })

    const decodedToken = jwt.decode(result.data.accessToken) as JwtPayload

    if (decodedToken.role === "CUSTOMER") {
      redirect("/dashboard")
    } else if (decodedToken.role === "TECHNICIAN") {
      redirect("/dashboard/technician")
    } else if (decodedToken.role === "ADMIN") {
      redirect("/dashboard/admin")
    }
  }

  return result
}

export const RegisterAction = async (
  prevState: RegisterActionResult,
  formData: FormData
) => {
  const name = formData.get("name")
  const email = formData.get("email")
  const phone = formData.get("phone")
  const location = formData.get("location")
  const password = formData.get("password")
  const role = formData.get("role")

  const payload = { name, email, phone, location, password, role }

  const res = await fetch(`${process.env.BACKEND_API_URL}/api/users/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
  const result = await res.json()

  if (!result.success) {
    throw new Error("Something went wrong! Please try again")
  }

  return result
}
