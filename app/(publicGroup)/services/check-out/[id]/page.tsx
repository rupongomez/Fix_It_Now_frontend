"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Calendar,
  MapPin,
  Clock,
  DollarSign,
  User,
  CreditCard,
  ShieldCheck,
  Lock,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react"
import { toast } from "sonner"
import { checkoutService } from "@/app/(publicGroup)/_actions/checkoutAction"
import { getBookingDetails } from "@/app/(publicGroup)/_actions/bookingAction"

interface Technician {
  id: string
  userId: string
  bio: string
  experience: number
  hourlyRate: string
  averageRating: number
  completedJobs: number
  location: string
  isAvailable: boolean
  createdAt: string
  updatedAt: string
}

interface BookingData {
  id: string
  customerId: string
  technicianId: string
  serviceId: string
  availabilitySlotId: string
  bookingTime: string
  customerAddress: string
  note: string
  totalPrice: string
  status: string
  createdAt: string
  updatedAt: string
  technician: Technician
}

interface BookingResponse {
  success: boolean
  statusCode: number
  message: string
  data: BookingData
}

export default function CheckoutPage() {
  const [booking, setBooking] = useState<BookingData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const params = useParams()
  const router = useRouter()

  //   Get the id from params
  const bookingId = params?.id as string

  useEffect(() => {
    const fetchBookingDetails = async () => {
      //   Check if bookingId exists
      if (!bookingId) {
        setError("Booking ID is required")
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        const response: BookingResponse = await getBookingDetails(bookingId)
        console.log("Booking details:", response)

        if (response.success && response.data) {
          setBooking(response.data)
        } else {
          setError(response.message || "Failed to load booking details")
          toast.error(response.message || "Failed to load booking details")
        }
      } catch (error) {
        console.error("Error fetching booking:", error)
        setError("Failed to load booking details")
        toast.error("Something went wrong")
      } finally {
        setIsLoading(false)
      }
    }

    fetchBookingDetails()
  }, [bookingId])

  const handleCheckout = async () => {
    if (!bookingId) return

    setIsProcessing(true)
    try {
      const response = await checkoutService(bookingId)
      console.log("Checkout response:", response)

      if (response.success && response.data?.paymentUrl) {
        window.location.href = response.data.paymentUrl
      } else {
        toast.error(response.message || "Failed to initiate payment")
        setIsProcessing(false)
      }
    } catch (error) {
      console.error("Checkout error:", error)
      toast.error("Failed to initiate payment. Please try again.")
      setIsProcessing(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-10">
        <div className="space-y-6">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-12 w-64" />
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="md:col-span-2">
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-24" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !booking) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-10">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <AlertCircle className="mb-4 size-12 text-red-500" />
            <h3 className="text-xl font-semibold text-foreground">
              Something went wrong
            </h3>
            <p className="mt-2 text-muted-foreground">
              {error || "Booking not found"}
            </p>
            <Button className="mt-6" onClick={() => router.back()}>
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const { technician } = booking
  const canCheckout = booking.status === "ACCEPTED"

  return (
    <div className="container mx-auto max-w-4xl px-4 py-10">
      <Button
        variant="ghost"
        className="mb-6 -ml-4"
        onClick={() => router.back()}
      >
        <ArrowLeft className="mr-2 size-4" />
        Back
      </Button>

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Checkout</h1>
          <p className="text-muted-foreground">
            Review your booking details and complete payment
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-6 md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Booking Details</CardTitle>
                <CardDescription>
                  Review your booking information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="size-4 text-muted-foreground" />
                    <span className="text-sm">
                      {formatDate(booking.bookingTime)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="size-4 text-muted-foreground" />
                    <span className="text-sm">{booking.customerAddress}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="size-4 text-muted-foreground" />
                    <span className="text-sm">Service duration: 2 hours</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="size-4 text-muted-foreground" />
                    <span className="text-sm">
                      {technician?.location || "Location"}
                    </span>
                  </div>
                </div>

                {booking.note && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Additional Notes
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {booking.note}
                      </p>
                    </div>
                  </>
                )}

                <div className="mt-2">
                  <Badge
                    className={`${
                      booking.status === "ACCEPTED"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                        : booking.status === "REQUESTED"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
                    }`}
                  >
                    Status: {booking.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Technician</CardTitle>
                <CardDescription>
                  Who will be providing the service
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
                    <User className="size-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      Technician ID: {booking.technicianId.slice(0, 8)}...
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Location: {technician?.location || "Not specified"}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        <CheckCircle2 className="mr-1 size-3 text-green-500" />
                        Verified
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        ⭐ {technician?.averageRating || 0}/5
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="text-lg">Payment Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Service Fee</span>
                    <span className="font-medium text-foreground">
                      ৳{parseFloat(booking.totalPrice).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Platform Fee</span>
                    <span className="font-medium text-foreground">৳0.00</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="font-semibold text-foreground">Total</span>
                    <span className="text-2xl font-bold text-primary">
                      ৳{parseFloat(booking.totalPrice).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="rounded-lg bg-muted/50 p-3">
                  <div className="flex items-center gap-2">
                    {booking.status === "ACCEPTED" ? (
                      <CheckCircle2 className="size-4 text-green-500" />
                    ) : (
                      <AlertCircle className="size-4 text-yellow-500" />
                    )}
                    <span className="text-sm font-medium">
                      Status: {booking.status}
                    </span>
                  </div>
                  {!canCheckout && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      This booking is not ready for payment. Please wait for
                      technician acceptance.
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-center gap-2 rounded-lg border border-green-200 bg-green-50 p-2 dark:border-green-900/30 dark:bg-green-950/30">
                  <Lock className="size-4 text-green-600 dark:text-green-400" />
                  <span className="text-xs text-green-700 dark:text-green-300">
                    Secure Payment via Stripe
                  </span>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col gap-3">
                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleCheckout}
                  disabled={!canCheckout || isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Processing...
                    </>
                  ) : canCheckout ? (
                    <>
                      <CreditCard className="mr-2 size-4" />
                      Pay Now
                    </>
                  ) : (
                    "Unavailable"
                  )}
                </Button>

                <p className="text-center text-xs text-muted-foreground">
                  <ShieldCheck className="inline size-3" />
                  Your payment is secure and encrypted
                </p>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
