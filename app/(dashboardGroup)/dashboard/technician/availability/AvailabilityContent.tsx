"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

import { CalendarIcon, Clock, Loader2, Plus } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { format, parseISO } from "date-fns"
import { toast } from "sonner"

import { getMe } from "@/service/getMe"
import { IUser } from "@/lib/types/UserTypes"
import {
  createAvailability,
  getAvailability,
} from "@/app/(dashboardGroup)/_actions/availabilityActions"

interface AvailabilitySlot {
  id: string
  technicianProfileId: string
  date: string
  startTime: string
  endTime: string
  isBooked: boolean
}

export default function AvailabilityContent() {
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<IUser | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [modalOpen, setModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [startTime, setStartTime] = useState("09:00")
  const [endTime, setEndTime] = useState("12:00")

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const userData = await getMe()

        if (userData.success && userData.data) {
          setUser(userData)

          const response = await getAvailability(userData.data.id)
          console.log("Availability response:", response)

          if (response.success && response.data) {
            setAvailability(response.data)
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        toast.error("Failed to load availability")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleSubmit = async () => {
    if (!selectedDate || !user?.data?.id) return

    if (!startTime || !endTime) {
      toast.error("Please select both start and end time")
      return
    }

    if (startTime >= endTime) {
      toast.error("End time must be after start time")
      return
    }

    try {
      setIsSubmitting(true)

      const dateStr = format(selectedDate, "yyyy-MM-dd'T'00:00:00.000'Z'")
      const startDateTime = `${format(selectedDate, "yyyy-MM-dd")}T${startTime}:00.000Z`
      const endDateTime = `${format(selectedDate, "yyyy-MM-dd")}T${endTime}:00.000Z`

      const payload = {
        technicianProfileId: user.data.id,
        date: dateStr,
        startTime: startDateTime,
        endTime: endDateTime,
        isBooked: false,
      }

      console.log("Sending payload:", payload)

      const response = await createAvailability(payload)
      console.log("Create response:", response)

      if (response.success && response.data) {
        setAvailability([...availability, response.data])
        toast.success("Availability slot added successfully!")
        setModalOpen(false)
        setSelectedDate(undefined)
        setStartTime("09:00")
        setEndTime("12:00")
      } else {
        toast.error(response.message || "Failed to add availability")
      }
    } catch (error) {
      console.error("Error creating availability:", error)
      toast.error("Something went wrong")
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDate = (dateString: string) => {
    return format(parseISO(dateString), "EEE, MMM d, yyyy")
  }

  const formatTime = (dateString: string) => {
    return format(parseISO(dateString), "h:mm a")
  }

  const isDateDisabled = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today
  }

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
              {[...Array(3)].map((_, i) => (
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-foreground">Availability</h1>
        <p className="mt-1 text-muted-foreground">
          Manage your available time slots for bookings
        </p>
      </div>

      <div className="flex justify-end">
        <Button onClick={() => setModalOpen(true)} className="gap-2">
          <Plus className="size-4" />
          Add Availability
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Your Availability</CardTitle>
          <CardDescription>
            {availability.length} slot{availability.length !== 1 ? "s" : ""}{" "}
            available
          </CardDescription>
        </CardHeader>
        <CardContent>
          {availability.length > 0 ? (
            <div className="space-y-3">
              {availability.map((slot) => (
                <div
                  key={slot.id}
                  className="flex flex-col items-start justify-between rounded-lg border border-border p-4 sm:flex-row sm:items-center"
                >
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="size-4 text-muted-foreground" />
                      <span className="font-medium text-foreground">
                        {formatDate(slot.date)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="size-4 text-muted-foreground" />
                      <span className="text-sm">
                        {formatTime(slot.startTime)} -{" "}
                        {formatTime(slot.endTime)}
                      </span>
                    </div>
                    <Badge
                      className={
                        slot.isBooked
                          ? "bg-red-500 hover:bg-red-600"
                          : "bg-green-500 hover:bg-green-600"
                      }
                    >
                      {slot.isBooked ? "Booked" : "Available"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <CalendarIcon className="mb-4 size-12 text-muted-foreground" />
              <h3 className="text-lg font-semibold">No availability set</h3>
              <p className="text-sm text-muted-foreground">
                Add your available time slots to start receiving bookings
              </p>
              <Button onClick={() => setModalOpen(true)} className="mt-4 gap-2">
                <Plus className="size-4" />
                Add Availability
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Availability Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Availability</DialogTitle>
            <DialogDescription>
              Select a date and time range when you`&apos;`re available
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger className="flex w-full items-center justify-start gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm font-normal ring-offset-background transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50">
                <CalendarIcon className="size-4" />
                {selectedDate ? (
                  format(selectedDate, "PPP")
                ) : (
                  <span className="text-muted-foreground">Pick a date</span>
                )}
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={isDateDisabled}
                />
              </PopoverContent>
            </Popover>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setModalOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !selectedDate}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Slot"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
