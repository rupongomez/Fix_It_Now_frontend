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
import { cancelBooking } from "@/app/(dashboardGroup)/_actions/cancelBooking"
import { ReviewModal } from "@/app/(dashboardGroup)/_components/ReviewModal"
import { submitReview } from "@/app/(dashboardGroup)/_actions/reviewActions"

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

  // AlertDialog state
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [bookingToCancel, setBookingToCancel] = useState<Booking | null>(null)

  // ✅ Review Modal state - Use technicianProfileId
  const [reviewModalOpen, setReviewModalOpen] = useState(false)
  const [bookingToReview, setBookingToReview] = useState<{
    id: string
    technicianProfileId: string
  } | null>(null)

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

  // Open cancel confirmation dialog
  const openCancelDialog = (booking: Booking) => {
    setBookingToCancel(booking)
    setCancelDialogOpen(true)
  }

  // Handle actual cancellation
  const confirmCancelBooking = async () => {
    if (!bookingToCancel) return

    setProcessingBookingId(bookingToCancel.id)

    // Optimistic update
    setBookings((prev) =>
      prev.map((booking) =>
        booking.id === bookingToCancel.id
          ? { ...booking, status: "CANCELLED" as Booking["status"] }
          : booking
      )
    )

    try {
      const response = await cancelBooking(bookingToCancel.id)
      console.log(response)
      if (!response.success) {
        throw new Error(response.message || "Failed to cancel booking")
      }

      toast.success("Booking cancelled successfully")
      setCancelDialogOpen(false)
      setBookingToCancel(null)
    } catch (error) {
      // Revert on error
      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === bookingToCancel.id
            ? { ...booking, status: "REQUESTED" as Booking["status"] }
            : booking
        )
      )
      toast.error(
        error instanceof Error ? error.message : "Failed to cancel booking"
      )
      console.error(error)
    } finally {
      setProcessingBookingId(null)
    }
  }

  // ✅ Open review modal - Map technicianId to technicianProfileId
  const openReviewModal = (booking: Booking) => {
    setBookingToReview({
      id: booking.id,
      technicianProfileId: booking.technicianId, // ✅ Map to technicianProfileId
    })
    setReviewModalOpen(true)
  }

  // ✅ Handle review submission - Send technicianProfileId
  const handleSubmitReview = async (data: {
    bookingId: string
    technicianProfileId: string
    rating: number
    comment: string
  }) => {
    const response = await submitReview(data)
    if (!response.success) {
      throw new Error(response.message || "Failed to submit review")
    }
  }

  const handlePayNow = async (bookingId: string) => {
    setProcessingBookingId(bookingId)

    try {
      const response = await checkoutService(bookingId)
      console.log("Payment response:", response)

      if (response.success && response.data?.paymentUrl) {
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

  const canCancel = (status: string) => {
    return status === "REQUESTED" || status === "ACCEPTED"
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

                      {/* Right Section - Customer Actions */}
                      <div className="flex flex-col gap-2 md:w-40">
                        {/* REQUESTED - Customer can Cancel */}
                        {booking.status === "REQUESTED" && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-full border-yellow-600 text-yellow-600 hover:bg-yellow-50 hover:text-yellow-700 dark:border-yellow-500 dark:text-yellow-400 dark:hover:bg-yellow-950"
                              onClick={() => openCancelDialog(booking)}
                              disabled={isProcessing(booking.id)}
                            >
                              {isProcessing(booking.id) ? (
                                <>
                                  <Loader2 className="mr-2 size-4 animate-spin" />
                                  Processing...
                                </>
                              ) : (
                                "Cancel Request"
                              )}
                            </Button>
                            <p className="text-center text-xs text-muted-foreground">
                              Awaiting technician response
                            </p>
                          </>
                        )}

                        {/* ACCEPTED - Customer can Pay or Cancel */}
                        {booking.status === "ACCEPTED" && (
                          <>
                            <Button
                              size="sm"
                              variant="default"
                              className="w-full bg-green-600 hover:bg-green-700"
                              onClick={() => handlePayNow(booking.id)}
                              disabled={isProcessing(booking.id)}
                            >
                              {isProcessing(booking.id) ? (
                                <>
                                  <Loader2 className="mr-2 size-4 animate-spin" />
                                  Processing...
                                </>
                              ) : (
                                <>
                                  <CreditCard className="mr-2 size-4" />
                                  Pay Now
                                </>
                              )}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-full border-rose-600 text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:border-rose-500 dark:text-rose-400 dark:hover:bg-rose-950"
                              onClick={() => openCancelDialog(booking)}
                              disabled={isProcessing(booking.id)}
                            >
                              {isProcessing(booking.id) ? (
                                <>
                                  <Loader2 className="mr-2 size-4 animate-spin" />
                                  Processing...
                                </>
                              ) : (
                                "Cancel Booking"
                              )}
                            </Button>
                          </>
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

                        {/* COMPLETED - Customer can Review */}
                        {booking.status === "COMPLETED" && (
                          <Button
                            size="sm"
                            variant="default"
                            className="w-full"
                            onClick={() => openReviewModal(booking)}
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

      {/* AlertDialog for Cancel Confirmation */}
      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Booking</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this booking?
              {bookingToCancel && (
                <span className="mt-2 block text-sm font-medium text-foreground">
                  Booking ID: {bookingToCancel.id.slice(0, 8)}...
                </span>
              )}
              <span className="mt-2 block text-rose-500 dark:text-rose-400">
                This action cannot be undone.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={!!processingBookingId}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmCancelBooking}
              disabled={!!processingBookingId}
              className="bg-rose-600 hover:bg-rose-700"
            >
              {processingBookingId ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Yes, Cancel Booking"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Review Modal */}
      <ReviewModal
        open={reviewModalOpen}
        onOpenChange={setReviewModalOpen}
        booking={bookingToReview}
        onSubmitReview={handleSubmitReview}
      />
    </div>
  )
}
