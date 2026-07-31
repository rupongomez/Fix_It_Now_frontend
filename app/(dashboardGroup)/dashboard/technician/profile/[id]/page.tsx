import { TechnicianProfileSkeleton } from "@/app/(dashboardGroup)/_components/TechnicianPrfileLoadingSkeleton"
import TechnicianProfile from "@/app/(dashboardGroup)/_components/TechnicianProfile"
import { Suspense } from "react"

export default function TechnicianProfilePage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-background to-muted/20 py-8">
      <div className="mx-auto block max-w-4xl px-4">
        <Suspense fallback={<TechnicianProfileSkeleton />}>
          <TechnicianProfile />
        </Suspense>
      </div>
    </div>
  )
}
