import { AdminDashboardContent } from "../../_components/AdminDashboardContent"

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          Manage users, bookings, and platform overview
        </p>
      </div>

      <AdminDashboardContent />
    </div>
  )
}
