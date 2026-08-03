export interface IPayment {
  success: boolean
  statusCode: number
  message: string
  data: {
    id: string
    bookingId: string
    customerId: string
    transactionId: string
    stripeCustomerId: string
    amount: string
    currency: string
    status: string
    paidAt: string
    createdAt: string
    updatedAt: string
  }
}
