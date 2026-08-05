"use client"

import AvailabilityContent from "./AvailabilityContent"

export default function AvailabilityPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-foreground">Availability</h1>
        <p className="mt-1 text-muted-foreground">
          Manage your available time slots for bookings
        </p>
      </div>

      <AvailabilityContent />
    </div>
  )
}
