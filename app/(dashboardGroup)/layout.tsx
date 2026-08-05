import { Geist, Geist_Mono, Inter } from "next/font/google"

import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import { Toaster } from "sonner"
import { Navbar } from "@/components/shared/Navbar"
import { getMe } from "@/service/getMe"
import { SidebarProvider } from "@/components/ui/sidebar"
import { DashBoardSidebar } from "./_components/DashboardSideBar"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const user = await getMe()

  return (
    <div>
      <SidebarProvider>
        <div className="flex min-h-screen flex-col">
          <div className="flex flex-1">
            <DashBoardSidebar user={user} />
            <main className="flex-1 xl:pl-20 2xl:pl-60">{children}</main>
          </div>
        </div>
      </SidebarProvider>
    </div>
  )
}
