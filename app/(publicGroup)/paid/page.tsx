// app/(publicGroup)/paid/page.tsx
"use client"

import { startTransition, useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { CheckCircle2, XCircle, Loader2, Home, ArrowRight } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export default function PaymentStatusPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState<"success" | "failed" | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const successParam = searchParams.get("success")

    startTransition(() => {
      if (successParam === "true") {
        setStatus("success")
        toast.success("Payment completed successfully!")
      } else if (successParam === "false") {
        setStatus("failed")
        toast.error("Payment failed. Please try again.")
      } else {
        router.push("/")
        return
      }
      setIsLoading(false)
    })
  }, [searchParams, router, startTransition])

  // Loading state
  if (isLoading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center px-4">
        <Card className="w-full max-w-sm sm:max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-8 sm:py-12">
            <Loader2 className="size-10 animate-spin text-primary sm:size-12" />
            <p className="mt-4 text-sm text-muted-foreground sm:text-base">
              Verifying payment...
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Success state
  if (status === "success") {
    return (
      <div className="flex min-h-[80vh] items-center justify-center px-4 py-8">
        <Card className="w-full max-w-sm border-green-200 shadow-lg sm:max-w-md dark:border-green-900/30">
          <CardContent className="flex flex-col items-center justify-center px-4 py-8 sm:px-6 sm:py-12">
            {/* Icon */}
            <div className="mb-4 rounded-full bg-green-100 p-3 sm:mb-6 sm:p-4 dark:bg-green-900/30">
              <CheckCircle2 className="size-12 text-green-600 sm:size-16 dark:text-green-400" />
            </div>

            {/* Header */}
            <div className="space-y-2 text-center sm:space-y-3">
              <CardTitle className="text-2xl font-bold text-green-600 sm:text-3xl dark:text-green-400">
                Payment Successful! 🎉
              </CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Your booking has been confirmed. The technician will start soon.
              </CardDescription>
            </div>

            {/* Buttons */}
            <div className="mt-6 flex w-full flex-col gap-2 sm:mt-8 sm:gap-3">
              <Link href="/dashboard/customer" className="w-full">
                <Button className="w-full text-sm sm:text-base">
                  <Home className="mr-2 size-4" />
                  Go to Dashboard
                </Button>
              </Link>
              <Link href="/services" className="w-full">
                <Button
                  variant="outline"
                  className="w-full text-sm sm:text-base"
                >
                  Browse More Services
                  <ArrowRight className="ml-2 size-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Failed state
  if (status === "failed") {
    return (
      <div className="flex min-h-[80vh] items-center justify-center px-4 py-8">
        <Card className="w-full max-w-sm border-red-200 shadow-lg sm:max-w-md dark:border-red-900/30">
          <CardContent className="flex flex-col items-center justify-center px-4 py-8 sm:px-6 sm:py-12">
            {/* Icon */}
            <div className="mb-4 rounded-full bg-red-100 p-3 sm:mb-6 sm:p-4 dark:bg-red-900/30">
              <XCircle className="size-12 text-red-600 sm:size-16 dark:text-red-400" />
            </div>

            {/* Header */}
            <div className="space-y-2 text-center sm:space-y-3">
              <CardTitle className="text-2xl font-bold text-red-600 sm:text-3xl dark:text-red-400">
                Payment Failed ❌
              </CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Something went wrong with your payment. Please try again.
              </CardDescription>
            </div>

            {/* Buttons */}
            <div className="mt-6 flex w-full flex-col gap-2 sm:mt-8 sm:gap-3">
              <Button
                className="w-full text-sm sm:text-base"
                onClick={() => router.back()}
              >
                <ArrowRight className="mr-2 size-4" />
                Try Again
              </Button>
              <Link href="/dashboard/customer" className="w-full">
                <Button
                  variant="outline"
                  className="w-full text-sm sm:text-base"
                >
                  <Home className="mr-2 size-4" />
                  Go to Dashboard
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return null
}
