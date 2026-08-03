"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Loader2, X, Plus } from "lucide-react"
import { toast } from "sonner"

interface EditProfileModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  technician: {
    id: string
    bio: string
    experience: number
    hourlyRate: string
    location: string
    skills?: string[]
  }
  onSave: (data: {
    bio: string
    experience: number
    hourlyRate: number
    service: string[]
    location: string
  }) => Promise<void>
}

export function EditProfileModal({
  open,
  onOpenChange,
  technician,
  onSave,
}: EditProfileModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    bio: technician.bio || "",
    experience: technician.experience || 0,
    hourlyRate: parseFloat(technician.hourlyRate) || 0,
    location: technician.location || "",
    service: technician.skills || [],
  })
  const [newSkill, setNewSkill] = useState("")

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.service.includes(newSkill.trim())) {
      setFormData((prev) => ({
        ...prev,
        service: [...prev.service, newSkill.trim()],
      }))
      setNewSkill("")
    }
  }

  const handleRemoveSkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      service: prev.service.filter((s) => s !== skill),
    }))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddSkill()
    }
  }

  const handleSubmit = async () => {
    if (!formData.bio.trim()) {
      toast.error("Please enter a bio")
      return
    }
    if (formData.experience < 0) {
      toast.error("Experience cannot be negative")
      return
    }
    if (formData.hourlyRate <= 0) {
      toast.error("Hourly rate must be greater than 0")
      return
    }
    if (!formData.location.trim()) {
      toast.error("Please enter your location")
      return
    }

    try {
      setIsSubmitting(true)
      await onSave({
        bio: formData.bio,
        experience: formData.experience,
        hourlyRate: formData.hourlyRate,
        service: formData.service,
        location: formData.location,
      })
      toast.success("Profile updated successfully!")
      onOpenChange(false)
    } catch (error) {
      toast.error("Failed to update profile")
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update your technician profile information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              placeholder="Tell customers about yourself..."
              value={formData.bio}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, bio: e.target.value }))
              }
              rows={4}
              disabled={isSubmitting}
            />
          </div>

          {/* Experience */}
          <div className="space-y-2">
            <Label htmlFor="experience">Years of Experience</Label>
            <Input
              id="experience"
              type="number"
              min="0"
              value={formData.experience}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  experience: parseInt(e.target.value) || 0,
                }))
              }
              disabled={isSubmitting}
            />
          </div>

          {/* Hourly Rate */}
          <div className="space-y-2">
            <Label htmlFor="hourlyRate">Hourly Rate (৳)</Label>
            <Input
              id="hourlyRate"
              type="number"
              min="0"
              step="0.01"
              value={formData.hourlyRate}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  hourlyRate: parseFloat(e.target.value) || 0,
                }))
              }
              disabled={isSubmitting}
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="e.g., Dhaka, Bangladesh"
              value={formData.location}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, location: e.target.value }))
              }
              disabled={isSubmitting}
            />
          </div>

          {/* Skills */}
          <div className="space-y-2">
            <Label>Skills / Services</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Add a skill (e.g., Plumbing)"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isSubmitting}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleAddSkill}
                disabled={isSubmitting || !newSkill.trim()}
              >
                <Plus className="size-4" />
              </Button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {formData.service.map((skill) => (
                <Badge key={skill} variant="secondary" className="gap-1">
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="ml-1 rounded-full hover:bg-muted"
                    disabled={isSubmitting}
                  >
                    <X className="size-3" />
                  </button>
                </Badge>
              ))}
              {formData.service.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No skills added yet
                </p>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
