"use client"

import * as React from "react"
import { format } from "date-fns" 
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconDotsVertical,
  IconGripVertical,
  IconLayoutColumns,
  IconLoader2,
  IconSearch,
  IconUser, 
  IconCalendar, 
  IconShieldCheck,
  IconMail
} from "@tabler/icons-react"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type Row,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table"
import { toast } from "sonner"
import { z } from "zod"

// --- Supabase Hooks (Ensure these are updated to handle Profiles, not Books) ---
import { useDeleteBook } from "@/hooks/use-delete-book"
import { useUpdateBook } from "@/hooks/use-update-book"

// --- UI Components ---
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useUpdateUser } from "@/hooks/use-update-user"

// --- Schema ---
export const schema = z.object({
  id: z.string().or(z.number()),
  firstname: z.string(),
  lastname: z.string(),
  avatar_url: z.string().optional().nullable(),
  account_type: z.string(),
  updated_at: z.string(),
})

type DataRow = z.infer<typeof schema>

function DragHandle({ id }: { id: string | number }) {
  const { attributes, listeners } = useSortable({ id })
  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="text-muted-foreground size-7 hover:bg-transparent cursor-grab active:cursor-grabbing"
    >
      <IconGripVertical className="size-3" />
    </Button>
  )
}

function DraggableRow({ row }: { row: Row<DataRow> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id,
  })

  return (
    <TableRow
      ref={setNodeRef}
      data-state={row.getIsSelected() && "selected"}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  )
}

export function DataTable2({ data: initialData = [] }: { data: DataRow[] }) {
  const [data, setData] = React.useState<DataRow[]>(() => Array.isArray(initialData) ? initialData : [])
  
  React.useEffect(() => {
    if (Array.isArray(initialData)) setData(initialData)
  }, [initialData])

  const { mutate: deleteProfile, isPending: isDeleting } = useDeleteBook() // Update to Profile Hook
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateUser() // Update to Profile Hook

  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = React.useState("")

  const [selectedRow, setSelectedRow] = React.useState<DataRow | null>(null)
  const [isViewOpen, setIsViewOpen] = React.useState(false)
  const [isEditOpen, setIsEditOpen] = React.useState(false)
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = React.useState(false)
  
  // Account Type Dropdown State
  const [accountType, setAccountType] = React.useState<string>("")

  // Sync state when editing
  React.useEffect(() => {
    if (selectedRow) {
      setAccountType(selectedRow.account_type)
    }
  }, [selectedRow])

  const confirmDelete = () => {
    if (selectedRow) {
      deleteProfile(selectedRow.id.toString(), {
        onSuccess: () => {
          setIsDeleteAlertOpen(false)
          setSelectedRow(null)
          toast.success("Member removed successfully")
        },
      })
    }
  }

  const handleEditSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    if (selectedRow) {
      updateProfile({
        userId: selectedRow.id as any, // Cast to any if hook still named bookId
        updates: {
          firstname: formData.get("firstname") as string,
          lastname: formData.get("lastname") as string,
          account_type: accountType, // From Select state
        }
      }, {
        onSuccess: () => {
          setIsEditOpen(false)
          setSelectedRow(null)
          toast.success("Profile updated")
        }
      })
    }
  }

  const columns = React.useMemo<ColumnDef<DataRow>[]>(() => [
    {
      id: "drag",
      header: () => null,
      cell: ({ row }) => <DragHandle id={row.original.id} />,
    },
    {
      id: "user",
      header: "Member",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={row.original.avatar_url ?? ""} />
            <AvatarFallback>{row.original.firstname[0]}{row.original.lastname[0]}</AvatarFallback>
          </Avatar>
          <span className="font-medium text-sm leading-none">{row.original.firstname} {row.original.lastname}</span>
        </div>
      )
    },
    {
      accessorKey: "account_type",
      header: "Account Type",
      cell: ({ row }) => (
        <Badge variant={row.original.account_type === "Admin" ? "default" : "secondary"}>
          {row.original.account_type}
        </Badge>
      ),
    },
    {
      accessorKey: "updated_at",
      header: "Last Updated",
      cell: ({ row }) => (
        <p className="text-sm text-muted-foreground">
          {format(new Date(row.original.updated_at), "MMM dd, yyyy")}
        </p>
      )
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8">
              <IconDotsVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => { setSelectedRow(row.original); setIsViewOpen(true); }}>
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => { setSelectedRow(row.original); setIsEditOpen(true); }}>
              Edit Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-destructive" 
              onClick={() => { setSelectedRow(row.original); setIsDeleteAlertOpen(true); }}
            >
              Delete User
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ], [])

  const table = useReactTable({
    data: data || [],
    columns,
    state: { sorting, columnVisibility, rowSelection, columnFilters, globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getRowId: (row) => row.id.toString(),
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  // Fixed safety for dataIds mapping
  const dataIds = React.useMemo(() => (Array.isArray(data) ? data.map((d) => d.id) : []), [data])
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor), useSensor(KeyboardSensor))

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (active && over && active.id !== over.id) {
      setData((prev) => {
        const oldIndex = dataIds.indexOf(active.id as any)
        const newIndex = dataIds.indexOf(over.id as any)
        return arrayMove(prev, oldIndex, newIndex)
      })
    }
  }

  return (
    <div className="w-full space-y-4 py-6">
      <div className="flex flex-col sm:flex-row items-center justify-between py-4 px-6 gap-4">
        <div className="relative w-full sm:w-80">
          <IconSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search members..."
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="rounded-md border mx-6">
        <DndContext
          collisionDetection={closestCenter}
          modifiers={[restrictToVerticalAxis]}
          onDragEnd={handleDragEnd}
          sensors={sensors}
        >
          <Table>
            <TableHeader className="bg-muted/50">
              {table.getHeaderGroups().map(hg => (
                <TableRow key={hg.id}>
                  {hg.headers.map(header => (
                    <TableHead key={header.id}>
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length > 0 ? (
                <SortableContext items={dataIds} strategy={verticalListSortingStrategy}>
                  {table.getRowModel().rows.map(row => (
                    <DraggableRow key={row.id} row={row} />
                  ))}
                </SortableContext>
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                    No members found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </DndContext>
      </div>

      {/* VIEW MODAL */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-md p-0 overflow-hidden">
          <div className="bg-muted/50 p-8 flex flex-col items-center gap-4">
             <Avatar className="h-20 w-20 border-2 border-background">
                <AvatarImage src={selectedRow?.avatar_url ?? ""} />
                <AvatarFallback>{selectedRow?.firstname?.[0]}</AvatarFallback>
             </Avatar>
             <div className="text-center">
                <h3 className="text-xl font-bold">{selectedRow?.firstname} {selectedRow?.lastname}</h3>
                <Badge variant="outline">{selectedRow?.account_type}</Badge>
             </div>
          </div>
          <div className="p-6 space-y-4 text-sm">
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">User ID</span>
              <span className="font-mono">{selectedRow?.id}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Member Since</span>
              <span>{selectedRow?.updated_at ? format(new Date(selectedRow.updated_at), "PPP") : "N/A"}</span>
            </div>
            <Button className="w-full" variant="outline" onClick={() => setIsViewOpen(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* EDIT MODAL - UPDATED WITH SELECT */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleEditSubmit}>
            <DialogHeader>
              <DialogTitle>Edit Member Profile</DialogTitle>
              <DialogDescription>
                Update member credentials and role permissions.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="firstname">First Name</Label>
                <Input id="firstname" name="firstname" defaultValue={selectedRow?.firstname} required />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="lastname">Last Name</Label>
                <Input id="lastname" name="lastname" defaultValue={selectedRow?.lastname} required />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="account_type">Account Type</Label>
                <Select value={accountType} onValueChange={setAccountType}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="User">User</SelectItem>
                    <SelectItem value="Staff">Staff</SelectItem>
                    <SelectItem value="Admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isUpdating}>
                {isUpdating && <IconLoader2 className="animate-spin mr-2 h-4 w-4" />}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DELETE MODAL */}
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Member?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete <strong>{selectedRow?.firstname} {selectedRow?.lastname}</strong>. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}