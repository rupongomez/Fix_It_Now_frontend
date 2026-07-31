"use client"

import { useEffect, useState } from "react"
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
import { Input } from "@/components/ui/input"
import { MapPin, Clock, DollarSign, Star, X, Briefcase } from "lucide-react"
import { getTechnicians } from "../_actions/serverActions"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { useSearchParams } from "next/navigation"

// ✅ Update the Technician interface to match the actual response
interface Technician {
  id: string
  userId: string
  bio: string
  experience: number
  hourlyRate: number | string // Could be string or number
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
interface Filters {
  location: string
  hourlyRate: string
  minAverageRating: string
  isAvailable: string
  minCompletedJobs: string
  sortBy: "hourlyRate" | "averageRating" | "completedJobs"
  sortOrder: "asc" | "desc"
  page?: number
  limit?: number
}

const LOCATION_OPTIONS = [
  "All",
  "Dhaka",
  "Gazipur",
  "Chattogram",
  "Sylhet",
  "Rajshahi",
  "Barishal",
  "Khulna",
  "Rangpur",
]
const ITEMS_PER_PAGE = 6
const TechnicianGrid = () => {
  const [technicians, setTechnicians] = useState<Technician[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const searchParams = useSearchParams()
  const [filters, setFilters] = useState<Filters>({
    location: "All",
    hourlyRate: "",
    minAverageRating: "0",
    isAvailable: "true",
    minCompletedJobs: "",
    sortBy: "averageRating",
    sortOrder: "desc",
    page: currentPage,
    limit: ITEMS_PER_PAGE,
  })

  const searchTerms = searchParams.get("searchTerms") ?? undefined

  useEffect(() => {
    const fetchTechnicians = async () => {
      try {
        const loadTechnicians = await getTechnicians({
          ...filters,
          page: currentPage,
          limit: ITEMS_PER_PAGE,
          searchTerms: searchTerms,
        })
        console.log(loadTechnicians)
        setTechnicians(loadTechnicians.data.result)
        setTotalItems(loadTechnicians.data.totalTechnicians)
      } catch (err) {
        console.error(err)
      }
    }

    fetchTechnicians()
  }, [filters, setTechnicians, currentPage, totalItems, searchTerms])

  const clearFilters = () => {
    setFilters({
      location: "All",
      hourlyRate: "",
      minAverageRating: "0",
      isAvailable: "true",
      minCompletedJobs: "",
      sortBy: "averageRating",
      sortOrder: "desc",
    })
  }

  const hasActiveFilters =
    filters.location !== "All" ||
    filters.hourlyRate !== "" ||
    filters.minAverageRating !== "0" ||
    filters.isAvailable !== "true" ||
    filters.minCompletedJobs !== ""

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE)

  const pageNumbers = []
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i)
  }
  return (
    <div>
      {/* Filters Section */}
      <div className="mb-8 space-y-6 rounded-lg border border-border bg-card p-6">
        <div>
          <h2 className="mb-4 text-sm font-semibold text-foreground">
            Filters
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* Location Filter */}
            <div>
              <label className="mb-2 block text-xs font-medium text-muted-foreground">
                Location
              </label>
              <div className="flex flex-wrap gap-2">
                {LOCATION_OPTIONS.map((location) => (
                  <button
                    key={location}
                    onClick={() => setFilters({ ...filters, location })}
                    className={`rounded px-3 py-1.5 text-sm font-medium transition-colors ${
                      filters.location === location
                        ? "bg-primary text-primary-foreground"
                        : "border border-border bg-background hover:bg-muted"
                    }`}
                  >
                    {location}
                  </button>
                ))}
              </div>
            </div>

            {/* Hourly Rate Filter */}
            <div>
              <label className="mb-2 block text-xs font-medium text-muted-foreground">
                Max Hourly Rate (৳)
              </label>
              <Input
                type="number"
                placeholder="e.g., 1000"
                value={filters.hourlyRate}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    hourlyRate: e.target.value,
                  })
                }
                className="h-9"
              />
            </div>

            {/* Minimum Rating Filter */}
            <div>
              <label className="mb-2 block text-xs font-medium text-muted-foreground">
                Minimum Rating
              </label>
              <select
                value={filters.minAverageRating}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    minAverageRating: e.target.value,
                  })
                }
                className="h-9 w-full rounded border border-border bg-background px-3 text-sm"
              >
                <option value="0">Any Rating</option>
                <option value="3">3+ Stars</option>
                <option value="4">4+ Stars</option>
                <option value="4.5">4.5+ Stars</option>
              </select>
            </div>

            {/* Minimum Completed Jobs */}
            <div>
              <label className="mb-2 block text-xs font-medium text-muted-foreground">
                Minimum Completed Jobs
              </label>
              <Input
                type="number"
                placeholder="e.g., 10"
                value={filters.minCompletedJobs}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    minCompletedJobs: e.target.value,
                  })
                }
                className="h-9"
              />
            </div>
          </div>
        </div>

        {/* Sort & Availability Options */}
        <div className="flex flex-wrap items-center gap-4 border-t border-border pt-4">
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-muted-foreground">
              Show:
            </label>
            <select
              value={filters.isAvailable}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  isAvailable: e.target.value,
                })
              }
              className="rounded border border-border bg-background px-3 py-1.5 text-sm"
            >
              <option value="true">Available</option>
              <option value="false">Unavailable</option>
              <option value="all">All</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-muted-foreground">
              Sort by:
            </label>
            <select
              value={filters.sortBy}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  sortBy: e.target.value as
                    "hourlyRate" | "averageRating" | "completedJobs",
                })
              }
              className="rounded border border-border bg-background px-3 py-1.5 text-sm"
            >
              <option value="averageRating">Rating</option>
              <option value="hourlyRate">Hourly Rate</option>
              <option value="completedJobs">Jobs Completed</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-muted-foreground">
              Order:
            </label>
            <select
              value={filters.sortOrder}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  sortOrder: e.target.value as "asc" | "desc",
                })
              }
              className="rounded border border-border bg-background px-3 py-1.5 text-sm"
            >
              <option value="desc">Highest First</option>
              <option value="asc">Lowest First</option>
            </select>
          </div>

          {hasActiveFilters && (
            <Button
              onClick={clearFilters}
              variant="ghost"
              size="sm"
              className="ml-auto gap-1.5"
            >
              <X className="size-4" />
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {/* Pagination */}

      <div className="mb-8">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  if (currentPage > 1) setCurrentPage(currentPage - 1)
                }}
                className={
                  currentPage === 1 ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>

            {pageNumbers.map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  href="#"
                  isActive={currentPage === page}
                  onClick={(e) => {
                    e.preventDefault()
                    setCurrentPage(page)
                  }}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>

            {/* Next button */}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  if (currentPage < totalPages) setCurrentPage(currentPage + 1)
                }}
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      {/* Results count */}
      <div className="mb-6 text-sm text-muted-foreground">
        Showing {technicians.length} technician
        {technicians.length !== 1 ? "s" : ""}
      </div>

      {/* Technicians Grid */}
      {technicians.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {technicians.map((technician) => (
            <Card
              key={technician.id}
              className="flex flex-col transition-shadow duration-300 hover:shadow-lg"
            >
              <CardHeader>
                <div className="mb-2 flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="line-clamp-2 text-xl">
                      {technician.user.name}
                    </CardTitle>
                    <CardDescription className="mt-1 line-clamp-2">
                      {technician.experience && technician.experience > 0
                        ? `${technician.experience} years of experience`
                        : "No experience listed"}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="flex flex-1 flex-col gap-4">
                {/* Technician Details */}
                <div className="space-y-3">
                  {/* Location */}
                  <div className="flex items-center gap-2">
                    <MapPin className="size-4 text-primary" />
                    <span className="text-sm text-foreground">
                      {technician.location}
                    </span>
                  </div>

                  {/* Hourly Rate */}
                  <div className="flex items-center gap-2">
                    <DollarSign className="size-4 text-primary" />
                    <span className="text-2xl font-bold text-foreground">
                      ৳{technician.hourlyRate}
                    </span>
                    <span className="text-sm text-muted-foreground">/hour</span>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2">
                    <Star className="size-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-foreground">
                      {technician.averageRating > 0
                        ? `${technician.averageRating.toFixed(1)} / 5`
                        : "No reviews yet"}
                    </span>
                  </div>

                  {/* Completed Jobs */}
                  <div className="flex items-center gap-2">
                    <Briefcase className="size-4 text-primary" />
                    <span className="text-sm text-foreground">
                      {technician.completedJobs} jobs completed
                    </span>
                  </div>

                  {/* Availability */}
                  <div className="flex items-center gap-2">
                    <div
                      className={`size-2 rounded-full ${technician.isAvailable ? "bg-green-500" : "bg-red-500"}`}
                    />
                    <span
                      className={`text-sm font-medium ${technician.isAvailable ? "text-green-600" : "text-red-600"}`}
                    >
                      {technician.isAvailable ? "Available" : "Unavailable"}
                    </span>
                  </div>
                </div>

                {/* creation date */}
                <div className="text-xs text-muted-foreground">
                  Joined: {new Date(technician.createdAt).toLocaleDateString()}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" className="flex-1" size="sm">
                    View Profile
                  </Button>
                  <Button
                    className="flex-1"
                    size="sm"
                    disabled={!technician.isAvailable}
                  >
                    {technician.isAvailable ? "Book Now" : "Unavailable"}
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
            No technicians found
          </h3>
          <p className="mb-6 text-muted-foreground">
            Try adjusting your filters to find what you&apos;re looking for
          </p>
          {hasActiveFilters && (
            <Button onClick={clearFilters} variant="outline">
              Clear Filters
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

export default TechnicianGrid
