"use server"
import { IBookingRequestPayload } from "@/lib/types/makeBooking"
import { cookies } from "next/headers"

export const makeBookingRequest = async (payload: IBookingRequestPayload) => {
  const {
    availabilitySlotId,
    bookingTime,
    customerAddress,
    serviceId,
    technicianIdToBook,
    note,
  } = payload

  if (
    !availabilitySlotId ||
    !bookingTime ||
    !customerAddress ||
    !serviceId ||
    !technicianIdToBook
  ) {
    throw new Error("Missing required booking information")
  }

  const cookieStore = await cookies()
  const accessToken = cookieStore.get("accessToken")
  const res = await fetch(`${process.env.BACKEND_API_URL}/api/booking`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",

      Authorization: `${accessToken?.value}`,
    },
    body: JSON.stringify(payload),
  })

  const result = await res.json()
  return result
}

export const getBookingDetails = async (bookingId: string) => {
  if (!bookingId) {
    throw new Error("Booking ID is required")
  }
  const cookieStore = await cookies()
  const accessToken = cookieStore.get("accessToken")

  const res = await fetch(
    `${process.env.BACKEND_API_URL}/api/booking/details/${bookingId}`,
    {
      headers: {
        "Content-Type": "application/json",

        Authorization: `${accessToken?.value}`,
      },
    }
  )

  return res.json()
}
