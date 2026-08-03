// app/(dashboardGroup)/dashboard/admin/AdminDashboardContent.tsx
"use client"

import { useEffect, useState } from "react"
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Users,
  BookOpen,
  DollarSign,
  TrendingUp,
  UserCheck,
  UserX,
  Calendar,
  Loader2,
} from "lucide-react"
import { toast } from "sonner"
import {
  getAllBookings,
  getAllUsers,
  updateUserStatus,
} from "../_actions/adminActions"

interface User {
  id: string
  name: string
  email: string
  phone: string
  location: string
  role: "ADMIN" | "CUSTOMER" | "TECHNICIAN"
  status: "ACTIVE" | "INACTIVE" | "BANNED"
  profileImage?: string
  createdAt: string
  updatedAt: string
}

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

const ROLE_BADGE_COLORS = {
  ADMIN:
    "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  CUSTOMER: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  TECHNICIAN:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
}

const STATUS_BADGE_COLORS = {
  ACTIVE:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  INACTIVE:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  BANNED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
}

export function AdminDashboardContent() {
  const [users, setUsers] = useState<User[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null)

  // ✅ AlertDialog state
  const [alertDialogOpen, setAlertDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<{
    id: string
    status: string
    name: string
  } | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const [usersRes, bookingsRes] = await Promise.all([
          getAllUsers(),
          getAllBookings(),
        ])

        console.log("Users:", usersRes)
        console.log("Bookings:", bookingsRes)

        if (usersRes.success && usersRes.data) {
          setUsers(usersRes.data)
        } else {
          toast.error(usersRes.message || "Failed to fetch users")
        }

        if (bookingsRes.success && bookingsRes.data) {
          setBookings(bookingsRes.data)
        } else {
          toast.error(bookingsRes.message || "Failed to fetch bookings")
        }
      } catch (error) {
        console.error("Failed to fetch admin data:", error)
        toast.error("Something went wrong")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // ✅ Open confirmation dialog
  const openConfirmDialog = (
    userId: string,
    currentStatus: string,
    userName: string
  ) => {
    setSelectedUser({ id: userId, status: currentStatus, name: userName })
    setAlertDialogOpen(true)
  }

  // ✅ Handle the actual status change
  const confirmStatusChange = async () => {
    if (!selectedUser) return

    const { id, status: currentStatus } = selectedUser
    const newStatus = currentStatus === "ACTIVE" ? "BANNED" : "ACTIVE"
    const action = newStatus === "BANNED" ? "ban" : "unban"

    setUpdatingUserId(id)

    // Optimistic update
    setUsers((prev) =>
      prev.map((user) =>
        user.id === id ? { ...user, status: newStatus as User["status"] } : user
      )
    )

    try {
      const response = await updateUserStatus(id, newStatus)
      console.log("Update response:", response)

      if (!response.success) {
        throw new Error(response.message || `Failed to ${action} user`)
      }

      toast.success(`User ${action}ned successfully`)
    } catch (error) {
      // Revert on error
      setUsers((prev) =>
        prev.map((user) =>
          user.id === id
            ? { ...user, status: currentStatus as User["status"] }
            : user
        )
      )
      toast.error(
        error instanceof Error ? error.message : `Failed to ${action} user`
      )
      console.error(error)
    } finally {
      setUpdatingUserId(null)
      setAlertDialogOpen(false)
      setSelectedUser(null)
    }
  }

  const totalUsers = users.length
  const activeUsers = users.filter((u) => u.status === "ACTIVE").length
  const bannedUsers = users.filter((u) => u.status === "BANNED").length
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

  if (isLoading) {
    return (
      <div className="space-y-6">
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
        <div className="grid gap-6 lg:grid-cols-2">
          {[...Array(2)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-64 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

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
            <p className="text-xs text-muted-foreground">
              {activeUsers} active • {bannedUsers} banned
            </p>
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

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">User Management</CardTitle>
          <CardDescription>
            Manage user accounts and permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {user.location}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{user.email}</span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          ROLE_BADGE_COLORS[
                            user.role as keyof typeof ROLE_BADGE_COLORS
                          ]
                        }
                      >
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          STATUS_BADGE_COLORS[
                            user.status as keyof typeof STATUS_BADGE_COLORS
                          ]
                        }
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant={
                          user.status === "ACTIVE" ? "destructive" : "default"
                        }
                        onClick={() =>
                          openConfirmDialog(user.id, user.status, user.name)
                        }
                        disabled={
                          updatingUserId === user.id || user.role === "ADMIN"
                        }
                      >
                        {updatingUserId === user.id ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : user.status === "ACTIVE" ? (
                          <UserX className="size-4" />
                        ) : (
                          <UserCheck className="size-4" />
                        )}
                        <span className="ml-2">
                          {user.status === "ACTIVE" ? "Ban" : "Unban"}
                        </span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

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

      {/* ✅ AlertDialog for confirmation */}
      <AlertDialog open={alertDialogOpen} onOpenChange={setAlertDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {selectedUser?.status === "ACTIVE" ? "Ban User" : "Unban User"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to{" "}
              {selectedUser?.status === "ACTIVE" ? "ban" : "unban"}{" "}
              <strong>{selectedUser?.name}</strong>?
              {selectedUser?.status === "ACTIVE" && (
                <span className="mt-2 block text-red-500">
                  This action will prevent the user from accessing the platform.
                </span>
              )}
              {selectedUser?.status === "BANNED" && (
                <span className="mt-2 block text-green-500">
                  This will restore the user`&apos;`s access to the platform.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmStatusChange}
              className={
                selectedUser?.status === "ACTIVE"
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-green-600 hover:bg-green-700"
              }
            >
              {selectedUser?.status === "ACTIVE" ? "Ban" : "Unban"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
