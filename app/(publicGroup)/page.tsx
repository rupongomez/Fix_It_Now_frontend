import Link from "next/link"
import {
  Star,
  Wrench,
  MapPin,
  DollarSign,
  ArrowRight,
  Search,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export const metadata = {
  title: "FixItNow - Your Trusted Home Service Platform",
  description:
    "Find and book trusted professionals for all your home service needs",
}

const featuredServices = [
  {
    id: 1,
    name: "Plumbing",
    description: "Repairs, installations, and maintenance",
    icon: "🔧",
    color: "from-blue-500 to-blue-600",
  },
  {
    id: 2,
    name: "Electrical",
    description: "Wiring, repairs, and upgrades",
    icon: "⚡",
    color: "from-yellow-500 to-yellow-600",
  },
  {
    id: 3,
    name: "HVAC",
    description: "Heating, cooling, and ventilation",
    icon: "❄️",
    color: "from-cyan-500 to-cyan-600",
  },
  {
    id: 4,
    name: "Cleaning",
    description: "Deep cleaning and maintenance",
    icon: "🧹",
    color: "from-green-500 to-green-600",
  },
  {
    id: 5,
    name: "Carpentry",
    description: "Repairs, building, and finishing",
    icon: "🪵",
    color: "from-orange-500 to-orange-600",
  },
  {
    id: 6,
    name: "Painting",
    description: "Interior and exterior painting",
    icon: "🎨",
    color: "from-purple-500 to-purple-600",
  },
]

const topTechnicians = [
  {
    id: 1,
    name: "John Smith",
    specialty: "Plumbing",
    rating: 4.9,
    reviews: 234,
    hourlyRate: 75,
    image: "👨‍🔧",
    responseTime: "< 1 hour",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    specialty: "Electrical",
    rating: 4.8,
    reviews: 189,
    hourlyRate: 85,
    image: "👩‍🔧",
    responseTime: "< 2 hours",
  },
  {
    id: 3,
    name: "Mike Davis",
    specialty: "HVAC",
    rating: 4.9,
    reviews: 267,
    hourlyRate: 95,
    image: "👨‍🔧",
    responseTime: "< 30 min",
  },
  {
    id: 4,
    name: "Emily Brown",
    specialty: "Cleaning",
    rating: 4.7,
    reviews: 156,
    hourlyRate: 50,
    image: "👩‍🔧",
    responseTime: "< 3 hours",
  },
]

export default function HomePage() {
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
                    2.5K+
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Verified Technicians
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-foreground">12K+</div>
                  <p className="text-sm text-muted-foreground">
                    Happy Customers
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-foreground">4.8★</div>
                  <p className="text-sm text-muted-foreground">
                    Average Rating
                  </p>
                </div>
              </div>
            </div>

            {/* Right Visual */}
            <div className="hidden items-center justify-center md:flex">
              <div className="relative aspect-square w-full max-w-sm">
                <div className="absolute inset-0 rounded-3xl bg-linear-to-br from-primary/20 to-primary/5 blur-3xl" />
                <div className="relative flex flex-col items-center justify-center space-y-6 rounded-3xl bg-linear-to-br from-primary/10 to-primary/5 p-8">
                  <div className="text-8xl">🔧</div>
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

            {/* Services Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredServices.map((service) => (
                <Link
                  key={service.id}
                  href={`/services?category=${service.name.toLowerCase()}`}
                >
                  <Card className="h-full cursor-pointer transition-shadow hover:shadow-lg">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="text-5xl">{service.icon}</div>
                        <div>
                          <h3 className="text-lg font-bold text-foreground">
                            {service.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {service.description}
                          </p>
                        </div>
                        <div className="flex items-center pt-2 text-sm font-medium text-primary">
                          Explore
                          <ArrowRight className="ml-2 size-4" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

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

            {/* Technicians Grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {topTechnicians.map((tech) => (
                <Link key={tech.id} href={`/technicians/${tech.id}`}>
                  <Card className="h-full cursor-pointer overflow-hidden transition-shadow hover:shadow-lg">
                    <CardContent className="space-y-4 p-6">
                      {/* Avatar */}
                      <div className="flex flex-col items-center space-y-3">
                        <div className="text-6xl">{tech.image}</div>
                        <div className="text-center">
                          <h3 className="font-bold text-foreground">
                            {tech.name}
                          </h3>
                          <Badge variant="secondary" className="mt-2">
                            {tech.specialty}
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
                              {tech.rating}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              ({tech.reviews})
                            </span>
                          </div>
                        </div>

                        {/* Response Time */}
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="size-4" />
                          <span>{tech.responseTime}</span>
                        </div>

                        {/* Hourly Rate */}
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <DollarSign className="size-4" />
                          <span>${tech.hourlyRate}/hour</span>
                        </div>
                      </div>

                      {/* CTA */}
                      <Button className="mt-2 w-full">Book Now</Button>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
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
