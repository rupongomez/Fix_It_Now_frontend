"use server"

type IFilter = {
  location: string
  sortBy: "createdAt" | "price" | "title"
  sortOrder: "asc" | "desc"
  minPrice: number | null
  maxPrice: number | null
  page: number
  limit: number
  searchTerms?: string
}

export const getServices = async (filters: IFilter) => {
  const params = new URLSearchParams()

  params.set("sortBy", filters.sortBy)
  params.set("sortOrder", filters.sortOrder)

  if (filters.location !== "All") {
    params.set("location", filters.location)
  }

  if (filters.minPrice !== null) {
    params.set("minPrice", filters.minPrice.toString())
  }

  if (filters.maxPrice !== null) {
    params.set("maxPrice", filters.maxPrice.toString())
  }

  if (filters.searchTerms) {
    params.set("searchTerms", filters.searchTerms)
  }
  const res = await fetch(
    `${process.env.BACKEND_API_URL}/api/services?${params.toString()}`
  )

  return res.json()
}
interface ITechnicianFilters {
  hourlyRate: string
  location: string
  minAverageRating: string
  isAvailable: string
  minCompletedJobs: string
  sortBy: "hourlyRate" | "averageRating" | "completedJobs"
  sortOrder: "asc" | "desc"
  page: number
  limit: number
  searchTerms?: string
}

export const getTechnicians = async (filter: ITechnicianFilters) => {
  const params = new URLSearchParams()
  params.set("sortBy", filter.sortBy)
  params.set("sortOrder", filter.sortOrder)

  if (filter.hourlyRate !== null) {
    params.set("hourlyRate", filter.hourlyRate)
  }
  if (filter.location !== "All") {
    params.set("location", filter.location)
  }
  if (filter.minAverageRating !== null) {
    params.set("minAverageRating", filter.minAverageRating)
  }

  if (filter.isAvailable === "true" || filter.isAvailable === "false") {
    params.set("isAvailable", filter.isAvailable)
  }

  if (filter.minCompletedJobs !== null) {
    params.set("minCompletedJobs", filter.minCompletedJobs)
  }
  if (filter.sortBy !== null) {
    params.set("sortBy", filter.sortBy)
  }
  if (filter.sortOrder !== null) {
    params.set("sortOrder", filter.sortOrder)
  }
  if (filter.page !== null) {
    params.set("page", filter.page.toString())
  }
  if (filter.limit !== null) {
    params.set("limit", filter.limit.toString())
  }
  if (filter.searchTerms) {
    params.set("searchTerms", filter.searchTerms)
  }

  const res = await fetch(
    `${process.env.BACKEND_API_URL}/api/technician?${params.toString()}`
  )

  return res.json()
}
