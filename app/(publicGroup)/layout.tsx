import { Navbar } from "@/components/shared/Navbar"
import { Toaster } from "@/components/ui/toast"

const PublicGroupLayout = async ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <div>
      <Navbar />
      <Toaster />
      {children}
    </div>
  )
}

export default PublicGroupLayout
