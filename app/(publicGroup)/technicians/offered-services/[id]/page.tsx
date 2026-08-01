"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DollarSign,
  Clock,
  MapPin,
  Package,
  Calendar,
  Star,
  Briefcase,
} from "lucide-react"
import { toast } from "sonner"

import { getMe } from "@/service/getMe"
import { IUser } from "@/lib/types/UserTypes"
import { IService } from "@/lib/types/ServiceTypes"
import { getServicesOfferedByThisTechnician } from "@/app/(publicGroup)/_actions/serverActions"
import { checkoutService } from "@/app/(publicGroup)/_actions/checkoutAction"
import Link from "next/link"

export default function TechnicianServicesPage() {
  const [services, setServices] = useState<IService[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<IUser | null>(null)
  const [error, setError] = useState<string | null>(null)
  const params = useParams()
  const technicianId = params.id as string

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setIsLoading(true)
        const response = await getServicesOfferedByThisTechnician(technicianId)
        const userData = await getMe()
        setUser(userData)
        console.log(userData)

        if (response.success && response.data) {
          setServices(response.data)
        } else {
          setError(response.message || "Failed to fetch services")
        }
      } catch (err) {
        console.error("Error fetching services:", err)
        setError("Failed to load services")
      } finally {
        setIsLoading(false)
      }
    }

    fetchServices()
  }, [technicianId])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const handleBookService = async (serviceId: string) => {
    try {
      const makePayment = await checkoutService(serviceId)
      console.log(makePayment)
    } catch (error) {
      console.log(error)
    }
  }
  console.log(services)
  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-10 w-64" />
          <Skeleton className="mt-2 h-5 w-96" />
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <div key={i}>
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="mt-1 h-6 w-32" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
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
            <Button className="mt-4" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const technician = services[0]?.technicianProfile

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-foreground">
          {technician
            ? `Services by ${user?.data?.name || "Technician"}`
            : "Services"}
        </h1>
        <p className="mt-1 text-muted-foreground">
          Browse and book services from this technician
        </p>
      </div>

      {/* Technician Info Card */}
      {technician && (
        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <div>
                <p className="text-sm text-muted-foreground">Location</p>
                <p className="flex items-center gap-1 font-medium">
                  <MapPin className="size-4 text-muted-foreground" />
                  {technician.location}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Hourly Rate</p>
                <p className="flex items-center gap-1 font-medium">
                  <DollarSign className="size-4 text-muted-foreground" />৳
                  {technician.hourlyRate}/hr
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Experience</p>
                <p className="flex items-center gap-1 font-medium">
                  <Briefcase className="size-4 text-muted-foreground" />
                  {technician.experience} years
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Rating</p>
                <p className="flex items-center gap-1 font-medium">
                  <Star className="size-4 fill-yellow-400 text-yellow-400" />
                  {technician.averageRating > 0
                    ? technician.averageRating.toFixed(1)
                    : "No reviews"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge
                  className={
                    technician.isAvailable
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                      : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                  }
                >
                  {technician.isAvailable ? "Available" : "Unavailable"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Services Grid */}
      {services.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Card key={service.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                    <CardDescription className="mt-1 line-clamp-2">
                      {service.description}
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="shrink-0">
                    {service.duration}h
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col gap-4">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <DollarSign className="size-4 text-primary" />
                    <span className="text-2xl font-bold text-foreground">
                      ৳{parseFloat(service.price).toFixed(2)}
                    </span>
                    <span className="text-muted-foreground">/ service</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="size-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {service.location}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="size-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {service.duration} hour{service.duration > 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="size-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      Added {formatDate(service.createdAt)}
                    </span>
                  </div>
                </div>

                <Link href={`/services/${service.id}`}>
                  <Button
                    className="mt-auto w-full"

                    disabled={!technician?.isAvailable}
                  >
                    {technician?.isAvailable ? "Book Now" : "Unavailable"}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Package className="mb-4 size-12 text-muted-foreground" />
            <h3 className="text-lg font-semibold">No services available</h3>
            <p className="text-sm text-muted-foreground">
              This technician hasn&apos;t added any services yet
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
