"use server"

type IFilter = {
  location: string
  sortBy: "createdAt" | "price" | "title"
  sortOrder: "asc" | "desc"
  minPrice: number | null
  maxPrice: number | null
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

  const res = await fetch(
    `${process.env.BACKEND_API_URL}/api/services?${params.toString()}`
  )

  return res.json()
}
