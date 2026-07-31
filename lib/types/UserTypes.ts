export type IUser = {
  success: boolean
  statusCode: number
  message: string
  data: {
    id: string
    name: string
    email: string
    phone: string
    location: string
    role: string
    status: string
    profileImage?: string
    stripeCustomerId?: string | null
    createdAt: string
    updatedAt: string
  }
}
