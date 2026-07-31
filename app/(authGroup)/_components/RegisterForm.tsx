"use client"

import { useActionState, useEffect, useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { RegisterAction } from "../_auth/authActions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().min(10, "Phone must be at least 10 digits"),
  location: z.string().min(2, "Location is required"),
  role: z.enum(["CUSTOMER", "TECHNICIAN"], {
    message: "Please select a role",
  }),
  profileImage: z.string().optional(),
})

type RegisterFormData = z.infer<typeof registerSchema>

const RegisterForm = () => {
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [isPending, startTransition] = useTransition()
  const [role, setRole] = useState<string>("CUSTOMER")
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
      location: "",
      role: "CUSTOMER",
      profileImage: "",
    },
  })

  const [state, action, pending] = useActionState(RegisterAction, false)

  useEffect(() => {
    if (!state) return
    if (state.success) {
      toast.success("Registration successful. You may now log in.")
      router.push("/login")
    }
  }, [state, router])

  const onSubmit = async (data: RegisterFormData) => {
    // Convert data to FormData for the server action
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value as string)
    })

    startTransition(() => {
      action(formData)
    })
  }

  return (
    <div>
      {/* Success Message */}
      {successMessage && (
        <Alert className="mb-6 border-green-200 bg-green-50 dark:bg-green-900/20">
          <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
          <AlertDescription className="text-green-800 dark:text-green-200">
            {successMessage}
          </AlertDescription>
        </Alert>
      )}

      {/* Error Message */}
      {errorMessage && (
        <Alert className="mb-6 border-red-200 bg-red-50 dark:bg-red-900/20">
          <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
          <AlertDescription className="text-red-800 dark:text-red-200">
            {errorMessage}
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Name Field */}
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">
            Full Name
          </label>
          <Input
            placeholder="John Doe"
            disabled={pending}
            {...register("name")}
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">
            Email
          </label>
          <Input
            type="email"
            placeholder="you@example.com"
            disabled={pending}
            {...register("email")}
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* Phone Field */}
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">
            Phone Number
          </label>
          <Input
            placeholder="+1 (555) 000-0000"
            disabled={pending}
            {...register("phone")}
            className={errors.phone ? "border-red-500" : ""}
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>
          )}
        </div>

        {/* Location Field */}
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">
            Location
          </label>
          <Input
            placeholder="City, State"
            disabled={pending}
            {...register("location")}
            className={errors.location ? "border-red-500" : ""}
          />
          {errors.location && (
            <p className="mt-1 text-sm text-red-500">
              {errors.location.message}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">
            Password
          </label>
          <Input
            type="password"
            placeholder="••••••"
            disabled={pending}
            {...register("password")}
            className={errors.password ? "border-red-500" : ""}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>

        {/*  Simple Radio Buttons - No Select API issues! */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">
            I am a
          </label>
          <div className="flex gap-6">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="radio"
                value="CUSTOMER"
                name="role"
                checked={role === "CUSTOMER"}
                onChange={(e) => {
                  setRole(e.target.value)
                  setValue("role", "CUSTOMER")
                }}
                disabled={pending}
                className="h-4 w-4 accent-primary"
              />
              <span className="text-sm">Customer</span>
            </label>
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="radio"
                value="TECHNICIAN"
                checked={role === "TECHNICIAN"}
                onChange={(e) => {
                  setRole(e.target.value)
                  setValue("role", "TECHNICIAN")
                }}
                disabled={pending}
                className="h-4 w-4 accent-primary"
              />
              <span className="text-sm">Technician</span>
            </label>
          </div>
          {errors.role && (
            <p className="text-sm text-red-500">{errors.role.message}</p>
          )}
        </div>

        {/* Profile Image Field (Optional) */}
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">
            Profile Image URL{" "}
            <span className="text-xs text-muted-foreground">(Optional)</span>
          </label>
          <Input
            placeholder="https://example.com/image.jpg"
            disabled={pending}
            {...register("profileImage")}
          />
          {errors.profileImage && (
            <p className="mt-1 text-sm text-red-500">
              {errors.profileImage.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <Button type="submit" disabled={pending} className="w-full" size="lg">
          {pending ? "Creating account..." : "Create Account"}
        </Button>
      </form>
    </div>
  )
}

export default RegisterForm
