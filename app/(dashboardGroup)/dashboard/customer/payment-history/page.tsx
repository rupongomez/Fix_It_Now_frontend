"use client"

import { useEffect, useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
  Calendar,
  DollarSign,
  CreditCard,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  Download,
} from "lucide-react"
import { toast } from "sonner"
import { getAllPaymentHistoryForCustomer } from "@/app/(publicGroup)/_actions/checkoutAction"

interface Payment {
  id: string
  bookingId: string
  customerId: string
  transactionId: string
  stripeCustomerId: string
  amount: string
  currency: string
  status: "COMPLETED" | "PENDING" | "FAILED"
  paidAt: string
  createdAt: string
  updatedAt: string
}

const STATUS_CONFIG: Record<
  string,
  { color: string; icon: React.ReactNode; label: string }
> = {
  COMPLETED: {
    color:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    icon: <CheckCircle2 className="size-4" />,
    label: "Completed",
  },
  PENDING: {
    color:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    icon: <Clock className="size-4" />,
    label: "Pending",
  },
  FAILED: {
    color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    icon: <XCircle className="size-4" />,
    label: "Failed",
  },
}

export default function PaymentHistoryPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setIsLoading(true)
        const response = await getAllPaymentHistoryForCustomer()

        if (response.success && response.data) {
          setPayments(response.data)
        } else {
          setError(response.message || "Failed to fetch payment history")
          toast.error(response.message || "Failed to fetch payment history")
        }
      } catch (error) {
        console.error("Failed to fetch payments:", error)
        setError("Something went wrong")
        toast.error("Failed to load payment history")
      } finally {
        setIsLoading(false)
      }
    }

    fetchPayments()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const totalSpent = payments
    .filter((p) => p.status === "COMPLETED")
    .reduce((sum, p) => sum + parseFloat(p.amount), 0)

  const completedPayments = payments.filter(
    (p) => p.status === "COMPLETED"
  ).length

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-10 w-48" />
          <Skeleton className="mt-1 h-5 w-64" />
        </div>
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
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold text-foreground">
            Payment History
          </h1>
          <p className="mt-1 text-muted-foreground">
            View all your past payments and transactions
          </p>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <XCircle className="mb-4 size-12 text-red-500" />
            <h3 className="text-xl font-semibold text-foreground">
              Failed to load payment history
            </h3>
            <p className="mt-2 text-muted-foreground">{error}</p>
            <Button className="mt-6" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-foreground">Payment History</h1>
        <p className="mt-1 text-muted-foreground">
          View all your past payments and transactions
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-sm font-medium">
              Total Payments
            </CardDescription>
            <CreditCard className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{payments.length}</div>
            <p className="text-xs text-muted-foreground">
              {completedPayments} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-sm font-medium">
              Total Spent
            </CardDescription>
            <DollarSign className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              ৳{totalSpent.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">Lifetime spending</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-sm font-medium">
              Average Payment
            </CardDescription>
            <DollarSign className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ৳
              {payments.length > 0
                ? (totalSpent / payments.length).toFixed(2)
                : "0.00"}
            </div>
            <p className="text-xs text-muted-foreground">Per transaction</p>
          </CardContent>
        </Card>
      </div>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">All Payments</CardTitle>
          <CardDescription>
            {payments.length} payment{payments.length !== 1 ? "s" : ""} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {payments.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Booking ID</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => {
                    const statusConfig = STATUS_CONFIG[payment.status] || {
                      color: "bg-gray-100 text-gray-800",
                      icon: <FileText className="size-4" />,
                      label: payment.status,
                    }

                    return (
                      <TableRow key={payment.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <CreditCard className="size-4 text-muted-foreground" />
                            <span className="text-sm font-medium">
                              {payment.transactionId.slice(0, 12)}...
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {payment.bookingId.slice(0, 8)}...
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="font-semibold">
                            ৳{parseFloat(payment.amount).toFixed(2)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge className={statusConfig.color}>
                            {statusConfig.icon}
                            {statusConfig.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="size-3" />
                            {formatDate(payment.paidAt)}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-1"
                            onClick={() => {
                              toast.info("Invoice download coming soon")
                            }}
                          >
                            <Download className="size-4" />
                            Invoice
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <CreditCard className="mb-4 size-12 text-muted-foreground" />
              <h3 className="text-lg font-semibold">No payments yet</h3>
              <p className="text-sm text-muted-foreground">
                Your payment history will appear here
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
