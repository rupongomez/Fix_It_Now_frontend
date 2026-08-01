export interface IBookingRequestPayload {
  technicianIdToBook: string
  serviceId: string
  availabilitySlotId: string
  bookingTime: string
  customerAddress: string
  note?: string
}
