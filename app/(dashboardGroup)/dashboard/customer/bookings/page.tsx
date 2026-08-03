"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Calendar,
  MapPin,
  Clock,
  DollarSign,
  User,
  FileText,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  CreditCard,
  XCircle,
  Loader2,
} from "lucide-react"
import { toast } from "sonner"
import { getLoggedInCustomersBookings } from "../_actions/customerBookingActions"
import {
  checkoutService,
  getPaymentHistoryForCustomer,
} from "@/app/(publicGroup)/_actions/checkoutAction"
import { useRouter } from "next/navigation"
import { IPayment } from "@/lib/types/paymentHistory"
import Link from "next/link"
// import { initiatePayment } from "../../_actions/paymentActions"

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
  technician?: {
    name: string
    email: string
    phone: string
  }
  service?: {
    title: string
  }
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

export default function CustomerBookingPageComponent() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
  const [payment, setPayment] = useState<IPayment | null>(null)
  const [processingBookingId, setProcessingBookingId] = useState<string | null>(
    null
  )
  const router = useRouter()
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setIsLoading(true)
        const response = await getLoggedInCustomersBookings()

        if (response.success && response.data) {
          setBookings(response.data)
          const paymentHistory = await getPaymentHistoryForCustomer()
          if (paymentHistory.success) {
            setPayment(paymentHistory)
          }
        } else {
          toast.error(response.message || "Failed to fetch bookings")
        }
      } catch (error) {
        console.error("Failed to fetch bookings:", error)
        toast.error("Something went wrong")
      } finally {
        setIsLoading(false)
      }
    }

    fetchBookings()
  }, [])

  const handlePayNow = async (bookingId: string) => {
    setProcessingBookingId(bookingId)

    try {
      const response = await checkoutService(bookingId)
      console.log("Payment response:", response)

      if (response.success && response.data?.paymentUrl) {
        // Redirect to payment gateway
        router.push(response.data.paymentUrl)
      } else {
        toast.error(response.message || "Failed to initiate payment")
      }
    } catch (error) {
      console.error("Payment error:", error)
      toast.error("Failed to initiate payment. Please try again.")
    } finally {
      setProcessingBookingId(null)
    }
  }

  const handleLeaveReview = (bookingId: string) => {
    // Redirect to review page
    router.push(`/review/${bookingId}`)
  }

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

  const statusCounts = {
    REQUESTED: bookings.filter((b) => b.status === "REQUESTED").length,
    ACCEPTED: bookings.filter((b) => b.status === "ACCEPTED").length,
    DECLINED: bookings.filter((b) => b.status === "DECLINED").length,
    PAID: bookings.filter((b) => b.status === "PAID").length,
    IN_PROGRESS: bookings.filter((b) => b.status === "IN_PROGRESS").length,
    COMPLETED: bookings.filter((b) => b.status === "COMPLETED").length,
    CANCELLED: bookings.filter((b) => b.status === "CANCELLED").length,
  }

  const canPay = (status: string) => {
    return status === "ACCEPTED"
  }

  const canReview = (status: string) => {
    return status === "COMPLETED"
  }

  const isProcessing = (bookingId: string) => {
    return processingBookingId === bookingId
  }

  return (
    <div>
      {/* Status Overview Cards */}
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

      {/* Bookings List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">
            {selectedStatus ? `${selectedStatus} Bookings` : "All Bookings"}
          </h2>
          {selectedStatus && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedStatus(null)}
            >
              Clear Filter
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="py-6">
                  <div className="space-y-3">
                    <div className="h-4 w-1/2 rounded bg-muted" />
                    <div className="h-4 w-3/4 rounded bg-muted" />
                    <div className="h-4 w-1/3 rounded bg-muted" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredBookings.length > 0 ? (
          <div className="space-y-4">
            {filteredBookings.map((booking) => {
              const statusConfig = STATUS_CONFIG[booking.status]

              return (
                <Card
                  key={booking.id}
                  className="transition-shadow hover:shadow-md"
                >
                  <CardContent className="py-6">
                    <div className="grid gap-6 md:grid-cols-[1fr_auto]">
                      {/* Left Section - Main Info */}
                      <div className="space-y-4">
                        {/* Header with Status */}
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-foreground">
                              {booking.service?.title || "Service Booking"}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              ID: {booking.id.slice(0, 8)}...
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Technician:{" "}
                              {booking.technician?.name || "Loading..."}
                            </p>
                          </div>
                          <Badge
                            className={`${statusConfig.color} flex items-center gap-1`}
                          >
                            {statusConfig.icon}
                            {statusConfig.label}
                          </Badge>
                        </div>

                        {/* Booking Details Grid */}
                        <div className="grid gap-3 sm:grid-cols-2">
                          <div className="flex items-start gap-3">
                            <Calendar className="mt-1 size-4 shrink-0 text-primary" />
                            <div>
                              <p className="text-xs text-muted-foreground">
                                Booking Date & Time
                              </p>
                              <p className="text-sm font-medium text-foreground">
                                {formatDate(booking.bookingTime)}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <MapPin className="mt-1 size-4 shrink-0 text-primary" />
                            <div>
                              <p className="text-xs text-muted-foreground">
                                Service Location
                              </p>
                              <p className="truncate text-sm font-medium text-foreground">
                                {booking.customerAddress}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <DollarSign className="mt-1 size-4 shrink-0 text-primary" />
                            <div>
                              <p className="text-xs text-muted-foreground">
                                Total Price
                              </p>
                              <p className="text-sm font-medium text-foreground">
                                ৳{booking.totalPrice}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <Clock className="mt-1 size-4 shrink-0 text-primary" />
                            <div>
                              <p className="text-xs text-muted-foreground">
                                Booked On
                              </p>
                              <p className="text-sm font-medium text-foreground">
                                {new Date(
                                  booking.createdAt
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Notes */}
                        {booking.note && (
                          <>
                            <Separator className="my-2" />
                            <div className="flex gap-3">
                              <FileText className="mt-1 size-4 shrink-0 text-primary" />
                              <div>
                                <p className="text-xs text-muted-foreground">
                                  Your Notes
                                </p>
                                <p className="text-sm text-foreground">
                                  {booking.note}
                                </p>
                              </div>
                            </div>
                          </>
                        )}
                      </div>

                      {/* ✅ Right Section - Customer Actions */}
                      <div className="flex flex-col gap-2 md:w-40">
                        {/* REQUESTED - Customer just waits */}
                        {booking.status === "REQUESTED" && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-full"
                              disabled
                            >
                              <Clock className="mr-2 size-4" />
                              Awaiting Response
                            </Button>
                            <p className="text-center text-xs text-muted-foreground">
                              Technician will respond shortly
                            </p>
                          </>
                        )}

                        {/* ✅ ACCEPTED - Customer can Pay */}
                        {booking.status === "ACCEPTED" && (
                          <Button
                            size="sm"
                            variant="default"
                            className="w-full bg-green-600 hover:bg-green-700"

                            disabled={
                              isProcessing(booking.id) &&
                              payment?.data.bookingId === booking.id
                            }
                          >
                            {isProcessing(booking.id) ? (
                              <>
                                <Loader2 className="mr-2 size-4 animate-spin" />
                                Processing...
                              </>
                            ) : (
                              <>
                                <CreditCard className="mr-2 size-4" />
                                <Link
                                  href={`/services/check-out/${booking.id}`}
                                >
                                  Checkout now
                                </Link>
                              </>
                            )}
                          </Button>
                        )}

                        {/* DECLINED - Disabled */}
                        {booking.status === "DECLINED" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full"
                            disabled
                          >
                            Declined by Technician
                          </Button>
                        )}

                        {/* PAID - Waiting for technician */}
                        {booking.status === "PAID" && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-full"
                              disabled
                            >
                              <Clock className="mr-2 size-4" />
                              Awaiting Start
                            </Button>
                            <p className="text-center text-xs text-muted-foreground">
                              Technician will start soon
                            </p>
                          </>
                        )}

                        {/* IN_PROGRESS */}
                        {booking.status === "IN_PROGRESS" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full"
                            disabled
                          >
                            <Loader2 className="mr-2 size-4 animate-spin" />
                            In Progress
                          </Button>
                        )}

                        {/* ✅ COMPLETED - Customer can Review */}
                        {booking.status === "COMPLETED" && (
                          <Button
                            size="sm"
                            variant="default"
                            className="w-full"
                            onClick={() => handleLeaveReview(booking.id)}
                          >
                            <MessageSquare className="mr-2 size-4" />
                            Leave Review
                          </Button>
                        )}

                        {/* CANCELLED - Disabled */}
                        {booking.status === "CANCELLED" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full"
                            disabled
                          >
                            Cancelled
                          </Button>
                        )}

                        <Button
                          size="sm"
                          variant="ghost"
                          className="w-full gap-1"
                        >
                          <MessageSquare className="size-4" />
                          Contact Support
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <Calendar className="mb-4 size-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                {selectedStatus ? "No bookings" : "No bookings yet"}
              </h3>
              <p className="text-muted-foreground">
                {selectedStatus
                  ? `You don't have any ${selectedStatus.toLowerCase()} bookings`
                  : "Your bookings will appear here"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
