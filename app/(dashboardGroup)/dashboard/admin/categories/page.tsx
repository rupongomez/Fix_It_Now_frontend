import { CategoriesContent } from "@/app/(dashboardGroup)/_components/CategoryContent"

export default function CategoriesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-foreground">Categories</h1>
        <p className="mt-1 text-muted-foreground">
          Manage service categories for the platform
        </p>
      </div>

      <CategoriesContent />
    </div>
  )
}
