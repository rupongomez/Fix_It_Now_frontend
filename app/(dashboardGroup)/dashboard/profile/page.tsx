import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { getMe } from "@/service/getMe"
import { Mail, MapPin, Phone, Calendar, Shield, Edit2 } from "lucide-react"
import Link from "next/link"

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

const getRoleColor = (role: string) => {
  switch (role) {
    case "CUSTOMER":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
    case "TECHNICIAN":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "ACTIVE":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    case "INACTIVE":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
  }
}

export default async function ProfilePage() {
  const user = await getMe()
  const userData = user.data
  return (
    <div className="min-h-screen bg-linear-to-b from-background to-muted/10">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        {/* Profile Header Card */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardContent className="pt-8">
            <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
              {/* Avatar */}
              <Avatar className="h-24 w-24 border-4 border-primary/20">
                <AvatarImage src={userData.profileImage} alt={userData.name} />
                <AvatarFallback className="bg-primary/10 text-lg font-semibold">
                  {userData.name}
                </AvatarFallback>
              </Avatar>

              {/* Profile Info */}
              <div className="flex-1">
                <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h1 className="mb-2 text-3xl font-bold text-foreground">
                      {userData.name}
                    </h1>
                    <p className="text-muted-foreground">{userData.email}</p>
                  </div>
                  <Button variant="outline" className="w-full gap-2 sm:w-auto">
                    <Edit2 className="size-4" />
                    Edit Profile
                  </Button>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2">
                  <Badge className={getRoleColor(userData.role)}>
                    <Shield className="mr-1 size-3" />
                    {userData.role}
                  </Badge>
                  <Badge className={getStatusColor(userData.status)}>
                    {userData.status}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Information Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Contact Information</CardTitle>
              <CardDescription>Your contact details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Email */}
              <div className="flex items-start gap-4">
                <Mail className="mt-0.5 size-5 shrink-0 text-primary" />
                <div className="min-w-0">
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="break-all text-foreground">{userData.email}</p>
                </div>
              </div>

              <Separator />

              {/* Phone */}
              <div className="flex items-start gap-4">
                <Phone className="mt-0.5 size-5 shrink-0 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="text-foreground">{userData.phone}</p>
                </div>
              </div>

              <Separator />

              {/* Location */}
              <div className="flex items-start gap-4">
                <MapPin className="mt-0.5 size-5 shrink-0 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="text-foreground">{userData.location}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Account Details</CardTitle>
              <CardDescription>Your account information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Account ID */}
              <div>
                <p className="mb-1 text-sm text-muted-foreground">Account ID</p>
                <p className="rounded-md bg-muted px-3 py-2 font-mono text-sm break-all text-foreground">
                  {userData.id}
                </p>
              </div>

              <Separator />

              {/* Member Since */}
              <div className="flex items-start gap-4">
                <Calendar className="mt-0.5 size-5 shrink-0 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Member Since</p>
                  <p className="text-foreground">
                    {formatDate(userData.createdAt)}
                  </p>
                </div>
              </div>

              <Separator />

              {/* Last Updated */}
              <div className="flex items-start gap-4">
                <Calendar className="mt-0.5 size-5 shrink-0 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Last Updated</p>
                  <p className="text-foreground">
                    {formatDate(userData.updatedAt)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Cards */}
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Account Settings */}
          <Card className="cursor-pointer transition-shadow hover:shadow-md">
            <CardHeader>
              <CardTitle className="text-lg">Account Settings</CardTitle>
              <CardDescription>Manage your account preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Go to Settings
              </Button>
            </CardContent>
          </Card>

          {/* Billing & Payments */}
          <Card className="cursor-pointer transition-shadow hover:shadow-md">
            <CardHeader>
              <CardTitle className="text-lg">Billing & Payments</CardTitle>
              <CardDescription>View your Payment History</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href={"/payment"}>
                <Button variant="outline" className="w-full">
                  View History
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Danger Zone */}
        <Card className="mt-6 border-red-200 dark:border-red-900/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-red-600 dark:text-red-400">
              Danger Zone
            </CardTitle>
            <CardDescription>Irreversible actions</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="destructive" className="w-full sm:w-auto">
              Delete Account
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
