export type LoginState = {
  success: boolean
  statusCode: number
  message: string
  data: {
    accessToken: string
    refreshToken: string
  }
}

export type RegisterActionResult = {
  success: boolean
  statusCode: number
  message: string
  data: {
    user: {
      id: string
      name: string
      email: string
      phone: string
      location: string
      role: "CUSTOMER" | "TECHNICIAN" | "ADMIN"
      status: "ACTIVE" | "INACTIVE"
      profileImage?: string
      stripeCustomerId?: string
      createdAt: string
      updatedAt: string
    }
  }
}
