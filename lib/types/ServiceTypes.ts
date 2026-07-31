export interface IService {
  id: string
  technicianProfileId: string
  categoryId: string
  title: string
  description: string
  price: string
  duration: number
  location: string
  createdAt: string
  updatedAt: string
  technicianProfile: {
    id: string
    userId: string
    bio: string
    experience: number
    hourlyRate: string
    averageRating: number
    completedJobs: number
    location: string
    isAvailable: boolean
    createdAt: string
    updatedAt: string
  }
}
