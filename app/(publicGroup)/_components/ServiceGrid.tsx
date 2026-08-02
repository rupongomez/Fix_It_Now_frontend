"use client"
import React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Input } from "@/components/ui/input"
import { MapPin, Clock, DollarSign, Star, X } from "lucide-react"
import { getServices } from "../_actions/serverActions"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { SearchBar } from "./SearchBar"
import { useSearchParams } from "next/navigation"
import Link from "next/link"

interface Service {
  id: string
  title: string
  description: string
  price: string
  duration: number
  location: string
  type: string
  createdAt: string
  technicianProfileId: string
  categoryId: string
  updatedAt: string
}

interface Filters {
  location: string
  minPrice: number | null
  maxPrice: number | null
  type: string
  sortBy: "createdAt" | "price"
  sortOrder: "asc" | "desc"
  searchTerms?: string
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
const SERVICE_TYPES = ["All", "AC Repair", "PC Repair", "TV Repair"]
const ITEMS_PER_PAGE = 6

const ServiceGrid = () => {
  const [services, setServices] = useState<Service[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const searchParams = useSearchParams()

  const [filters, setFilters] = useState<Filters>({
    location: "All",
    minPrice: null,
    maxPrice: null,
    type: "All",
    sortBy: "createdAt",
    sortOrder: "desc",
    page: currentPage,
    limit: ITEMS_PER_PAGE,
  })
  const searchTerms = searchParams.get("searchTerms") ?? undefined

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const loadServices = await getServices({
          ...filters,
          page: currentPage,
          limit: ITEMS_PER_PAGE,
          searchTerms: searchTerms,
        })

        setServices(loadServices.data.result)
        console.log(loadServices.data.result)

        setTotalItems(loadServices.data.totalServiceCount)
      } catch (err) {
        console.error(err)
      }
    }

    fetchServices()
  }, [filters, setServices, currentPage, totalItems, searchTerms])

  const clearFilters = () => {
    setFilters({
      location: "All",
      type: "All",
      minPrice: null,
      maxPrice: null,
      sortBy: "createdAt",
      sortOrder: "desc",
    })
  }
  const hasActiveFilters =
    filters.location !== "All" ||
    filters.type !== "All" ||
    filters.minPrice !== null ||
    filters.maxPrice !== null

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

            {/* Service Type Filter */}
            <div>
              <label className="mb-2 block text-xs font-medium text-muted-foreground">
                Service Type
              </label>
              <div className="flex flex-wrap gap-2">
                {SERVICE_TYPES.map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilters({ ...filters, type })}
                    className={`rounded px-3 py-1.5 text-sm font-medium transition-colors ${
                      filters.type === type
                        ? "bg-primary text-primary-foreground"
                        : "border border-border bg-background hover:bg-muted"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Min Price Filter */}
            <div>
              <label className="mb-2 block text-xs font-medium text-muted-foreground">
                Min Price (৳)
              </label>
              <Input
                type="number"
                placeholder="0"
                value={filters.minPrice ?? ""}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    minPrice: e.target.value
                      ? parseFloat(e.target.value)
                      : null,
                  })
                }
                className="h-9"
              />
            </div>

            {/* Max Price Filter */}
            <div>
              <label className="mb-2 block text-xs font-medium text-muted-foreground">
                Max Price (৳)
              </label>
              <Input
                type="number"
                placeholder="No limit"
                value={filters.maxPrice ?? ""}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    maxPrice: e.target.value
                      ? parseFloat(e.target.value)
                      : null,
                  })
                }
                className="h-9"
              />
            </div>
          </div>
        </div>

        {/* Sort Options */}
        <div className="flex flex-wrap items-center gap-4 border-t border-border pt-4">
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-muted-foreground">
              Sort by:
            </label>
            <select
              value={filters.sortBy}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  sortBy: e.target.value as "createdAt" | "price",
                })
              }
              className="rounded border border-border bg-background px-3 py-1.5 text-sm"
            >
              <option value="createdAt">Newest</option>
              <option value="price">Price</option>
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
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
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
        Showing {services.length} service
        {services.length !== 1 ? "s" : ""}
      </div>

      {/* Services Grid */}
      {services.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
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

                {/* creation date */}
                <div className="text-xs text-muted-foreground">
                  Created: {new Date(service.createdAt).toLocaleDateString()}
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
                <Link
                  href={`/services/details/${service.id}`}
                  className="flex gap-2 pt-2"
                >
                  <Button className="flex-1" size="sm">
                    View Details
                  </Button>
                </Link>
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

export default ServiceGrid
