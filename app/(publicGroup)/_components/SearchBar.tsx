"use client"

import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Search, SearchIcon, X } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

export function SearchBar() {
  const pathName = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()

  const debouncedReference = useRef<ReturnType<typeof setTimeout> | null>(null)
  const handleChange = (value: string) => {
    if (debouncedReference.current) {
      clearTimeout(debouncedReference.current)
    }

    debouncedReference.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams)

      if (value) {
        params.set("searchTerms", value)
      } else {
        params.delete("searchTerms")
      }

      router.replace(`${pathName}?${params.toString()}`)
    }, 500)
  }

  return (
    <div className="relative w-full max-w-sm">
      <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        key={searchParams.get("searchTerms") ?? ""}
        defaultValue={
          searchParams.get("searchTerms")
            ? searchParams.get("searchTerms")?.toString()
            : ""
        }
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Search the khoj..."
        className="pl-9"
      />
    </div>
  )
}
