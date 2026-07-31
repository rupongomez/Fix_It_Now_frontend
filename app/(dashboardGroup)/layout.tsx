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
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        inter.variable
      )}
    >
      <body>
        <SidebarProvider>
          <div className="flex h-screen flex-col">
            <div className="flex flex-1">
              <DashBoardSidebar user={user} />
              <main className="flex-1 overflow-y-auto xl:pl-20 2xl:pl-64">
                {children}
              </main>
            </div>
          </div>
        </SidebarProvider>
      </body>
    </html>
  )
}
