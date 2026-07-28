"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChevronDown, LogOut, Settings, User } from "lucide-react"

// Organized navigation items
const NAV_ITEMS = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "About", href: "#about" },
  { label: "Blog", href: "#blog" },
]

// User dropdown menu items
const USER_MENU_ITEMS = [
  { label: "Profile", icon: User },
  { label: "Settings", icon: Settings },
  { label: "Logout", icon: LogOut },
]

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-bold text-foreground transition-opacity hover:opacity-80"
        >
          Logo
        </Link>

        {/* Center Navigation Links */}
        <div className="hidden gap-8 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Right side: User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="ghost" className="gap-2 pr-3 pl-2">
              <Avatar className="size-8">
                <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium sm:inline">
                John Doe
              </span>
              <ChevronDown className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="flex flex-col gap-2 p-2">
              <p className="text-sm font-semibold text-foreground">
                john@example.com
              </p>
              <p className="text-xs text-muted-foreground">Pro Member</p>
            </div>
            <DropdownMenuSeparator />
            {USER_MENU_ITEMS.map((item) => {
              const Icon = item.icon
              return (
                <DropdownMenuItem key={item.label} className="cursor-pointer">
                  <Icon className="mr-2 size-4" />
                  <span>{item.label}</span>
                </DropdownMenuItem>
              )
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  )
}
