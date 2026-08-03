import { CustomerDashboardContent } from "../../_components/CustomerDashboard"

export default function CustomerDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-foreground">
          Customer Dashboard
        </h1>
        <p className="mt-1 text-muted-foreground">
          Overview of your bookings and activity
        </p>
      </div>

      <CustomerDashboardContent />
    </div>
  )
}
