import BookingPageComponent from "@/app/(dashboardGroup)/_components/BookingPageComponent"

export default function BookingsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-foreground">Bookings</h1>
        <p className="mt-1 text-muted-foreground">
          Manage your service bookings and schedule
        </p>
      </div>

      <BookingPageComponent />
    </div>
  )
}
