"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Clock,
  DollarSign,
  MapPin,
  Star,
  MessageSquare,
  Share2,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Wrench,
  User,
  ArrowLeft,
  Loader2,
} from "lucide-react"
import { toast } from "sonner"
import { getServiceDetails } from "@/app/(publicGroup)/_actions/serviceDetailsAction"
import { BookingModal } from "@/app/(publicGroup)/_components/BookingModal"

interface ServiceData {
  id: string
  technicianProfileId: string
  categoryId: string
  title: string
  description: string
  price: string
  duration: number
  location: string
  createdAt: string
  updatedAt: string
}

interface ServiceResponse {
  success: boolean
  statusCode: number
  message: string
  data: ServiceData
}

export default function ServiceDetailsPage() {
  const [service, setService] = useState<ServiceData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isBooking, setIsBooking] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const params = useParams()
  const router = useRouter()

  useEffect(() => {
    const fetchService = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await getServiceDetails(params.id as string)

        if (response.success && response.data) {
          console.log(response.data.technicianProfileId)
          setService(response.data)
        } else {
          setError(response.message || "Service not found")
          toast.error(response.message || "Failed to load service")
        }
      } catch (error) {
        console.error("Failed to fetch service:", error)
        setError("Failed to load service details")
        toast.error("Something went wrong. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      fetchService()
    }
  }, [params.id])

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: service?.title,
          text: service?.description,
          url: window.location.href,
        })
      } else {
        await navigator.clipboard.writeText(window.location.href)
        toast.success("Link copied to clipboard!")
      }
    } catch (error) {
      // User cancelled share dialog
      if (error instanceof Error && error.name !== "AbortError") {
        toast.error("Failed to share")
      }
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-10">
        <div className="space-y-6">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-96 w-full rounded-2xl" />
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-24 w-full" />
              <div className="grid grid-cols-3 gap-6">
                <Skeleton className="h-24" />
                <Skeleton className="h-24" />
                <Skeleton className="h-24" />
              </div>
            </div>
            <div>
              <Skeleton className="h-64 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !service) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-10">
        <Button
          variant="ghost"
          className="mb-6 -ml-4"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Card>
          <CardHeader>
            <CardTitle className="text-red-500">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error || "Service not found"}</p>
            <Button className="mt-4" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-10">
      {/* Back Button */}
      <Button
        variant="ghost"
        className="mb-6 -ml-4"
        onClick={() => router.back()}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Services
      </Button>

      {/* Hero Section with Service Image Placeholder */}
      <div className="relative mb-12 h-96 overflow-hidden rounded-2xl bg-linear-to-br from-primary/20 via-primary/10 to-background">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-32 w-32 items-center justify-center rounded-full bg-primary/10">
              <Wrench className="size-16 text-primary/40" strokeWidth={1} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column - Service Info */}
        <div className="space-y-8 lg:col-span-2">
          {/* Title and Rating */}
          <div>
            <h1 className="mb-4 text-5xl font-bold tracking-tight text-foreground">
              {service.title}
            </h1>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="size-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <span className="text-lg font-semibold text-foreground">
                  5.0
                </span>
                <span className="text-sm text-muted-foreground">
                  (24 reviews)
                </span>
              </div>
            </div>
          </div>

          {/* Service Description */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">
              About This Service
            </h2>
            <p className="text-lg leading-relaxed text-foreground/80">
              {service.description}
            </p>
          </div>

          {/* Service Details Grid */}
          <div className="grid grid-cols-3 gap-6 border-y border-border py-8">
            <div className="space-y-2">
              <div className="mb-3 flex items-center gap-2">
                <Clock className="size-5 text-primary" />
                <p className="text-sm font-semibold text-muted-foreground">
                  Duration
                </p>
              </div>
              <p className="text-2xl font-bold text-foreground">
                {service.duration}
              </p>
              <p className="text-xs text-muted-foreground">hours</p>
            </div>

            <div className="space-y-2">
              <div className="mb-3 flex items-center gap-2">
                <MapPin className="size-5 text-primary" />
                <p className="text-sm font-semibold text-muted-foreground">
                  Location
                </p>
              </div>
              <p className="text-2xl font-bold text-foreground">
                {service.location}
              </p>
              <p className="text-xs text-muted-foreground">Service area</p>
            </div>

            <div className="space-y-2">
              <div className="mb-3 flex items-center gap-2">
                <AlertCircle className="size-5 text-primary" />
                <p className="text-sm font-semibold text-muted-foreground">
                  Response
                </p>
              </div>
              <p className="text-2xl font-bold text-foreground">~2h</p>
              <p className="text-xs text-muted-foreground">average time</p>
            </div>
          </div>

          {/* What's Included */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-foreground">
              What`&apos;`s Included
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-1 size-5 shrink-0 text-green-500" />
                <div>
                  <p className="font-medium text-foreground">
                    Professional Assessment
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Complete service evaluation
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-1 size-5 shrink-0 text-green-500" />
                <div>
                  <p className="font-medium text-foreground">
                    Quality Guarantee
                  </p>
                  <p className="text-xs text-muted-foreground">
                    100% satisfaction promise
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-1 size-5 shrink-0 text-green-500" />
                <div>
                  <p className="font-medium text-foreground">
                    Expert Technician
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Certified & experienced
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-1 size-5 shrink-0 text-green-500" />
                <div>
                  <p className="font-medium text-foreground">
                    Follow-up Support
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Post-service assistance
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Technician Info */}
          <Card className="border-0 bg-muted/40">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
                  <User className="size-8 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground">
                    Professional Technician
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Expert in this service category • 50+ jobs completed
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  <MessageSquare className="size-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Booking Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-8 space-y-4">
            {/* Pricing Card - Premium Style */}
            <Card className="border-0 bg-linear-to-br from-primary to-primary/90 text-primary-foreground shadow-lg">
              <CardContent className="space-y-8 pt-8 pb-8">
                <div>
                  <p className="mb-2 text-sm font-medium opacity-90">
                    Starting from
                  </p>
                  <div className="space-y-1">
                    <div className="flex items-baseline gap-1">
                      <span className="text-5xl font-bold">
                        ৳{parseFloat(service.price).toFixed(2)}
                      </span>
                    </div>
                    <p className="text-sm opacity-80">
                      per{" "}
                      {service.duration === 1
                        ? "hour"
                        : `${service.duration} hours`}
                    </p>
                  </div>
                </div>

                <Separator className="opacity-20" />

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="opacity-90">Duration:</span>
                    <span className="font-semibold">
                      {service.duration} hours
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="opacity-90">Location:</span>
                    <span className="font-semibold">{service.location}</span>
                  </div>
                </div>

                {/* Booking modal */}

                <Button>
                  <BookingModal
                    open={modalOpen}
                    onOpenChange={setModalOpen}
                    service={service}
                  />
                </Button>

                <Button
                  size="lg"
                  className="w-full bg-white font-semibold text-primary hover:bg-white/90"
                  onClick={() => setModalOpen(true)}
                  disabled={isBooking || !service}
                >
                  {isBooking ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Calendar className="mr-2 size-5" />
                      Book Now
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  className="w-full border-white/20 text-white hover:bg-white/10"
                  onClick={handleShare}
                >
                  <Share2 className="mr-2 size-4" />
                  Share Service
                </Button>
              </CardContent>
            </Card>

            {/* Quick Trust Indicators */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900/30 dark:bg-green-950/30">
                <CheckCircle2 className="size-5 shrink-0 text-green-600" />
                <div className="text-sm">
                  <p className="font-semibold text-green-900 dark:text-green-300">
                    Available Now
                  </p>
                  <p className="text-xs text-green-800 dark:text-green-400">
                    Ready to start today
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900/30 dark:bg-blue-950/30">
                <AlertCircle className="size-5 shrink-0 text-blue-600" />
                <div className="text-sm">
                  <p className="font-semibold text-blue-900 dark:text-blue-300">
                    Guaranteed Quality
                  </p>
                  <p className="text-xs text-blue-800 dark:text-blue-400">
                    100% satisfaction promise
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
