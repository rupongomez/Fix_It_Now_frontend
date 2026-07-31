export interface IDashBoardSidebarProps {
  user: {
    success: boolean
    statusCode: number
    message: string
    data: IUser
  }
}

export interface IUser {
  id: string
  name: string
  email: string
  phone: string
  location: string
  role: "ADMIN" | "CUSTOMER" | "TECHNICIAN"
  status: "ACTIVE" | "INACTIVE" | "BANNED"
  profileImage: string | null
  stripeCustomerId: string | null
  createdAt: string
  updatedAt: string
}
