"use client"
import { useEffect } from "react"
import { useState } from "react"
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
import {
  Star,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  MessageSquare,
  Share2,
  Pencil,
} from "lucide-react"
import { useParams } from "next/navigation"
import {
  getTechnicianProfileById,
  updateTechnicianProfile,
} from "@/app/(dashboardGroup)/_actions/technicianProfileAction"
import { TechnicianProfileSkeleton } from "./TechnicianPrfileLoadingSkeleton"
import { EditProfileModal } from "./EditTechnicianModal"

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
    skills?: string[]
    createdAt: string
    updatedAt: string
    reviews: IReview[]
  }
}

const TechnicianProfile = () => {
  const [technicianData, setTechnicianData] =
    useState<TechnicianProfile | null>(null)
  const [isFollowing, setIsFollowing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)

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

  const handleUpdateProfile = async (data: {
    bio: string
    experience: number
    hourlyRate: number
    service: string[]
    location: string
  }) => {
    const response = await updateTechnicianProfile(data)
    if (response.success) {
      // Refresh the profile data
      const updatedProfile = await getTechnicianProfileById(params.id as string)
      if (updatedProfile.success && updatedProfile.data) {
        setTechnicianData(updatedProfile)
      }
    }
    return response
  }

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
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground">
            Technician Profile
          </h1>
          <p className="mt-1 text-muted-foreground">
            View detailed information and book services
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {/* ✅ Edit Profile Button */}
          <Button variant="default" onClick={() => setEditModalOpen(true)}>
            <Pencil className="mr-2 size-4" />
            Edit Profile
          </Button>
          <Button
            variant={isFollowing ? "default" : "outline"}
            onClick={() => setIsFollowing(!isFollowing)}
          >
            {isFollowing ? "Following" : "Follow"}
          </Button>
          <Button variant="outline" size="icon">
            <MessageSquare className="size-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Share2 className="size-4" />
          </Button>
        </div>
      </div>

      {/* Rating Overview */}
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10">
        <CardContent className="py-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div>
                <div className="mb-1 flex items-center gap-2">
                  <div className="flex gap-1">
                    {renderStars(technician.averageRating)}
                  </div>
                  <span className="text-2xl font-bold text-foreground">
                    {technician.averageRating.toFixed(1)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Based on {technician.completedJobs} completed jobs
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">
                  {technician.experience}
                </p>
                <p className="text-xs text-muted-foreground">Years Exp.</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">
                  {technician.completedJobs}
                </p>
                <p className="text-xs text-muted-foreground">Jobs Done</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Main Content */}
        <div className="space-y-6 lg:col-span-2">
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

          {/* Experience & Skills */}
          <Card>
            <CardHeader>
              <CardTitle>Experience & Skills</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Briefcase className="mt-1 size-5 text-primary" />
                <div>
                  <h3 className="font-semibold text-foreground">
                    Professional Experience
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {technician.experience} years in the field
                  </p>
                </div>
              </div>
              <Separator />
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-1 size-5 text-green-500" />
                <div>
                  <h3 className="font-semibold text-foreground">
                    Successfully Completed
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {technician.completedJobs} jobs with satisfaction
                  </p>
                </div>
              </div>
              {/* ✅ Skills Display */}
              {technician.skills && technician.skills.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h3 className="mb-2 font-semibold text-foreground">
                      Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {technician.skills.map((skill) => (
                        <Badge key={skill} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}
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
                  {technician.reviews.map((review) => (
                    <div
                      key={review.id}
                      className="border-b border-border pb-4 last:border-0"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <span className="font-medium text-foreground">
                          Customer Review
                        </span>
                        <div className="flex gap-1">
                          {renderStars(review.rating)}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {review.comment}
                      </p>
                      <p className="mt-2 text-xs text-muted-foreground">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg bg-muted/50 p-6 text-center">
                  <MessageSquare className="mx-auto mb-3 size-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    No reviews yet. Be the first to review!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Quick Info */}
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
                  <p className="text-sm font-semibold text-foreground">
                    {technician.isAvailable
                      ? "Available Now"
                      : "Currently Unavailable"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {technician.isAvailable
                      ? "Ready for new projects"
                      : "Check back soon"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Hourly Rate</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Starting from</p>
                <p className="text-4xl font-bold text-foreground">
                  ৳{technician.hourlyRate}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">per hour</p>
              </div>
              <Button className="w-full">Book Now</Button>
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
                    Primary location
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Member Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Member Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
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
              <Separator />
              <div className="py-2 text-center">
                <p className="text-xs text-muted-foreground">ID</p>
                <p className="truncate font-mono text-xs text-foreground">
                  {technician.id}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ✅ Edit Profile Modal */}
      <EditProfileModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        technician={{
          id: technician.id,
          bio: technician.bio,
          experience: technician.experience,
          hourlyRate: technician.hourlyRate,
          location: technician.location,
          skills: technician.skills || [],
        }}
        onSave={handleUpdateProfile}
      />
    </div>
  )
}

export default TechnicianProfile
