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
import { LogOut, Settings, User } from "lucide-react"
import { useRouter } from "next/navigation"
import { logout } from "@/service/logout"

// Organized navigation items
const NAV_ITEMS = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "About", href: "#about" },
  { label: "Blog", href: "#blog" },
  { label: "Services", href: "/services" },
]

// User dropdown menu items
const USER_MENU_ITEMS = [
  { label: "Profile", icon: User, action: "profile" },
  { label: "Settings", icon: Settings, action: "settings" },
  { label: "Logout", icon: LogOut, action: "logout" },
]

type IUser = {
  success: boolean
  statusCode: number
  message: string
  data: {
    id: string
    name: string
    email: string
    phone: string
    location: string
    role: string
    status: string
    profileImage?: string
    stripeCustomerId?: string | null
    createdAt: string
    updatedAt: string
  }
}

export function Navbar({ user }: { user?: IUser }) {
  console.log(user)
  const router = useRouter()

  const handleUserMenuAction = async (action: string) => {
    if (action === "profile") {
      router.push("/profile")
    } else if (action === "settings") {
      router.push("/settings")
    } else if (action === "logout") {
      await logout()
    }
  }

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
        {user?.success ? (
          <DropdownMenu>
            <DropdownMenuTrigger className="flex cursor-pointer items-center gap-2 rounded-lg pr-3 pl-2 transition-colors outline-none hover:bg-accent">
              <Avatar className="size-8">
                <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium sm:inline">
                {user.data.name}
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="flex flex-col gap-2 p-2">
                <p className="text-sm font-semibold text-foreground">
                  {user.data.email}
                </p>
                <p className="text-xs text-muted-foreground">
                  {user.data.role}
                </p>
              </div>
              <DropdownMenuSeparator />
              {USER_MENU_ITEMS.map((item) => {
                const Icon = item.icon
                return (
                  <DropdownMenuItem
                    key={item.label}
                    className="cursor-pointer"
                    onClick={() => handleUserMenuAction(item.action)}
                  >
                    <Icon className="mr-2 size-4" />
                    <span>{item.label}</span>
                  </DropdownMenuItem>
                )
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button>
            <Link href={"/login"}>Login</Link>
          </Button>
        )}
      </div>
    </nav>
  )
}
