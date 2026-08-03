"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
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
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DollarSign,
  Clock,
  MapPin,
  Package,
  Calendar,
  Star,
  Briefcase,
  User,
  Phone,
  Mail,
  CheckCircle2,
  XCircle,
  Wrench,
} from "lucide-react"
import { toast } from "sonner"
import { getMe } from "@/service/getMe"
import { IUser } from "@/lib/types/UserTypes"
import { IService } from "@/lib/types/ServiceTypes"
import { getServicesOfferedByThisTechnician } from "@/app/(publicGroup)/_actions/serverActions"
import { checkoutService } from "@/app/(publicGroup)/_actions/checkoutAction"

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

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`size-4 ${
          i < Math.round(rating)
            ? "fill-yellow-400 text-yellow-400"
            : "text-muted-foreground"
        }`}
      />
    ))
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Profile Skeleton */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              <Skeleton className="size-24 rounded-full" />
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

        {/* Services Grid Skeleton */}
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
  const technicianName = user?.data?.name || "Technician"

  return (
    <div className="mx-auto w-11/12 space-y-8">
      {/* ✅ Technician Profile Card */}
      <Card className="overflow-hidden border-0 shadow-lg">
        <div className="h-32 bg-linear-to-r from-primary/20 to-primary/10" />
        <CardContent className="relative -mt-16">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end">
            {/* Avatar */}
            <Avatar className="size-28 border-4 border-background shadow-lg">
              <AvatarImage
                src={
                  user?.data?.profileImage || "https://i.pravatar.cc/300?img=5"
                }
                alt={technicianName}
              />
              <AvatarFallback className="text-2xl">
                {technicianName.charAt(0)}
              </AvatarFallback>
            </Avatar>

            {/* Info */}
            <div className="flex flex-1 flex-wrap items-start justify-between gap-4 pb-2">
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  {technicianName}
                </h1>
                <div className="mt-1 flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-1">
                    {renderStars(technician?.averageRating || 0)}
                    <span className="text-sm font-medium">
                      {technician?.averageRating?.toFixed(1) || "0"}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      ({technician?.completedJobs || 0} reviews)
                    </span>
                  </div>
                  <Separator orientation="vertical" className="h-4" />
                  <Badge
                    className={
                      technician?.isAvailable
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                        : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                    }
                  >
                    {technician?.isAvailable ? (
                      <>
                        <CheckCircle2 className="mr-1 size-3" />
                        Available
                      </>
                    ) : (
                      <>
                        <XCircle className="mr-1 size-3" />
                        Unavailable
                      </>
                    )}
                  </Badge>
                </div>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-1.5">
                  <Briefcase className="size-4 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    {technician?.experience || 0} years
                  </span>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-1.5">
                  <MapPin className="size-4 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    {technician?.location || "N/A"}
                  </span>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-1.5">
                  <DollarSign className="size-4 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    ৳{technician?.hourlyRate || 0}/hr
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bio */}
          {technician?.bio && (
            <div className="mt-4 rounded-lg bg-muted/30 p-4">
              <p className="text-sm text-muted-foreground">{technician.bio}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ✅ Services Section */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              Offered Services
            </h2>
            <p className="text-sm text-muted-foreground">
              {services.length} service{services.length !== 1 ? "s" : ""}{" "}
              available
            </p>
          </div>
        </div>

        {services.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <Card
                key={service.id}
                className="group flex flex-col transition-all duration-300 hover:border-primary/20 hover:shadow-lg"
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="line-clamp-1 text-xl">
                        {service.title}
                      </CardTitle>
                      <CardDescription className="mt-1 line-clamp-2 text-sm">
                        {service.description}
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="shrink-0">
                      {service.duration}h
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="flex flex-1 flex-col gap-4">
                  {/* Details */}
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <DollarSign className="size-4 text-primary" />
                        <span className="text-2xl font-bold text-foreground">
                          ৳{parseFloat(service.price).toFixed(2)}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        / service
                      </span>
                    </div>

                    <Separator />

                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="size-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {service.location}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="size-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {service.duration} hour{service.duration > 1 ? "s" : ""}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="size-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        Added {formatDate(service.createdAt)}
                      </span>
                    </div>
                  </div>

                  {/* Book Button */}
                  <Link
                    href={`/services/details/${service.id}`}
                    className="mt-auto"
                  >
                    <Button
                      className="w-full transition-all group-hover:bg-primary/90"
                      disabled={!technician?.isAvailable}
                    >
                      {technician?.isAvailable ? (
                        <>
                          <Wrench className="mr-2 size-4" />
                          Book Now
                        </>
                      ) : (
                        "Unavailable"
                      )}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="rounded-full bg-muted p-4">
                <Package className="size-10 text-muted-foreground" />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-foreground">
                No services available
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                This technician hasn&apos;t added any services yet
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
