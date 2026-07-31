"use client"
import React, { useEffect } from "react"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Star,
  MapPin,
  Clock,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  MessageSquare,
  Share2,
} from "lucide-react"
import { useParams } from "next/navigation"
import { getTechnicianProfileById } from "@/app/(dashboardGroup)/_actions/ServerAction"
import { toast } from "sonner"
import { TechnicianProfileSkeleton } from "./TechnicianPrfileLoadingSkeleton"

interface IReview {
  id: string
  bookingId: string
  customerId: string
  technicianProfileId: string
  rating: number
  comment: string
  createdAt: string
}

interface TechnicianProfile {
  success: boolean
  statusCode: number
  message: string
  data: {
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
    reviews: IReview[]
  }
}

// Mock technician data - replace with API call
// const : TechnicianProfile = {
//   id: "8bef2c75-38f4-4c46-a271-2983df822121",
//   userId: "8e062317-2c53-451e-8ee6-65d1cc06b4aa",
//   bio: "I fix everything from leaks to electrical issues. Fast response, clear pricing.",
//   experience: 4,
//   hourlyRate: "25.5",
//   averageRating: 3,
//   completedJobs: 10,
//   location: "Sylhet",
//   isAvailable: false,
//   createdAt: "2026-07-09T09:58:25.050Z",
//   updatedAt: "2026-07-09T09:58:25.050Z",
//   reviews: [],
// }
const TechnicianProfile = () => {
  const [technicianData, setTechnicianData] =
    useState<TechnicianProfile | null>(null)
  const [isFollowing, setIsFollowing] = useState(false)
  const [loading, setLoading] = useState(false)
  const params = useParams()

  useEffect(() => {
    const fetchTechnician = async () => {
      try {
        setLoading(true)
        const getTechnicianProfile = await getTechnicianProfileById(
          params.id as string
        )
        if (getTechnicianProfile.success && getTechnicianProfile.data) {
          setTechnicianData(getTechnicianProfile)
        }
        setLoading(false)
      } catch (error) {
        console.log(error)
      }
    }
    fetchTechnician()
  }, [params.id])

  const technician = technicianData?.data

  if (loading || !technician) {
    return <TechnicianProfileSkeleton />
  }

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`size-5 ${
          i < Math.round(rating)
            ? "fill-yellow-400 text-yellow-400"
            : "text-muted-foreground"
        }`}
      />
    ))
  }

  return (
    <div>
      {/* Header Card */}
      <Card className="mb-8 overflow-hidden border-0 shadow-lg">
        <div className="h-32 bg-linear-to-r from-primary/20 to-primary/10" />
        <CardContent className="relative -mt-16 px-6 pb-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            {/* Profile Info */}
            <div className="flex gap-4">
              <Avatar className="size-32 border-4 border-background">
                <AvatarImage
                  src="https://i.pravatar.cc/300?img=5"
                  alt="Technician"
                />
                <AvatarFallback>Tech</AvatarFallback>
              </Avatar>
              <div className="flex flex-1 flex-col justify-end pb-2">
                <h1 className="text-3xl font-bold text-foreground">
                  John Smith
                </h1>
                <p className="text-sm text-muted-foreground">
                  Professional Technician
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex gap-1">
                    {renderStars(technician.averageRating)}
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {technician.averageRating.toFixed(1)}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    ({technician.completedJobs} reviews)
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                variant={isFollowing ? "default" : "outline"}
                onClick={() => setIsFollowing(!isFollowing)}
                className="gap-2"
              >
                {isFollowing ? "Following" : "Follow"}
              </Button>
              <Button className="gap-2">
                <MessageSquare className="size-4" />
                Message
              </Button>
              <Button variant="outline" size="icon">
                <Share2 className="size-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 md:col-span-2">
          {/* About Section */}
          <Card>
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="leading-relaxed text-foreground">
                {technician.bio}
              </p>
            </CardContent>
          </Card>

          {/* Bio & Expertise */}
          <Card>
            <CardHeader>
              <CardTitle>Experience & Skills</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Briefcase className="mt-1 size-5 text-primary" />
                <div>
                  <h3 className="font-semibold text-foreground">
                    Years of Experience
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {technician.experience} years working in the field
                  </p>
                </div>
              </div>
              <Separator />
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-1 size-5 text-green-500" />
                <div>
                  <h3 className="font-semibold text-foreground">
                    Completed Jobs
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Successfully completed {technician.completedJobs} jobs
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reviews Section */}
          <Card>
            <CardHeader>
              <CardTitle>Reviews</CardTitle>
              <CardDescription>
                Customer feedback and testimonials
              </CardDescription>
            </CardHeader>
            <CardContent>
              {technician.reviews && technician.reviews.length > 0 ? (
                <div className="space-y-4">
                  {technician.reviews.map((review, index) => (
                    <div
                      key={index}
                      className="border-b border-border pb-4 last:border-0"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <h4 className="font-semibold text-foreground">
                          Reviewer Name
                        </h4>
                        <div className="flex gap-1">
                          {renderStars(review.rating || 5)}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {review.comment}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg bg-muted/50 p-6 text-center">
                  <MessageSquare className="mx-auto mb-3 size-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    No reviews yet. Be the first to review this technician!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Availability Card */}
          <Card
            className={`border-2 ${
              technician.isAvailable
                ? "border-green-200 bg-green-50/50 dark:border-green-900/30 dark:bg-green-900/10"
                : "border-red-200 bg-red-50/50 dark:border-red-900/30 dark:bg-red-900/10"
            }`}
          >
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                {technician.isAvailable ? (
                  <CheckCircle2 className="size-6 text-green-500" />
                ) : (
                  <AlertCircle className="size-6 text-red-500" />
                )}
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {technician.isAvailable
                      ? "Available Now"
                      : "Currently Unavailable"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {technician.isAvailable
                      ? "Ready to take new projects"
                      : "Check back later"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg bg-muted/50 p-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="size-5 text-primary" />
                  <span className="text-sm text-muted-foreground">
                    Hourly Rate
                  </span>
                </div>
                <span className="text-2xl font-bold text-foreground">
                  ৳{technician.hourlyRate}
                </span>
              </div>
              <Button className="w-full" size="lg">
                Book Now
              </Button>
            </CardContent>
          </Card>

          {/* Location Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Service Area</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <MapPin className="size-5 text-primary" />
                <div>
                  <p className="font-medium text-foreground">
                    {technician.location}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Primary service location
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Experience
                </span>
                <Badge variant="secondary">{technician.experience} years</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Jobs Completed
                </span>
                <Badge variant="secondary">{technician.completedJobs}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Member Since
                </span>
                <Badge variant="secondary">
                  {new Date(technician.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                  })}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default TechnicianProfile
