"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  Home,
  Wrench,
  User,
  Settings,
  BarChart3,
  LogOut,
  Calendar,
  Briefcase,
  Users,
  LayoutDashboard,
  UserCog,
} from "lucide-react"
import { useState } from "react"
import Image from "next/image"
import { IDashBoardSidebarProps, IUser } from "@/lib/types/types"

export function DashBoardSidebar({ user }: IDashBoardSidebarProps) {
  const pathname = usePathname()
  const userRole = user?.data?.role

  const MAIN_MENU_ITEMS = [
    {
      title: "Home",
      icon: Home,
      href: "/",
      show: true,
    },
    {
      title: "Services",
      icon: Wrench,
      href: "/services",
      show: true,
    },
    {
      title: "Technicians",
      icon: Users,
      href: "/technicians",
      show: true,
    },
    {
      title: "My Profile",
      icon: User,
      href: "/profile",
      show: true,
    },
    {
      title: "Technician Profile",
      icon: UserCog,
      href: `/dashboard/technician/profile/${user.data.id}`,
      show: userRole === "TECHNICIAN",
    },
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href:
        userRole === "ADMIN"
          ? "/dashboard/admin"
          : userRole === "TECHNICIAN"
            ? "/dashboard/technician"
            : "/dashboard/customer",
      show: true,
    },
    {
      title: "Bookings",
      icon: Calendar,
      href:
        userRole === "ADMIN"
          ? "/dashboard/admin/bookings"
          : userRole === "TECHNICIAN"
            ? `/dashboard/technician/bookings/${user.data.id}`
            : "/dashboard/customer/bookings",
      show: true,
    },
  ]

  const SETTINGS_ITEMS = [
    {
      title: "Settings",
      icon: Settings,
      href: "/settings",
    },
    {
      title: "Logout",
      icon: LogOut,
      href: "/logout",
    },
  ]

  const isActive = (href: string) => {
    if (pathname === href) return true
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-border">
        <Link
          href="/"
          className="text-lg font-bold text-foreground transition-opacity hover:opacity-80"
        >
          <Image
            height={100}
            width={100}
            unoptimized
            className="mx-auto rounded-full"
            src={
              user.data.profileImage ||
              "https://i.ibb.co.com/4RbwjM0G/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-fema.jpg"
            }
            alt="Profile-image"
          />
          <h3 className="text-center">{user.data.name}</h3>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {/* Main Menu Items */}
          {MAIN_MENU_ITEMS.map((item) => {
            // Skip if show is false
            if (!item.show) return null

            const Icon = item.icon
            const isItemActive = isActive(item.href)

            return (
              <SidebarMenuItem key={item.title}>
                <Link href={item.href}>
                  <SidebarMenuButton
                    isActive={isItemActive}
                    className={isItemActive ? "text-md bg-accent" : ""}
                  >
                    <Icon className="size-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>

        {/* Divider */}
        <div className="my-2 border-t border-border" />

        {/* Settings Menu Items */}
        <SidebarMenu>
          {SETTINGS_ITEMS.map((item) => {
            const Icon = item.icon
            const isItemActive = isActive(item.href)

            return (
              <SidebarMenuItem key={item.title}>
                <Link href={item.href}>
                  <SidebarMenuButton
                    isActive={isItemActive}
                    className={isItemActive ? "bg-accent" : ""}
                  >
                    <Icon className="size-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t border-border">
        <p className="py-2 text-center text-xs text-muted-foreground">
          © 2026 FixItNow. All rights reserved.
        </p>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
