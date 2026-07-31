import { SearchBar } from "../_components/SearchBar"
import ServiceGrid from "../_components/ServiceGrid"

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-background to-muted/20">
      {/* Header */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between">
          <div className="mb-8">
            <h1 className="mb-2 text-4xl font-bold text-foreground">
              Our Services
            </h1>
            <p className="text-lg text-muted-foreground">
              Browse our comprehensive range of professional services
            </p>
          </div>
          <SearchBar />
        </div>
        {/* Service Grid */}
        <ServiceGrid />
      </div>
    </div>
  )
}
