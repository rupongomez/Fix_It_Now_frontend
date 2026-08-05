"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Star, Loader2, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"
import { getReviewsForCustomer } from "../_actions/reviewActions"

interface ReviewModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  booking: {
    id: string
    technicianProfileId: string
  } | null
  onSubmitReview: (data: {
    bookingId: string
    technicianProfileId: string
    rating: number
    comment: string
  }) => Promise<void>
}

export function ReviewModal({
  open,
  onOpenChange,
  booking,
  onSubmitReview,
}: ReviewModalProps) {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasReview, setHasReview] = useState(false)
  const [existingReview, setExistingReview] = useState<{
    rating: number
    comment: string
  } | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  //   Check if review already exists when modal opens
  useEffect(() => {
    const checkExistingReview = async () => {
      if (!booking?.id) {
        console.log("No booking ID available")
        return
      }

      setIsLoading(true)
      try {
        const response = await getReviewsForCustomer(booking.id)

        if (response.success && response.data && response.data.length > 0) {
          const review = response.data[0]
          setHasReview(true)
          setExistingReview({
            rating: review.rating,
            comment: review.comment,
          })
        } else {
          setHasReview(false)
          setExistingReview(null)
        }
      } catch (error) {
        console.error("Error checking review:", error)
        setHasReview(false)
        setExistingReview(null)
      } finally {
        setIsLoading(false)
      }
    }

    if (open) {
      checkExistingReview()
    }
  }, [open, booking?.id])

  // Reset form when modal closes
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setRating(0)
      setComment("")
      setHasReview(false)
      setExistingReview(null)
    }
    onOpenChange(isOpen)
  }

  const handleSubmit = async () => {
    if (!booking) {
      toast.error("No booking selected")
      return
    }

    if (rating === 0) {
      toast.error("Please select a rating")
      return
    }

    try {
      setIsSubmitting(true)
      await onSubmitReview({
        bookingId: booking.id,
        technicianProfileId: booking.technicianProfileId,
        rating,
        comment,
      })
      toast.success("Review submitted successfully!")
      handleOpenChange(false)
    } catch (error) {
      toast.error("Failed to submit review")
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Leave a Review</DialogTitle>
          <DialogDescription>Share your experience</DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="size-8 animate-spin text-primary" />
          </div>
        ) : hasReview && existingReview ? (
          //   Show existing review
          <div className="space-y-4 py-4">
            <div className="rounded-lg bg-green-50 p-4 text-center dark:bg-green-950/20">
              <CheckCircle2 className="mx-auto mb-2 size-8 text-green-500" />
              <h3 className="font-semibold text-green-700 dark:text-green-300">
                You already reviewed this service
              </h3>
              <div className="mt-2 flex justify-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`size-5 ${
                      star <= existingReview.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>
              {existingReview.comment && (
                <p className="mt-2 text-sm text-muted-foreground">
                  {existingReview.comment}
                </p>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => handleOpenChange(false)}>
                Close
              </Button>
            </DialogFooter>
          </div>
        ) : (
          //   Review form
          <>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Rating *</Label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="focus:outline-none"
                      disabled={isSubmitting}
                    >
                      <Star
                        className={`size-8 transition-colors ${
                          star <= (hoveredRating || rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-muted-foreground"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                {rating > 0 && (
                  <p className="text-sm text-muted-foreground">
                    {rating} star{rating > 1 ? "s" : ""}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="comment">Comment (Optional)</Label>
                <Textarea
                  id="comment"
                  placeholder="What did you think about the service?"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || rating === 0 || hasReview}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Submitting...
                  </>
                ) : hasReview ? (
                  "Already Reviewed"
                ) : (
                  "Submit Review"
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
