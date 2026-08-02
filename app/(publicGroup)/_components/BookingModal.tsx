"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Calendar,
  MapPin,
  Clock,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  XCircle,
} from "lucide-react"
import { getAvailability } from "../_actions/getAvailability"
import { makeBookingRequest } from "../_actions/bookingAction"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

// ✅ Zod Schema for validation
const bookingSchema = z.object({
  customerAddress: z.string().min(1, "Service address is required"),
  note: z.string().optional(),
  availabilitySlotId: z.string().min(1, "Please select an available time slot"),
  bookingTime: z.string().min(1, "Please select a booking time"),
})

type BookingFormValues = z.infer<typeof bookingSchema>

interface BookingModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  service?: {
    id: string
    title: string
    price: string
    duration: number
    location: string
    technicianProfileId: string
  }
  onSubmit?: (bookingData: BookingFormData) => void
}

export interface BookingFormData {
  technicianIdToBook: string
  serviceId: string
  availabilitySlotId: string
  bookingTime: string
  customerAddress: string
  note: string
}

interface AvailabilitySlot {
  id: string
  technicianProfileId: string
  date: string
  startTime: string
  endTime: string
  isBooked: boolean
}

export function BookingModal({
  open,
  onOpenChange,
  service,
  onSubmit,
}: BookingModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [availabilitySlots, setAvailabilitySlots] = useState<
    AvailabilitySlot[]
  >([])
  const [selectedSlotId, setSelectedSlotId] = useState<string>("")
  const router = useRouter()

  // ✅ React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      customerAddress: "",
      note: "",
      availabilitySlotId: "",
      bookingTime: "",
    },
  })

  // ✅ Handle modal open/close - reset state when closing
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      // Reset everything when modal closes
      reset()
      setSelectedSlotId("")
      setAvailabilitySlots([])
    }
    onOpenChange(isOpen)
  }

  // Fetch availability when modal opens
  useEffect(() => {
    if (!open || !service?.technicianProfileId) return

    const fetchAvailability = async () => {
      try {
        const response = await getAvailability(service.technicianProfileId)
        console.log("Availability response:", response)

        if (response.success && response.data) {
          setAvailabilitySlots(response.data)
        }
      } catch (error) {
        console.error("Error fetching availability:", error)
      }
    }

    fetchAvailability()
  }, [open, service?.technicianProfileId])

  const handleSelectSlot = (slot: AvailabilitySlot) => {
    if (slot.isBooked) return

    setSelectedSlotId(slot.id)
    setValue("availabilitySlotId", slot.id)
    setValue("bookingTime", slot.startTime)
  }

  const onFormSubmit = async (data: BookingFormValues) => {
    if (!service) return

    try {
      setIsSubmitting(true)

      const bookingData: BookingFormData = {
        technicianIdToBook: service.technicianProfileId,
        serviceId: service.id,
        availabilitySlotId: data.availabilitySlotId,
        bookingTime: data.bookingTime,
        customerAddress: data.customerAddress,
        note: data.note || "",
      }

      if (onSubmit) {
        onSubmit(bookingData)
      }

      const response = await makeBookingRequest(bookingData)

      if (response.success) {
        toast.success("Booking request submitted Successfully!")
        router.push("/")
      }

      // Close modal after successful submission
      handleOpenChange(false)
    } catch (error) {
      console.error("Booking error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const selectedSlot = availabilitySlots.find(
    (slot) => slot.id === selectedSlotId
  )

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="flex max-h-[90vh] w-full max-w-2xl flex-col gap-0 overflow-hidden p-0">
        {/* Header */}
        <DialogHeader className="sticky top-0 z-10 shrink-0 border-b border-border bg-background px-4 py-4 sm:px-6">
          <DialogTitle className="text-xl sm:text-2xl">
            Book This Service
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Select an available time slot and fill in your details
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable Content */}
        <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4 sm:space-y-6 sm:px-6">
          <form
            onSubmit={handleSubmit(onFormSubmit)}
            className="space-y-4 sm:space-y-6"
          >
            {/* Service Summary */}
            {service && (
              <div className="space-y-2 rounded-lg border border-primary/10 bg-primary/5 p-3 sm:space-y-3 sm:p-4">
                <h3 className="truncate text-sm font-semibold text-foreground sm:text-base">
                  {service.title}
                </h3>
                <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-3 sm:gap-4 sm:text-sm">
                  <div className="flex min-w-0 items-center gap-2">
                    <DollarSign className="size-3 shrink-0 text-primary sm:size-4" />
                    <div className="min-w-0">
                      <p className="text-muted-foreground">Price</p>
                      <p className="truncate font-semibold text-foreground">
                        ৳{service.price}
                      </p>
                    </div>
                  </div>
                  <div className="flex min-w-0 items-center gap-2">
                    <Clock className="size-3 shrink-0 text-primary sm:size-4" />
                    <div className="min-w-0">
                      <p className="text-muted-foreground">Duration</p>
                      <p className="font-semibold text-foreground">
                        {service.duration}h
                      </p>
                    </div>
                  </div>
                  <div className="col-span-2 flex min-w-0 items-center gap-2 sm:col-span-1">
                    <MapPin className="size-3 shrink-0 text-primary sm:size-4" />
                    <div className="min-w-0">
                      <p className="text-muted-foreground">Location</p>
                      <p className="truncate font-semibold text-foreground">
                        {service.location}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Availability Slots */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <Calendar className="size-4 text-primary" />
                Available Time Slots
              </Label>

              {availabilitySlots.length > 0 ? (
                <div className="grid gap-2 sm:grid-cols-2">
                  {availabilitySlots.map((slot) => (
                    <button
                      key={slot.id}
                      type="button"
                      onClick={() => handleSelectSlot(slot)}
                      disabled={slot.isBooked}
                      className={`rounded-lg border p-3 text-left transition-all ${
                        selectedSlotId === slot.id
                          ? "border-primary bg-primary/10 ring-2 ring-primary"
                          : slot.isBooked
                            ? "cursor-not-allowed border-muted bg-muted/50 opacity-50"
                            : "border-border hover:border-primary/50 hover:bg-muted/50"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {formatDate(slot.date)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatTime(slot.startTime)} -{" "}
                            {formatTime(slot.endTime)}
                          </p>
                        </div>
                        {slot.isBooked ? (
                          <Badge variant="destructive" className="shrink-0">
                            <XCircle className="mr-1 size-3" />
                            Booked
                          </Badge>
                        ) : selectedSlotId === slot.id ? (
                          <Badge className="shrink-0 bg-primary">
                            <CheckCircle2 className="mr-1 size-3" />
                            Selected
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="shrink-0">
                            Available
                          </Badge>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-border p-4 text-center text-sm text-muted-foreground">
                  <Calendar className="mx-auto mb-2 size-6 text-muted-foreground" />
                  <p>No available time slots found</p>
                  <p className="text-xs">Please check back later</p>
                </div>
              )}

              {errors.availabilitySlotId && (
                <p className="text-xs text-red-500">
                  {errors.availabilitySlotId.message}
                </p>
              )}
            </div>

            {/* Selected Slot Summary */}
            {selectedSlot && (
              <div className="rounded-lg bg-primary/5 p-3 text-sm">
                <p className="font-medium text-foreground">Selected Time:</p>
                <p className="text-muted-foreground">
                  {formatDate(selectedSlot.date)} at{" "}
                  {formatTime(selectedSlot.startTime)}
                </p>
              </div>
            )}

            {/* Customer Address */}
            <div className="space-y-1.5 sm:space-y-2">
              <Label
                htmlFor="customerAddress"
                className="flex items-center gap-2 text-xs sm:text-sm"
              >
                <MapPin className="size-3 shrink-0 text-primary sm:size-4" />
                Service Address <span className="text-red-500">*</span>
              </Label>
              <Input
                id="customerAddress"
                placeholder="e.g., 221B Baker Street, London"
                {...register("customerAddress")}
                className={`h-9 bg-muted text-xs sm:h-10 sm:text-sm ${
                  errors.customerAddress ? "border-red-500" : ""
                }`}
              />
              {errors.customerAddress && (
                <p className="text-xs text-red-500">
                  {errors.customerAddress.message}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Where should the technician come?
              </p>
            </div>

            {/* Additional Notes */}
            <div className="space-y-1.5 sm:space-y-2">
              <Label
                htmlFor="note"
                className="flex items-center gap-2 text-xs sm:text-sm"
              >
                <AlertCircle className="size-3 shrink-0 text-primary sm:size-4" />
                Additional Notes (Optional)
              </Label>
              <Textarea
                id="note"
                placeholder="e.g., Please arrive 10 minutes early, gate code is 1234..."
                rows={3}
                className="min-h-20 resize-none bg-muted text-xs sm:text-sm"
                {...register("note")}
              />
              <p className="text-xs text-muted-foreground">
                Special instructions for the technician
              </p>
            </div>

            {/* Price Breakdown */}
            {service && (
              <div className="space-y-2 rounded-lg bg-muted/50 p-3 text-xs sm:p-4 sm:text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service Price</span>
                  <span className="font-medium text-foreground">
                    ৳{service.price}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Platform Fee</span>
                  <span className="font-medium text-foreground">৳0</span>
                </div>
                <div className="mt-2 flex justify-between border-t border-border pt-2">
                  <span className="font-semibold text-foreground">Total</span>
                  <span className="text-base font-bold text-primary sm:text-lg">
                    ৳{service.price}
                  </span>
                </div>
              </div>
            )}

            {/* Terms */}
            <div className="flex items-start gap-2 rounded-lg bg-muted/30 p-2 text-xs text-muted-foreground sm:p-3">
              <AlertCircle className="mt-0.5 size-3 shrink-0 sm:size-4" />
              <p className="leading-relaxed">
                By booking, you agree to our Terms. Payment is processed after
                acceptance.
              </p>
            </div>

            {/* Footer Buttons */}
            <DialogFooter className="sticky bottom-0 shrink-0 gap-2 border-t border-border bg-background px-4 py-3 sm:px-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={isSubmitting}
                className="h-9 text-xs sm:h-10 sm:text-sm"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !selectedSlotId}
                className="h-9 flex-1 bg-primary text-xs hover:bg-primary/90 sm:h-10 sm:text-sm"
              >
                {isSubmitting ? "Processing..." : "Confirm Booking"}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
