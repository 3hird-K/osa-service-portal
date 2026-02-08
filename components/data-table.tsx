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
  IconBook, 
  IconUser, 
  IconCalendar, 
  IconTag
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

// --- Supabase Hooks ---
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
import { Avatar, AvatarImage } from "./ui/avatar"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"

// --- Schema ---
export const schema = z.object({
  id: z.number(),
  title: z.string(),
  author: z.string(),
  genre: z.string(),
  image: z.string(),
  created_at: z.string(),
  profile: z.string(),
})

type DataRow = z.infer<typeof schema>

function DragHandle({ id }: { id: number }) {
  const { attributes, listeners } = useSortable({ id })
  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="text-muted-foreground size-7 hover:bg-transparent"
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

export function DataTable({ data: initialData }: { data: DataRow[] }) {
  const [data, setData] = React.useState(() => initialData)
  
  React.useEffect(() => {
    setData(initialData)
  }, [initialData])

  const { mutate: deleteBook, isPending: isDeleting } = useDeleteBook()
  const { mutate: updateBook, isPending: isUpdating } = useUpdateBook()

  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = React.useState("")

  const [selectedRow, setSelectedRow] = React.useState<DataRow | null>(null)
  const [isViewOpen, setIsViewOpen] = React.useState(false)
  const [isEditOpen, setIsEditOpen] = React.useState(false)
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = React.useState(false)

  const confirmDelete = () => {
    if (selectedRow) {
      deleteBook(selectedRow.id.toString(), {
        onSuccess: () => {
          setIsDeleteAlertOpen(false)
          setSelectedRow(null)
        },
      })
    }
  }

  const handleEditSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    if (selectedRow) {
      updateBook({
        bookId: selectedRow.id,
        updates: {
          title: formData.get("title") as string,
          author: formData.get("author") as string,
          genre: formData.get("genre") as string,
        }
      }, {
        onSuccess: () => {
          setIsEditOpen(false)
          setSelectedRow(null)
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
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
        />
      ),
    },
    { accessorKey: "title", header: "Title" },
    { accessorKey: "author", header: "Author" },
    {
      accessorKey: "genre",
      header: "Genre",
      cell: ({ row }) => <Badge variant="outline">{row.original.genre}</Badge>,
    },
    {
      accessorKey: "created_at",
      header: "CreatedAt",
      cell: ({ row }) => (
        <p className="text-sm text-muted-foreground">
          {format(new Date(row.original.created_at), "MMM dd, yyyy")}
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
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-destructive" 
              onClick={() => { setSelectedRow(row.original); setIsDeleteAlertOpen(true); }}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ], [])

  const table = useReactTable({
    data,
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

  const dataIds = React.useMemo(() => data.map((d) => d.id), [data])
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor), useSensor(KeyboardSensor))

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (active && over && active.id !== over.id) {
      setData((prev) => {
        const oldIndex = dataIds.indexOf(active.id as number)
        const newIndex = dataIds.indexOf(over.id as number)
        return arrayMove(prev, oldIndex, newIndex)
      })
    }
  }

  return (
      <div className="w-full space-y-4 py-6">
      {/* --- PAGE TITLE SECTION --- */}
      {/* <div className="px-6 space-y-0.5">
        <div className="flex items-center gap-2">
          <h2 className="text-3xl font-bold tracking-tight">Books</h2>
        </div>
        <p className="text-muted-foreground text-sm">
          Manage your library collection, track authors, and organize genres.
        </p>
      </div> */}

      <Tabs defaultValue="outline" className="w-full">
        <div className="flex flex-col sm:flex-row items-center justify-between py-4 px-6 gap-4">
          <div className="relative w-full sm:w-80">
            <IconSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search for..."
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="pl-9"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="w-full sm:w-auto">
                <IconLayoutColumns className="mr-2 size-4" /> Columns <IconChevronDown className="ml-2 size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table.getAllColumns().filter(c => c.getCanHide()).map(column => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(v) => column.toggleVisibility(!!v)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <TabsContent value="outline" className="px-6 space-y-4">
          <div className="rounded-md border">
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
                  {table.getRowModel().rows.map(row => (
                    <DraggableRow key={row.id} row={row} />
                  ))}
                </TableBody>
              </Table>
            </DndContext>
          </div>

          {/* RESTORED PAGINATION UI */}
          <div className="flex items-center justify-between px-2">
            <div className="flex-1 text-sm text-muted-foreground">
              {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
            <div className="flex items-center space-x-6 lg:space-x-8">
              <div className="flex items-center space-x-2">
                <p className="text-sm font-medium">Rows per page</p>
                <Select
                  value={`${table.getState().pagination.pageSize}`}
                  onValueChange={(value) => table.setPageSize(Number(value))}
                >
                  <SelectTrigger className="h-8 w-[70px]">
                    <SelectValue placeholder={table.getState().pagination.pageSize} />
                  </SelectTrigger>
                  <SelectContent side="top">
                    {[10, 20, 30, 40, 50].map((pageSize) => (
                      <SelectItem key={pageSize} value={`${pageSize}`}>
                        {pageSize}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                Page {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount()}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  className="hidden h-8 w-8 p-0 lg:flex"
                  onClick={() => table.setPageIndex(0)}
                  disabled={!table.getCanPreviousPage()}
                >
                  <IconChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  <IconChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  <IconChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="hidden h-8 w-8 p-0 lg:flex"
                  onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                  disabled={!table.getCanNextPage()}
                >
                  <IconChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* VIEW MODAL (MODERN) */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden border-none shadow-2xl">
          <div className="flex flex-col md:flex-row h-full max-h-[90vh]">
            <div className="relative w-full md:w-2/5 bg-muted flex items-center justify-center p-6 border-r border-border/50">
              <div className="relative aspect-[3/4] w-full shadow-2xl rounded-lg overflow-hidden">
                <Avatar className="h-full w-full rounded-none">
                  <AvatarImage src={selectedRow?.image} className="object-cover" />
                  <div className="flex h-full w-full items-center justify-center bg-accent text-accent-foreground">
                    <IconBook size={48} stroke={1} />
                  </div>
                </Avatar>
              </div>
            </div>
            <div className="flex-1 flex flex-col">
              <DialogHeader className="p-6 pb-2">
                <DialogTitle className="text-2xl font-bold tracking-tight">Book Details</DialogTitle>
                <DialogDescription>Detailed overview of the library record.</DialogDescription>
              </DialogHeader>
              <ScrollArea className="flex-1 p-6 pt-2">
                <div className="grid gap-6">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <IconBook size={14} /><span className="text-[10px] font-bold uppercase tracking-widest">Title</span>
                    </div>
                    <p className="text-lg font-semibold leading-tight">{selectedRow?.title}</p>
                  </div>
                  <Separator className="opacity-50" />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <IconUser size={14} /><span className="text-[10px] font-bold uppercase tracking-widest">Author</span>
                      </div>
                      <p className="text-sm font-medium">{selectedRow?.author}</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <IconTag size={14} /><span className="text-[10px] font-bold uppercase tracking-widest">Genre</span>
                      </div>
                      <Badge variant="secondary">{selectedRow?.genre}</Badge>
                    </div>
                  </div>
                  <Separator className="opacity-50" />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <IconCalendar size={14} /><span className="text-[10px] font-bold uppercase tracking-widest">Date Added</span>
                    </div>
                    <p className="text-sm">{selectedRow?.created_at ? format(new Date(selectedRow.created_at), "PPPP") : "N/A"}</p>
                  </div>
                  <div className="pt-4 flex justify-end">
                    <Button variant="outline" size="sm" onClick={() => setIsViewOpen(false)}>Close</Button>
                  </div>
                </div>
              </ScrollArea>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* EDIT MODAL */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <form onSubmit={handleEditSubmit}>
            <DialogHeader>
              <DialogTitle>Edit Record</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" defaultValue={selectedRow?.title} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="author">Author</Label>
                <Input id="author" name="author" defaultValue={selectedRow?.author} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="genre">Genre</Label>
                <Input id="genre" name="genre" defaultValue={selectedRow?.genre} />
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
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete <strong>{selectedRow?.title}</strong> from Supabase.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete} 
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}