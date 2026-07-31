"use client"

import { useEffect, useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import { Calendar, CheckCircle2, Clock, DollarSign, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getBookingsForTechnician } from "../_actions/bookingDetailsForTechnician"
import DashboardLoadingSkeleton from "./DashboardLoadingSkeleton"

interface Booking {
  id: string
  customerId: string
  technicianId: string
  serviceId: string
  availabilitySlotId: string
  bookingTime: string
  customerAddress: string
  note: string
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
}

const COLORS = {
  REQUESTED: "#fbbf24",
  ACCEPTED: "#3b82f6",
  DECLINED: "#ef4444",
  PAID: "#8b5cf6",
  IN_PROGRESS: "#22c55e",
  COMPLETED: "#6b7280",
  CANCELLED: "#e11d48",
}

const STATUS_LABELS = {
  REQUESTED: "Requested",
  ACCEPTED: "Accepted",
  DECLINED: "Declined",
  PAID: "Paid",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
}

const TechnicianDashboardStats = () => {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setIsLoading(true)
        const response = await getBookingsForTechnician()
        console.log("Bookings response:", response)

        if (response.success && response.data) {
          setBookings(response.data)
        } else {
          setError(response.message || "Failed to fetch bookings")
        }
      } catch (err) {
        console.error("Error fetching bookings:", err)
        setError("Failed to load bookings")
      } finally {
        setIsLoading(false)
      }
    }

    fetchBookings()
  }, [])

  const statusCounts = bookings.reduce(
    (acc: Record<string, number>, booking) => {
      acc[booking.status] = (acc[booking.status] || 0) + 1
      return acc
    },
    {}
  )

  const barChartData = Object.entries(statusCounts).map(([status, count]) => ({
    status: STATUS_LABELS[status as keyof typeof STATUS_LABELS] || status,
    count: count,
    color: COLORS[status as keyof typeof COLORS],
  }))

  const pieChartData = Object.entries(statusCounts).map(([status, count]) => ({
    name: STATUS_LABELS[status as keyof typeof STATUS_LABELS] || status,
    value: count,
    color: COLORS[status as keyof typeof COLORS],
  }))

  const monthlyBookings = bookings.reduce(
    (acc: Record<string, number>, booking) => {
      const month = new Date(booking.createdAt).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
      acc[month] = (acc[month] || 0) + 1
      return acc
    },
    {}
  )

  const lineChartData = Object.entries(monthlyBookings)
    .map(([month, count]) => ({ month, count }))
    .sort((a, b) => {
      const dateA = new Date(a.month + " 1, 2024")
      const dateB = new Date(b.month + " 1, 2024")
      return dateA.getTime() - dateB.getTime()
    })

  const totalBookings = bookings.length
  const pendingBookings = bookings.filter(
    (b) => b.status === "REQUESTED"
  ).length
  const completedBookings = bookings.filter(
    (b) => b.status === "COMPLETED"
  ).length
  const totalEarnings = bookings
    .filter(
      (b) =>
        b.status === "COMPLETED" ||
        b.status === "IN_PROGRESS" ||
        b.status === "PAID"
    )
    .reduce((sum, b) => sum + parseFloat(b.totalPrice || "0"), 0)

  // Loading state
  if (isLoading) {
    return <DashboardLoadingSkeleton />
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-500">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }
  return (
    <div>
      {" "}
      {/* Stats Cards - Clean, No Random Numbers */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-sm font-medium">
              Total Bookings
            </CardDescription>
            <Calendar className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBookings}</div>
            <p className="text-xs text-muted-foreground">All time bookings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-sm font-medium">
              Pending Requests
            </CardDescription>
            <Clock className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">
              {pendingBookings}
            </div>
            <p className="text-xs text-muted-foreground">
              Awaiting your response
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-sm font-medium">
              Completed Jobs
            </CardDescription>
            <CheckCircle2 className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {completedBookings}
            </div>
            <p className="text-xs text-muted-foreground">
              Successfully completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-sm font-medium">
              Total Earnings
            </CardDescription>
            <DollarSign className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              ৳{totalEarnings.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">Lifetime earnings</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Bar Chart - Now vertical */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">
              Booking Status Distribution
            </CardTitle>
            <CardDescription>Number of bookings by status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-62.5">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="status" type="category" width={80} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" radius={[0, 4, 4, 0]}>
                    {barChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Pie Chart - Cleaner without outside labels */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-62.5">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      percent ? `${(percent * 100).toFixed(0)}%` : "0%"
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Legend below pie chart */}
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {pieChartData.map((item, index) => (
                <div key={index} className="flex items-center gap-1 text-xs">
                  <span
                    className="size-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span>{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Line Chart - Monthly Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Monthly Booking Trend</CardTitle>
          <CardDescription>Bookings over the last 6 months</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-62.5">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#8884d8"
                  strokeWidth={2}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">Recent Bookings</CardTitle>
            <CardDescription>Your latest booking requests</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </CardHeader>
        <CardContent>
          {bookings.length > 0 ? (
            <div className="space-y-3">
              {bookings.slice(0, 5).map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-muted p-2">
                      <Calendar className="size-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">
                        Booking #{booking.id.slice(0, 8)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(booking.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="font-medium">৳{booking.totalPrice}</p>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        booking.status === "REQUESTED"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                          : booking.status === "ACCEPTED"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                            : booking.status === "DECLINED"
                              ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                              : booking.status === "PAID"
                                ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
                                : booking.status === "IN_PROGRESS"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                  : booking.status === "COMPLETED"
                                    ? "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
                                    : "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300"
                      }`}
                    >
                      {STATUS_LABELS[
                        booking.status as keyof typeof STATUS_LABELS
                      ] || booking.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="mb-4 size-12 text-muted-foreground" />
              <h3 className="text-lg font-semibold">No bookings yet</h3>
              <p className="text-sm text-muted-foreground">
                Your bookings will appear here
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default TechnicianDashboardStats
