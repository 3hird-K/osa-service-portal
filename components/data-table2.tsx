"use client"

import * as React from "react"
import { format } from "date-fns"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table"
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconSearch,
  IconUser,
  IconShieldCheck,
  IconLoader2,
  IconX,
} from "@tabler/icons-react"
import { toast } from "sonner"
import { z } from "zod"
import { useUser } from "@clerk/nextjs"
import { useQueryClient } from "@tanstack/react-query"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
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

export const schema = z.object({
  id: z.string().or(z.number()),
  firstname: z.string().nullable().optional(),
  lastname: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  avatar_url: z.string().optional().nullable(),
  account_type: z.string(),
  updated_at: z.string(),
  is_online: z.boolean().optional(),
})

type DataRow = z.infer<typeof schema>

// ---------- ONLINE DOT ----------
function OnlineDot({ online }: { online?: boolean }) {
  if (!online) return null
  return (
    <span className="absolute bottom-1 right-1 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-background shadow-sm" />
  )
}

// ---------- ROLE BADGE ----------
function RoleBadge({ type }: { type: string }) {
  const normalized = type?.toLowerCase()
  const isAdmin = normalized === "admin"
  return (
    <Badge
      variant="outline"
      className={`gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${isAdmin
        ? "bg-primary/10 text-primary border-primary/30"
        : "bg-muted text-muted-foreground border-border"
        }`}
    >
      {isAdmin ? <IconShieldCheck className="h-3 w-3" /> : <IconUser className="h-3 w-3" />}
      {isAdmin ? "Admin" : "Student"}
    </Badge>
  )
}

// ---------- RIGHT SHEET PANEL ----------
interface UserSheetProps {
  user: DataRow | null
  isAdmin: boolean
  onClose: () => void
  onSaved: () => void
}

function UserSheet({ user, isAdmin, onClose, onSaved }: UserSheetProps) {
  const [firstName, setFirstName] = React.useState(user?.firstname ?? "")
  const [lastName, setLastName] = React.useState(user?.lastname ?? "")
  const [accountType, setAccountType] = React.useState(user?.account_type ?? "student")
  const [isSaving, setIsSaving] = React.useState(false)
  const [showDeleteAlert, setShowDeleteAlert] = React.useState(false)
  const [isDeleting, setIsDeleting] = React.useState(false)

  React.useEffect(() => {
    if (user) {
      setFirstName(user.firstname ?? "")
      setLastName(user.lastname ?? "")
      setAccountType(user.account_type)
    }
  }, [user])

  if (!user) return null

  const displayName = `${user.firstname ?? ""} ${user.lastname ?? ""}`.trim() || "Unknown User"
  const initials = `${user.firstname?.[0] ?? ""}${user.lastname?.[0] ?? ""}`.toUpperCase() || "?"
  const roleDescription =
    accountType === "admin"
      ? "Administrators have full CRUD access. Students can view data but require Admin approval for any changes."
      : "Students can view data, but any edits require Admin approval before going live."

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const res = await fetch("/api/admin/update-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetUserId: user.id,
          firstName,
          lastName,
          account_type: accountType,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Update failed")
      toast.success("Profile updated successfully")
      onSaved()
      onClose()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const res = await fetch("/api/admin/delete-user", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId: user.id }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Delete failed")
      toast.success("User deleted")
      onSaved()
      onClose()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete")
    } finally {
      setIsDeleting(false)
      setShowDeleteAlert(false)
    }
  }

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
      />
      {/* Sheet */}
      <div className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-sm bg-sidebar border-l border-border shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-base font-semibold text-foreground">Edit User Profile</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 hover:bg-muted text-muted-foreground transition-colors"
          >
            <IconX className="h-4 w-4" />
          </button>
        </div>

        {/* Avatar Section */}
        <div className="flex flex-col items-center gap-2 py-6 border-b border-border">
          <div className="relative">
            <Avatar className="h-20 w-20 border-2 border-border">
              <AvatarImage src={user.avatar_url ?? ""} />
              <AvatarFallback className="text-xl bg-muted text-foreground">{initials}</AvatarFallback>
            </Avatar>
            <OnlineDot online={user.is_online} />
          </div>
          <div className="text-center">
            <p className="font-semibold text-foreground">{displayName}</p>
            <p className="text-xs text-muted-foreground">{user.email ?? "No email"}</p>
          </div>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">First Name</Label>
              <Input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                disabled={!isAdmin}
                className="bg-background border-border text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Last Name</Label>
              <Input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                disabled={!isAdmin}
                className="bg-background border-border text-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Account Type (Role)</Label>
            <Select value={accountType} onValueChange={setAccountType} disabled={!isAdmin}>
              <SelectTrigger className="w-full bg-background border-border text-sm">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Administrator (Full Access)</SelectItem>
                <SelectItem value="student">Student</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-lg bg-muted/50 border border-border p-3">
            <p className="text-xs text-muted-foreground leading-relaxed">{roleDescription}</p>
          </div>

          {!isAdmin && (
            <p className="text-xs text-muted-foreground text-center">
              You need admin access to edit profiles.
            </p>
          )}
        </div>

        {/* Footer Buttons */}
        {isAdmin && (
          <div className="px-6 py-4 border-t border-border space-y-2">
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 border-border"
                onClick={onClose}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving && <IconLoader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />}
                Save Changes
              </Button>
            </div>
            <Button
              variant="destructive"
              className="w-full"
              onClick={() => setShowDeleteAlert(true)}
              disabled={isSaving || isDeleting}
            >
              Delete Profile
            </Button>
          </div>
        )}
      </div>

      {/* Delete Confirm */}
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {displayName}?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete their Clerk account and profile data. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting && <IconLoader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />}
              Yes, Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

// ---------- MAIN TABLE ----------
export function DataTable2({
  data: initialData = [],
  onRefresh,
  extraControls
}: {
  data: DataRow[];
  onRefresh?: () => void;
  extraControls?: React.ReactNode;
}) {
  const [data, setData] = React.useState<DataRow[]>(() => (Array.isArray(initialData) ? initialData : []))
  const { user: currentUser } = useUser()
  const queryClient = useQueryClient()

  React.useEffect(() => {
    if (Array.isArray(initialData)) setData(initialData)
  }, [initialData])

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [columnVisibility] = React.useState<VisibilityState>({})
  const [selectedRow, setSelectedRow] = React.useState<DataRow | null>(null)

  // Check if the current viewer is an admin
  const [viewerIsAdmin, setViewerIsAdmin] = React.useState(false)
  React.useEffect(() => {
    if (!currentUser?.id) return
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://server-osa-service.onrender.com"
    fetch(`${apiUrl}/profiles/${currentUser.id}`)
      .then((r) => r.json())
      .then((profile) => {
        setViewerIsAdmin(profile?.account_type?.toLowerCase() === "admin")
      })
      .catch(() => { })
  }, [currentUser?.id])

  const columns = React.useMemo<ColumnDef<DataRow>[]>(() => [
    {
      accessorKey: "id",
      header: "Profile ID",
      cell: ({ row }) => {
        const shortId = String(row.original.id).slice(0, 8).toUpperCase()
        return (
          <div className="flex items-center gap-2">
            {row.original.is_online && (
              <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
            )}
            <button
              onClick={() => setSelectedRow(row.original)}
              className="font-mono text-xs text-primary hover:underline underline-offset-2 cursor-pointer transition-colors"
            >
              {shortId}
            </button>
          </div>
        )
      },
    },
    {
      accessorKey: "firstname",
      header: "First Name",
      cell: ({ row }) => (
        <span className="font-medium text-sm text-foreground">{row.original.firstname ?? "—"}</span>
      ),
    },
    {
      accessorKey: "lastname",
      header: "Last Name",
      cell: ({ row }) => (
        <span className="text-sm text-foreground">{row.original.lastname ?? "—"}</span>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">{row.original.email ?? "—"}</span>
      ),
    },
    {
      accessorKey: "account_type",
      header: "Account Type",
      cell: ({ row }) => <RoleBadge type={row.original.account_type} />,
    },
  ], [])

  const table = useReactTable({
    data: data || [],
    columns,
    state: { sorting, columnVisibility, columnFilters, globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getRowId: (row) => String(row.id),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  })

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["profiles-here"] })
    onRefresh?.()
  }

  return (
    <div className="w-full space-y-4">
      {/* Search */}
      <div className="flex items-center gap-3">
        {extraControls}
        <div className="relative w-full sm:w-60">
          <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-9 bg-card border-border h-10 rounded-lg text-sm"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id} className="border-b border-border hover:bg-transparent">
                {hg.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="text-xs font-semibold text-muted-foreground h-11 bg-muted/30"
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="border-b border-border hover:bg-muted/30 transition-colors cursor-default"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-48 text-center text-muted-foreground">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <IconSearch className="h-8 w-8 opacity-20" />
                    <p>No users found</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between py-2 text-sm text-muted-foreground">
        <span>
          Showing {table.getFilteredRowModel().rows.length} of {data.length} users
        </span>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Rows per page</span>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(v) => table.setPageSize(Number(v))}
            >
              <SelectTrigger className="h-8 w-[70px] bg-card border-border text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 50].map((size) => (
                  <SelectItem key={size} value={`${size}`}>{size}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <span className="text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}
          </span>
          <div className="flex items-center gap-1">
            <Button variant="outline" className="h-8 w-8 p-0 bg-card border-border" onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>
              <IconChevronsLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="h-8 w-8 p-0 bg-card border-border" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
              <IconChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="h-8 w-8 p-0 bg-card border-border" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
              <IconChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="h-8 w-8 p-0 bg-card border-border" onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}>
              <IconChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Right Sheet */}
      {selectedRow && (
        <UserSheet
          user={selectedRow}
          isAdmin={viewerIsAdmin}
          onClose={() => setSelectedRow(null)}
          onSaved={handleRefresh}
        />
      )}
    </div>
  )
}