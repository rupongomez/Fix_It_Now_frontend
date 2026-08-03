// app/(dashboardGroup)/dashboard/customer/CustomerDashboardContent.tsx
"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Calendar,
  MapPin,
  Clock,
  DollarSign,
  User,
  Briefcase,
  Star,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Package,
  TrendingUp,
  BookOpen,
  ArrowRight,
} from "lucide-react"
import { toast } from "sonner"

import { getMe } from "@/service/getMe"
import { IUser } from "@/lib/types/UserTypes"
import { getLoggedInCustomersBookings } from "../dashboard/customer/_actions/customerBookingActions"

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

const STATUS_CONFIG: Record<
  string,
  { color: string; icon: React.ReactNode; label: string }
> = {
  REQUESTED: {
    color:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    icon: <AlertCircle className="size-4" />,
    label: "Requested",
  },
  ACCEPTED: {
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    icon: <CheckCircle2 className="size-4" />,
    label: "Accepted",
  },
  DECLINED: {
    color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    icon: <AlertCircle className="size-4" />,
    label: "Declined",
  },
  PAID: {
    color:
      "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
    icon: <CheckCircle2 className="size-4" />,
    label: "Paid",
  },
  IN_PROGRESS: {
    color:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    icon: <CheckCircle2 className="size-4" />,
    label: "In Progress",
  },
  COMPLETED: {
    color: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
    icon: <CheckCircle2 className="size-4" />,
    label: "Completed",
  },
  CANCELLED: {
    color: "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300",
    icon: <XCircle className="size-4" />,
    label: "Cancelled",
  },
}

export function CustomerDashboardContent() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [user, setUser] = useState<IUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const [bookingsRes, userData] = await Promise.all([
          getLoggedInCustomersBookings(),
          getMe(),
        ])

        console.log("Bookings:", bookingsRes)
        console.log("User:", userData)

        if (bookingsRes.success && bookingsRes.data) {
          setBookings(bookingsRes.data)
        } else {
          toast.error(bookingsRes.message || "Failed to fetch bookings")
        }

        if (userData.success && userData.data) {
          setUser(userData)
        }
      } catch (error) {
        console.error("Failed to fetch data:", error)
        toast.error("Something went wrong")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredBookings = selectedStatus
    ? bookings.filter((booking) => booking.status === selectedStatus)
    : bookings

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Calculate stats
  const totalBookings = bookings.length
  const completedBookings = bookings.filter(
    (b) => b.status === "COMPLETED"
  ).length
  const pendingBookings = bookings.filter(
    (b) => b.status === "REQUESTED" || b.status === "ACCEPTED"
  ).length
  const totalSpent = bookings
    .filter(
      (b) =>
        b.status === "COMPLETED" ||
        b.status === "PAID" ||
        b.status === "IN_PROGRESS"
    )
    .reduce((sum, b) => sum + parseFloat(b.totalPrice || "0"), 0)

  const statusCounts = {
    REQUESTED: bookings.filter((b) => b.status === "REQUESTED").length,
    ACCEPTED: bookings.filter((b) => b.status === "ACCEPTED").length,
    DECLINED: bookings.filter((b) => b.status === "DECLINED").length,
    PAID: bookings.filter((b) => b.status === "PAID").length,
    IN_PROGRESS: bookings.filter((b) => b.status === "IN_PROGRESS").length,
    COMPLETED: bookings.filter((b) => b.status === "COMPLETED").length,
    CANCELLED: bookings.filter((b) => b.status === "CANCELLED").length,
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Profile Skeleton */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              <Skeleton className="size-20 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-32" />
                <div className="flex gap-4">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Skeleton */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bookings Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-16 w-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Profile Card */}
      <Card className="overflow-hidden border-0 shadow-lg">
        <div className="h-24 bg-linear-to-r from-primary/20 to-primary/10" />
        <CardContent className="relative -mt-12">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end">
            <Avatar className="size-24 border-4 border-background shadow-lg">
              <AvatarImage
                src={
                  user?.data?.profileImage || "https://i.pravatar.cc/300?img=5"
                }
                alt={user?.data?.name || "User"}
              />
              <AvatarFallback className="text-2xl">
                {user?.data?.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-1 flex-wrap items-start justify-between gap-4 pb-2">
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  {user?.data?.name || "Customer"}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {user?.data?.email || ""}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="size-3" />
                    {user?.data?.location || "Location not set"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Badge variant="outline" className="text-xs">
                      {user?.data?.role || "Customer"}
                    </Badge>
                  </span>
                </div>
              </div>
              <Link href="/profile">
                <Button variant="outline" size="sm">
                  Edit Profile
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
              Completed
            </CardDescription>
            <CheckCircle2 className="size-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
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
              Total Spent
            </CardDescription>
            <DollarSign className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              ৳{totalSpent.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">Lifetime spending</p>
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
                ? `${Math.round((completedBookings / totalBookings) * 100)}%`
                : "0%"}
            </div>
            <p className="text-xs text-muted-foreground">Successful bookings</p>
          </CardContent>
        </Card>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-7">
        {Object.entries(statusCounts).map(([status, count]) => (
          <button
            key={status}
            onClick={() =>
              setSelectedStatus(selectedStatus === status ? null : status)
            }
            className={`rounded-lg p-4 text-left transition-all ${
              selectedStatus === status
                ? "bg-primary text-primary-foreground ring-2 ring-primary"
                : "bg-muted hover:bg-muted/80"
            }`}
          >
            <p className="text-2xl font-bold">{count}</p>
            <p className="line-clamp-2 text-xs opacity-80 md:text-sm">
              {STATUS_CONFIG[status]?.label}
            </p>
          </button>
        ))}
      </div>

      {/* Recent Bookings */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">Recent Bookings</CardTitle>
            <CardDescription>Your latest booking activity</CardDescription>
          </div>
          <Link href="/dashboard/customer/bookings">
            <Button variant="outline" size="sm" className="gap-1">
              View All
              <ArrowRight className="size-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {filteredBookings.length > 0 ? (
            <div className="space-y-4">
              {filteredBookings.slice(0, 5).map((booking) => {
                const statusConfig = STATUS_CONFIG[booking.status]

                return (
                  <div
                    key={booking.id}
                    className="flex flex-col gap-3 rounded-lg border border-border p-4 transition-colors hover:bg-muted/50 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex flex-1 flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">
                          Booking #{booking.id.slice(0, 8)}
                        </span>
                        <Badge className={statusConfig.color}>
                          {statusConfig.icon}
                          {statusConfig.label}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="size-3" />
                          {formatDate(booking.bookingTime)}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="size-3" />
                          {booking.customerAddress}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="size-3" />৳{booking.totalPrice}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link href={`/dashboard/customer/bookings/${booking.id}`}>
                        <Button variant="ghost" size="sm">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Package className="mb-4 size-12 text-muted-foreground" />
              <h3 className="text-lg font-semibold">No bookings yet</h3>
              <p className="text-sm text-muted-foreground">
                {selectedStatus
                  ? `No ${selectedStatus.toLowerCase()} bookings found`
                  : "Start browsing services and make your first booking"}
              </p>
              <Link href="/services">
                <Button className="mt-4">
                  Browse Services
                  <ArrowRight className="ml-2 size-4" />
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
