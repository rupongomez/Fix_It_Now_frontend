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
import { Home, Wrench, User, Settings, BarChart3, LogOut } from "lucide-react"
import { useState } from "react"
import Image from "next/image"
import { IDashBoardSidebarProps, IUser } from "@/lib/types/types"

export function DashBoardSidebar({ user }: IDashBoardSidebarProps) {
  console.log(user)
  const pathname = usePathname()
  const MAIN_MENU_ITEMS = [
    {
      title: "Home",
      icon: Home,
      href: "/",
    },
    {
      title: "Services",
      icon: Wrench,
      href: "/services",
    },
    {
      title: "Profile",
      icon: User,
      href: "/profile",
    },
    {
      title: "Technician Profile",
      icon: User,
      href: `/dashboard/technician/profile/${user.data.id}`,
    },
    {
      title: "Dashboard",
      icon: BarChart3,
      href: "/dashboard",
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

  const isActive = (href: string) => pathname === href

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
          ></Image>
          <h3 className="text-center">{user.data.name}</h3>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {/* Main Menu Items */}
          {MAIN_MENU_ITEMS.map((item) => {
            const Icon = item.icon
            const isItemActive = isActive(item.href)

            return (
              <SidebarMenuItem
                className={
                  item.title === "Technician Profile" &&
                  user.data.role !== "TECHNICIAN"
                    ? "hidden"
                    : ""
                }
                key={item.title}
              >
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
