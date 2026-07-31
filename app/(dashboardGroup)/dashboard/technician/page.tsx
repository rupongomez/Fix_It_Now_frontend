import TechnicianDashboardStats from "../../_components/TechnicianDashboardStats"

export default function TechnicianDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-foreground">
          Technician Dashboard
        </h1>
        <p className="mt-1 text-muted-foreground">
          Overview of your bookings and performance
        </p>
      </div>

      <TechnicianDashboardStats />
    </div>
  )
}
