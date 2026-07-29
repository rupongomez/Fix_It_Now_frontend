import Link from "next/link"
import RegisterForm from "../_components/RegisterForm"

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-b from-background to-muted/20 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-foreground">
            Create Account
          </h1>
          <p className="text-muted-foreground">Join us and get started today</p>
        </div>

        {/* Form */}
        <RegisterForm />

        {/* Login Link */}
        <p className="mt-6 text-center text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-primary hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
