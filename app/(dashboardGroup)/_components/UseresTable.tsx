"use client"

import { useEffect, useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { UserCheck, UserX, Loader2, Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { toast } from "sonner"
import { getAllUsers, updateUserStatus } from "../_actions/adminActions"

interface User {
  id: string
  name: string
  email: string
  phone: string
  location: string
  role: "ADMIN" | "CUSTOMER" | "TECHNICIAN"
  status: "ACTIVE" | "INACTIVE" | "BANNED"
  profileImage?: string
  createdAt: string
  updatedAt: string
}

const ROLE_BADGE_COLORS = {
  ADMIN:
    "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  CUSTOMER: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  TECHNICIAN:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
}

const STATUS_BADGE_COLORS = {
  ACTIVE:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  INACTIVE:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  BANNED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
}

const ITEMS_PER_PAGE = 3

export function UserTable() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null)

  // Search state
  const [searchInput, setSearchInput] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  // Alert dialog
  const [alertDialogOpen, setAlertDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<{
    id: string
    status: string
    name: string
  } | null>(null)

  // Fetch users when searchTerm or currentPage changes
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true)
        const res = await getAllUsers({
          searchTerms: searchTerm || undefined,
          page: currentPage,
          limit: ITEMS_PER_PAGE,
        })

        if (res.success && res.data) {
          setUsers(res.data.allUsers)
          setTotalItems(res.data.totalUserCount)
        } else {
          toast.error(res.message || "Failed to fetch users")
        }
      } catch (error) {
        console.error("Failed to fetch users:", error)
        toast.error("Something went wrong")
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsers()
  }, [searchTerm, currentPage])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearchTerm(searchInput)
    setCurrentPage(1)
  }

  const clearSearch = () => {
    setSearchInput("")
    setSearchTerm("")
    setCurrentPage(1)
  }

  const openConfirmDialog = (
    userId: string,
    currentStatus: string,
    userName: string
  ) => {
    setSelectedUser({ id: userId, status: currentStatus, name: userName })
    setAlertDialogOpen(true)
  }

  const confirmStatusChange = async () => {
    if (!selectedUser) return
    const { id, status: currentStatus } = selectedUser
    const newStatus = currentStatus === "ACTIVE" ? "BANNED" : "ACTIVE"
    const action = newStatus === "BANNED" ? "ban" : "unban"

    setUpdatingUserId(id)
    // Optimistic update
    setUsers((prev) =>
      prev.map((user) =>
        user.id === id ? { ...user, status: newStatus as User["status"] } : user
      )
    )

    try {
      const response = await updateUserStatus(id, newStatus)
      if (!response.success) {
        throw new Error(response.message || `Failed to ${action} user`)
      }
      toast.success(`User ${action}ned successfully`)
    } catch (error) {
      // Revert
      setUsers((prev) =>
        prev.map((user) =>
          user.id === id
            ? { ...user, status: currentStatus as User["status"] }
            : user
        )
      )
      toast.error(
        error instanceof Error ? error.message : `Failed to ${action} user`
      )
    } finally {
      setUpdatingUserId(null)
      setAlertDialogOpen(false)
      setSelectedUser(null)
    }
  }

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE)
  const pageNumbers = []
  for (let i = 1; i <= totalPages; i++) pageNumbers.push(i)

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-6 w-32" />
              <Skeleton className="mt-1 h-4 w-48" />
            </div>
            <Skeleton className="h-9 w-48" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-base">User Management</CardTitle>
              <CardDescription>
                {totalItems} user{totalItems !== 1 ? "s" : ""} found
              </CardDescription>
            </div>
            <form
              onSubmit={handleSearch}
              className="flex w-full items-center gap-2 sm:w-auto"
            >
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search users..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="h-9 pr-8 pl-9"
                />
                {searchInput && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="size-4" />
                  </button>
                )}
              </div>
              <Button type="submit" size="sm" className="h-9">
                Search
              </Button>
            </form>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead className="hidden sm:table-cell">Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="hidden md:table-cell">Status</TableHead>
                  <TableHead className="hidden lg:table-cell">Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {user.location}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground sm:hidden">
                          {user.email}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <span className="text-sm">{user.email}</span>
                    </TableCell>
                    <TableCell>
                      <Badge className={ROLE_BADGE_COLORS[user.role]}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge className={STATUS_BADGE_COLORS[user.status]}>
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <span className="text-sm text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant={
                          user.status === "ACTIVE" ? "destructive" : "default"
                        }
                        onClick={() =>
                          openConfirmDialog(user.id, user.status, user.name)
                        }
                        disabled={
                          updatingUserId === user.id || user.role === "ADMIN"
                        }
                        className="text-xs sm:text-sm"
                      >
                        {updatingUserId === user.id ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : user.status === "ACTIVE" ? (
                          <UserX className="size-4" />
                        ) : (
                          <UserCheck className="size-4" />
                        )}
                        <span className="ml-1 hidden sm:inline">
                          {user.status === "ACTIVE" ? "Ban" : "Unban"}
                        </span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="mt-4 flex flex-col items-center gap-2">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    if (currentPage > 1) setCurrentPage(currentPage - 1)
                  }}
                  className={
                    currentPage === 1 ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>
              {pageNumbers.map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    isActive={currentPage === page}
                    onClick={(e) => {
                      e.preventDefault()
                      setCurrentPage(page)
                    }}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    if (currentPage < totalPages)
                      setCurrentPage(currentPage + 1)
                  }}
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
          <p className="text-sm text-muted-foreground">
            Showing {users.length} of {totalItems} users
          </p>
        </div>
      )}

      <AlertDialog open={alertDialogOpen} onOpenChange={setAlertDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {selectedUser?.status === "ACTIVE" ? "Ban User" : "Unban User"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to{" "}
              {selectedUser?.status === "ACTIVE" ? "ban" : "unban"}{" "}
              <strong>{selectedUser?.name}</strong>?
              {selectedUser?.status === "ACTIVE" && (
                <span className="mt-2 block text-red-500">
                  This will prevent the user from accessing the platform.
                </span>
              )}
              {selectedUser?.status === "BANNED" && (
                <span className="mt-2 block text-green-500">
                  This will restore the user&apos;s access.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmStatusChange}
              className={
                selectedUser?.status === "ACTIVE"
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-green-600 hover:bg-green-700"
              }
            >
              {selectedUser?.status === "ACTIVE" ? "Ban" : "Unban"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
