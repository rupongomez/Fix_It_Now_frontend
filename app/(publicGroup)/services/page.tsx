"use client"

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
import { MapPin, Clock, DollarSign, Star } from "lucide-react"
import { getServices } from "../_actions/services"

interface Service {
  id: string
  title: string
  description: string
  price: string
  duration: number
  location: string
  createdAt: string
  technicianProfileId: string
  categoryId: string
  updatedAt: string
}

const SAMPLE_SERVICES = await getServices()
console.log(SAMPLE_SERVICES)

const LOCATION_FILTERS = ["All", "Dhaka", "Gazipur"]

export default function ServicesPage() {
  const [selectedLocation, setSelectedLocation] = useState("All")
  const [services] = useState<Service[]>(SAMPLE_SERVICES)

  const filteredServices =
    selectedLocation === "All"
      ? services
      : services.filter((service) => service.location === selectedLocation)

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold text-foreground">
            Our Services
          </h1>
          <p className="text-lg text-muted-foreground">
            Browse our comprehensive range of professional services
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <h2 className="mb-4 text-sm font-semibold text-foreground">
            Filter by Location
          </h2>
          <div className="flex flex-wrap gap-3">
            {LOCATION_FILTERS.map((location) => (
              <button
                key={location}
                onClick={() => setSelectedLocation(location)}
                className={`rounded-lg px-4 py-2 font-medium transition-colors ${
                  selectedLocation === location
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {location}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <div className="mb-6 text-sm text-muted-foreground">
          Showing {filteredServices.length} service
          {filteredServices.length !== 1 ? "s" : ""}
        </div>

        {/* Services Grid */}
        {filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredServices.map((service) => (
              <Card
                key={service.id}
                className="flex flex-col transition-shadow duration-300 hover:shadow-lg"
              >
                <CardHeader>
                  <div className="mb-2 flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="line-clamp-2 text-xl">
                        {service.title}
                      </CardTitle>
                      <CardDescription className="mt-1 line-clamp-2">
                        {service.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="flex flex-1 flex-col gap-4">
                  {/* Service Details */}
                  <div className="space-y-3">
                    {/* Price */}
                    <div className="flex items-center gap-2">
                      <DollarSign className="size-4 text-primary" />
                      <span className="text-2xl font-bold text-foreground">
                        ৳{service.price}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        /service
                      </span>
                    </div>

                    {/* Duration */}
                    <div className="flex items-center gap-2">
                      <Clock className="size-4 text-primary" />
                      <span className="text-sm text-foreground">
                        <span className="font-medium">
                          {service.duration} hours
                        </span>
                        <span className="ml-1 text-muted-foreground">
                          average duration
                        </span>
                      </span>
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-2">
                      <MapPin className="size-4 text-primary" />
                      <span className="text-sm text-foreground">
                        {service.location}
                      </span>
                    </div>
                  </div>

                  {/* Rating Placeholder */}
                  <div className="flex items-center gap-1">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="size-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      (0 reviews)
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" className="flex-1" size="sm">
                      View Details
                    </Button>
                    <Button className="flex-1" size="sm">
                      Book Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 text-muted-foreground">
              <MapPin className="mx-auto mb-4 size-12 opacity-50" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-foreground">
              No services found
            </h3>
            <p className="mb-6 text-muted-foreground">
              Try adjusting your filters to find what you&apos;re looking for
            </p>
            <Button
              onClick={() => setSelectedLocation("All")}
              variant="outline"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
