"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Home } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-background to-muted/20 px-4">
      <div className="max-w-md text-center">
        {/* 404 Number */}
        <div className="mb-8">
          <h1 className="mb-4 text-9xl font-bold text-primary/20">404</h1>
          <h2 className="mb-2 text-3xl font-bold text-foreground">
            Page Not Found
          </h2>
          <p className="text-lg text-muted-foreground">
            Sorry, the page you&apos;re looking for doesn&apos;t exist or has
            been moved.
          </p>
        </div>

        {/* Illustration area */}
        <div className="mb-12 py-8">
          <div className="relative">
            <div className="mb-4 text-6xl">🔍</div>
            <div className="absolute top-0 right-0 text-5xl opacity-50">❌</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Link href="/">
            <Button size="lg" variant="default">
              <Home className="size-4" />
              Go Home
            </Button>
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-input bg-background px-6 py-3 text-base font-medium text-foreground hover:bg-accent"
          >
            <ArrowLeft className="size-4" />
            Go Back
          </button>
        </div>

        {/* Helpful Links */}
        <div className="mt-12 border-t border-border pt-8">
          <p className="mb-4 text-sm text-muted-foreground">Quick Links:</p>
          <nav className="flex flex-col gap-2">
            <Link href="/" className="text-sm text-primary hover:underline">
              Home
            </Link>
            <Link
              href="/login"
              className="text-sm text-primary hover:underline"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="text-sm text-primary hover:underline"
            >
              Register
            </Link>
          </nav>
        </div>
      </div>
    </div>
  )
}
