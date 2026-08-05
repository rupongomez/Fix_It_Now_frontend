import { Geist, Geist_Mono, Inter } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import { Toaster } from "sonner"
import { Navbar } from "@/components/shared/Navbar"
import { getMe } from "@/service/getMe"
import { Metadata } from "next"
import { Footer } from "@/components/shared/Footer"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })
export const metadata: Metadata = {
  title: "FixItNow",
  description: "Your trusted home service platform",
}
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
        {/* <ThemeProvider> */}
        <Navbar user={user} />

        <Toaster position="top-right" richColors />
        <div className="min-h-screen">{children}</div>

        <Footer />
        {/* </ThemeProvider> */}
      </body>
    </html>
  )
}
