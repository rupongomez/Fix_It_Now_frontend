"use client"

import { useEffect, useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Plus, Loader2, Package, Calendar } from "lucide-react"
import { toast } from "sonner"
import { createCategory, getCategories } from "../_actions/adminActions"

interface Category {
  id: string
  name: string
  description: string
  createdAt: string
}

export function CategoriesContent() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  //   Modal states
  const [modalOpen, setModalOpen] = useState(false)

  //   Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  })

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true)
        const response = await getCategories()

        if (response.success && response.data) {
          setCategories(response.data)
        } else {
          toast.error(response.message || "Failed to fetch categories")
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error)
        toast.error("Something went wrong")
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const handleOpenCreateModal = () => {
    setFormData({ name: "", description: "" })
    setModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      toast.error("Category name is required")
      return
    }

    setIsSubmitting(true)
    try {
      const response = await createCategory(formData)
      console.log("Create response:", response)

      if (response.success && response.data) {
        toast.success("Category created successfully")
        setCategories((prev) => [...prev, response.data])
        setModalOpen(false)
        setFormData({ name: "", description: "" })
      } else {
        throw new Error(response.message || "Failed to create category")
      }
    } catch (error) {
      console.error("Error creating category:", error)
      toast.error(
        error instanceof Error ? error.message : "Failed to create category"
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="mt-1 h-4 w-48" />
          </div>
          <Skeleton className="h-10 w-32" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-12 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">All Categories</CardTitle>
            <CardDescription>
              {categories.length} categories available
            </CardDescription>
          </div>
          <Button onClick={handleOpenCreateModal} className="gap-2">
            <Plus className="size-4" />
            Add Category
          </Button>
        </CardHeader>
        <CardContent>
          {categories.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Package className="size-4 text-muted-foreground" />
                          <span className="font-medium">{category.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {category.description}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="size-3" />
                          {formatDate(category.createdAt)}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Package className="mb-4 size-12 text-muted-foreground" />
              <h3 className="text-lg font-semibold">No categories yet</h3>
              <p className="text-sm text-muted-foreground">
                Create your first category to organize services
              </p>
              <Button onClick={handleOpenCreateModal} className="mt-4 gap-2">
                <Plus className="size-4" />
                Add Category
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/*   Create Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
            <DialogDescription>
              Create a new category for services
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Category Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., AC Repair"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what this category covers..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setModalOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Category"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
