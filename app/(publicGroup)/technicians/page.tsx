import { SearchBar } from "../_components/SearchBar"
import TechnicianGrid from "../_components/TechnicianGrid"

export default function TechniciansPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-background to-muted/20">
      {/* Header */}
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-4xl font-bold text-foreground">
              Our Technicians
            </h1>
            <p className="text-lg text-muted-foreground">
              Browse our team of skilled and trusted technicians
            </p>
          </div>
          <SearchBar />
        </div>
        <TechnicianGrid />
      </div>
    </div>
  )
}
