import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, BookOpen, DollarSign, TrendingUp, Calendar } from "lucide-react"
import { getAllBookings, getAllUsers } from "../_actions/adminActions"
import { UserTable } from "./UseresTable"

// Booking interface
interface Booking {
  id: string
  customerId: string
  technicianId: string
  serviceId: string
  bookingTime: string
  customerAddress: string
  totalPrice: string
  status:
    | "REQUESTED"
    | "ACCEPTED"
    | "DECLINED"
    | "PAID"
    | "IN_PROGRESS"
    | "COMPLETED"
    | "CANCELLED"
  createdAt: string
  updatedAt: string
  customer?: { name: string }
  technician?: { name: string }
  service?: { title: string }
}

const STATUS_CONFIG: Record<string, { color: string; label: string }> = {
  REQUESTED: {
    color:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    label: "Requested",
  },
  ACCEPTED: {
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    label: "Accepted",
  },
  DECLINED: {
    color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    label: "Declined",
  },
  PAID: {
    color:
      "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
    label: "Paid",
  },
  IN_PROGRESS: {
    color:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    label: "In Progress",
  },
  COMPLETED: {
    color: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
    label: "Completed",
  },
  CANCELLED: {
    color: "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300",
    label: "Cancelled",
  },
}

export async function AdminDashboardContent() {
  // Fetch bookings
  const bookingsRes = await getAllBookings()
  const bookings: Booking[] = bookingsRes.success ? bookingsRes.data : []

  // Fetch total users count (for stats)
  const usersRes = await getAllUsers({ page: 1, limit: 1 })
  const totalUsers = usersRes.success ? usersRes.data.totalUserCount : 0

  // Stats from bookings
  const totalBookings = bookings.length
  const pendingBookings = bookings.filter(
    (b) => b.status === "REQUESTED"
  ).length
  const totalRevenue = bookings
    .filter(
      (b) =>
        b.status === "COMPLETED" ||
        b.status === "IN_PROGRESS" ||
        b.status === "PAID"
    )
    .reduce((sum, b) => sum + parseFloat(b.totalPrice || "0"), 0)

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-sm font-medium">
              Total Users
            </CardDescription>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">Registered users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-sm font-medium">
              Total Bookings
            </CardDescription>
            <BookOpen className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBookings}</div>
            <p className="text-xs text-muted-foreground">
              {pendingBookings} pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-sm font-medium">
              Total Revenue
            </CardDescription>
            <DollarSign className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              ৳{totalRevenue.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">Lifetime revenue</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-sm font-medium">
              Completion Rate
            </CardDescription>
            <TrendingUp className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalBookings > 0
                ? `${Math.round((bookings.filter((b) => b.status === "COMPLETED").length / totalBookings) * 100)}%`
                : "0%"}
            </div>
            <p className="text-xs text-muted-foreground">Successful bookings</p>
          </CardContent>
        </Card>
      </div>

      {/* User Table */}
      <UserTable />

      {/* Recent Bookings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Bookings</CardTitle>
          <CardDescription>
            Latest booking activity on the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          {bookings.length > 0 ? (
            <div className="space-y-4">
              {bookings.slice(0, 5).map((booking) => (
                <div
                  key={booking.id}
                  className="flex flex-col gap-3 rounded-lg border border-border p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex flex-1 flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground">
                        {booking.service?.title || "Service Booking"}
                      </p>
                      <Badge
                        className={STATUS_CONFIG[booking.status]?.color || ""}
                      >
                        {STATUS_CONFIG[booking.status]?.label || booking.status}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="size-3" />
                        {booking.customer?.name || "Customer"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="size-3" />
                        {new Date(booking.bookingTime).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="size-3" />৳{booking.totalPrice}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      ৳{booking.totalPrice}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Calendar className="mb-4 size-12 text-muted-foreground" />
              <h3 className="text-lg font-semibold">No bookings yet</h3>
              <p className="text-sm text-muted-foreground">
                Bookings will appear here
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
