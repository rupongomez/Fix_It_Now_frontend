"use client"

import { useActionState, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { LoginAction } from "../_auth/authActions"
import { toast } from "sonner"
import { useSearchParams } from "next/navigation"

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type LoginFormData = z.infer<typeof loginSchema>
const LoginForm = () => {
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirectTo") ?? ""

  const [state, action, pending] = useActionState(
    LoginAction.bind(null, redirectTo),
    false
  )

  useEffect(() => {
    if (!state) return

    if (state.success) {
      toast.success(state.message || "Login Successful")
    }
    if (!state.success) {
      toast.error(state.message || "Login failed")
    }
  }, [state])

  return (
    <div className="rounded-lg border border-border bg-card p-8">
      {error && (
        <div className="mb-4 rounded-md border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <form action={action} className="space-y-6">
        {/* Email Field */}
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="text-sm font-medium text-foreground"
          >
            Email Address
          </label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            {...register("email")}
            className={`${errors.email ? "border-destructive" : ""}`}
            disabled={pending}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="text-sm font-medium text-foreground"
            >
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-xs text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            {...register("password")}
            className={`${errors.password ? "border-destructive" : ""}`}
            disabled={pending}
          />
          {errors.password && (
            <p className="text-xs text-destructive">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <Button type="submit" disabled={pending} className="w-full">
          {pending ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      {/* Footer */}
      <div className="mt-6 text-center text-sm">
        <span className="text-muted-foreground">
          Don&apos;t have an account?{" "}
        </span>
        <Link
          href="/register"
          className="font-medium text-primary hover:underline"
        >
          Sign up
        </Link>
      </div>
    </div>
  )
}

export default LoginForm
