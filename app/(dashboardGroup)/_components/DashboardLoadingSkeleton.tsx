// app/(dashboardGroup)/dashboard/technician/loading.tsx
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardLoadingSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div>
        <Skeleton className="h-10 w-64" />
        <Skeleton className="mt-2 h-5 w-80" />
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="size-5 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
              <Skeleton className="mt-1 h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Bar Chart Skeleton */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full">
              <div className="flex h-full items-end justify-around px-4">
                {[...Array(7)].map((_, i) => (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <Skeleton className="h-24 w-10" />
                    <Skeleton className="h-3 w-12" />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pie Chart Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-32" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <Skeleton className="size-40 rounded-full" />
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center gap-1">
                    <Skeleton className="size-3 rounded-full" />
                    <Skeleton className="h-3 w-12" />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Line Chart Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-56" />
        </CardHeader>
        <CardContent>
          <div className="h-[250px] w-full">
            <div className="flex h-full items-end justify-around px-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <Skeleton className="h-20 w-8" />
                  <Skeleton className="h-3 w-10" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Bookings Skeleton */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <Skeleton className="h-5 w-32" />
            <Skeleton className="mt-1 h-4 w-48" />
          </div>
          <Skeleton className="h-9 w-20" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg border border-border p-4"
              >
                <div className="flex items-center gap-4">
                  <Skeleton className="size-10 rounded-full" />
                  <div>
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="mt-1 h-3 w-36" />
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
