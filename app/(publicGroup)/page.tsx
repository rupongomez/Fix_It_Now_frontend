import Link from "next/link"
import { Star, MapPin, DollarSign, ArrowRight, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { getServices, getTechnicians } from "./_actions/serverActions"

export const metadata = {
  title: "FixItNow - Your Trusted Home Service Platform",
  description:
    "Find and book trusted professionals for all your home service needs",
}

interface IService {
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
  technicianProfile: {
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
}

interface ITechnician {
  id: string
  userId: string
  bio: string
  experience: number
  hourlyRate: number | string
  averageRating: number
  completedJobs: number
  location: string
  isAvailable: boolean
  skills: string[]
  createdAt: string
  updatedAt: string
  user: {
    id: string
    name: string
    email: string
    phone: string
    location: string
    role: string
    status: string
    profileImage: string
    stripeCustomerId: string | null
    createdAt: string
    updatedAt: string
  }
}

export default async function HomePage() {
  let services: IService[] = []
  let technicians: ITechnician[] = []
  let loadError = false

  try {
    const [servicesRes, techniciansRes] = await Promise.all([
      getServices({
        location: "All",
        sortBy: "createdAt",
        sortOrder: "desc",
        minPrice: null,
        maxPrice: null,
        page: 1,
        limit: 6,
      }),
      getTechnicians({
        hourlyRate: "",
        location: "All",
        minAverageRating: "0",
        isAvailable: "true",
        minCompletedJobs: "",
        sortBy: "averageRating",
        sortOrder: "desc",
        page: 1,
        limit: 4,
      }),
    ])

    services = servicesRes?.data?.result ?? []
    technicians = techniciansRes?.data?.result ?? []
  } catch (error) {
    console.error("Failed to load home page data:", error)
    loadError = true
  }

  return (
    <main className="min-h-screen bg-linear-to-b from-background to-muted/30">
      {/* Hero Section */}
      <section className="px-4 py-20 sm:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-center gap-12 md:grid-cols-2">
            {/* Left Content */}
            <div className="space-y-6">
              <div className="space-y-3">
                <h1 className="text-4xl font-bold text-balance text-foreground sm:text-5xl">
                  Your Trusted Home Service Platform
                </h1>
                <p className="text-lg text-muted-foreground">
                  Find and book qualified professionals for plumbing,
                  electrical, HVAC, and more. Transparent pricing, verified
                  technicians, and fast response times.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col gap-3 pt-6 sm:flex-row">
                <Link href="/services">
                  <Button size="lg" className="w-full sm:w-auto">
                    <Search className="mr-2 size-4" />
                    Browse Services
                  </Button>
                </Link>
                <Link href="/register">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto"
                  >
                    Get Started
                    <ArrowRight className="ml-2 size-4" />
                  </Button>
                </Link>
              </div>

              {/* Trust Stats */}
              <div className="grid grid-cols-3 gap-4 pt-8">
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-foreground">
                    {technicians.length > 0 ? technicians.length : "2.5K+"}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Verified Technicians
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-foreground">
                    {services.length > 0 ? services.length : "12K+"}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Services Available
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-foreground">
                    {technicians.length > 0
                      ? Math.max(
                          ...technicians.map(
                            (t) => Number(t.averageRating) || 0
                          )
                        ).toFixed(1)
                      : "4.8"}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Top Technician Rating
                  </p>
                </div>
              </div>
            </div>

            {/* Right Visual */}
            <div className="hidden items-center justify-center md:flex">
              <div className="relative aspect-square w-full max-w-sm">
                <div className="absolute inset-0 rounded-3xl bg-linear-to-br from-primary/20 to-primary/5 blur-3xl" />
                <div className="relative flex flex-col items-center justify-center space-y-6 rounded-3xl bg-linear-to-br from-primary/10 to-primary/5 p-8">
                  <div className="text-8xl">
                    {services[0]?.technicianProfile?.isAvailable ? "🔧" : "🛠️"}
                  </div>
                  <p className="text-center text-sm text-muted-foreground">
                    Professional services at your doorstep
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Services Section */}
      <section className="bg-muted/30 px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="space-y-12">
            <div className="space-y-3 text-center">
              <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
                Popular Services
              </h2>
              <p className="text-lg text-muted-foreground">
                Choose from a wide range of home services
              </p>
            </div>

            {loadError ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <h3 className="mb-2 text-xl font-semibold text-foreground">
                  Failed to load services
                </h3>
                <p className="mb-6 text-muted-foreground">
                  Please try again later.
                </p>
                <Link href="/services">
                  <Button variant="outline">Browse All Services</Button>
                </Link>
              </div>
            ) : services.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {services.map((service) => (
                  <Link
                    key={service.id}
                    href={`/services/details/${service.id}`}
                    className="block h-full"
                  >
                    <Card className="flex h-full flex-col transition-shadow hover:shadow-lg">
                      <CardHeader>
                        <CardTitle className="line-clamp-1 text-xl">
                          {service.title}
                        </CardTitle>
                        <CardDescription className="line-clamp-2">
                          {service.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex flex-1 flex-col gap-4">
                        <div className="flex items-center gap-2">
                          <DollarSign className="size-4 text-primary" />
                          <span className="text-2xl font-bold text-foreground">
                            ৳{service.price}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            /service
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="size-4" />
                          <span>{service.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Star className="size-4 fill-yellow-400 text-yellow-400" />
                          <span>
                            {service.technicianProfile?.averageRating
                              ? `${service.technicianProfile.averageRating.toFixed(
                                  1
                                )} / 5`
                              : "No reviews yet"}
                          </span>
                        </div>
                        <Button className="mt-auto w-full" size="sm">
                          Explore
                          <ArrowRight className="ml-2 size-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <Card key={i}>
                    <CardHeader>
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Skeleton className="h-8 w-1/3" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-9 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* CTA */}
            <div className="pt-6 text-center">
              <Link href="/services">
                <Button size="lg" variant="outline">
                  View All Services
                  <ArrowRight className="ml-2 size-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Top Technicians Section */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="space-y-12">
            <div className="space-y-3 text-center">
              <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
                Top Rated Technicians
              </h2>
              <p className="text-lg text-muted-foreground">
                Meet our most reliable and highly-rated professionals
              </p>
            </div>

            {loadError ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <h3 className="mb-2 text-xl font-semibold text-foreground">
                  Failed to load technicians
                </h3>
                <p className="mb-6 text-muted-foreground">
                  Please try again later.
                </p>
                <Link href="/technicians">
                  <Button variant="outline">Browse All Technicians</Button>
                </Link>
              </div>
            ) : technicians.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                {technicians.map((tech) => (
                  <Link
                    key={tech.id}
                    href={`/technicians/offered-services/${tech.userId}`}
                    className="block h-full"
                  >
                    <Card className="flex h-full flex-col overflow-hidden transition-shadow hover:shadow-lg">
                      <CardContent className="flex flex-1 flex-col gap-4 p-6">
                        {/* Avatar */}
                        <div className="flex flex-col items-center space-y-3">
                          <div className="text-6xl">
                            {tech.user.profileImage ? (
                              <img
                                src={tech.user.profileImage}
                                alt={tech.user.name}
                                className="size-20 rounded-full object-cover"
                              />
                            ) : (
                              "👨‍🔧"
                            )}
                          </div>
                          <div className="text-center">
                            <h3 className="font-bold text-foreground">
                              {tech.user.name}
                            </h3>
                            <Badge variant="secondary" className="mt-2">
                              {tech.location}
                            </Badge>
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="space-y-3 border-t pt-4">
                          {/* Rating */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <Star className="size-4 fill-yellow-400 text-yellow-400" />
                              <span className="font-bold text-foreground">
                                {Number(tech.averageRating).toFixed(1)}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                ({tech.completedJobs} jobs)
                              </span>
                            </div>
                          </div>

                          {/* Availability */}
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="size-4" />
                            <span>{tech.location}</span>
                          </div>

                          {/* Hourly Rate */}
                          <div className="flex items-center gap-2 text-sm font-medium">
                            <DollarSign className="size-4" />
                            <span>৳{tech.hourlyRate}/hour</span>
                          </div>
                        </div>

                        {/* CTA */}
                        <Button
                          className="mt-auto w-full"
                          disabled={!tech.isAvailable}
                        >
                          {tech.isAvailable ? "Book Now" : "Unavailable"}
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                  <Card key={i}>
                    <CardContent className="space-y-4 p-6">
                      <div className="flex flex-col items-center space-y-3">
                        <Skeleton className="size-20 rounded-full" />
                        <Skeleton className="h-6 w-24" />
                      </div>
                      <div className="space-y-3">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                        <Skeleton className="h-9 w-full" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-muted/30 px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 space-y-3 text-center">
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground">
              Simple steps to get your service done
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-4">
            {[
              {
                number: "1",
                title: "Browse Services",
                description:
                  "Browse our categories and find the service you need",
              },
              {
                number: "2",
                title: "Select Technician",
                description:
                  "Choose from verified professionals with great reviews",
              },
              {
                number: "3",
                title: "Book Time",
                description: "Pick a convenient date and time for your service",
              },
              {
                number: "4",
                title: "Get Service Done",
                description:
                  "Professional technician completes your service request",
              },
            ].map((step) => (
              <div key={step.number} className="space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                  {step.number}
                </div>
                <h3 className="text-lg font-bold text-foreground">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-4xl space-y-8 text-center">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              Ready to Fix Things? Get Started Today
            </h2>
            <p className="text-lg text-muted-foreground">
              Join thousands of customers who trust FixItNow for their home
              services
            </p>
          </div>

          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/register?role=customer">
              <Button size="lg">
                Book a Service
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </Link>
            <Link href="/register?role=technician">
              <Button size="lg" variant="outline">
                Become a Technician
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
