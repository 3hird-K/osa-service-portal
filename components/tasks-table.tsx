"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { useRouter } from "next/navigation"
import {
  IconDotsVertical,
  IconSearch,
  IconPlus,
  IconClipboardList,
  IconEdit,
  IconTrash,
  IconQrcode,
  IconLayoutColumns,
  IconChevronDown,
  IconDownload,
  IconExternalLink,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconX,
  IconMapPin,
  IconClock,
  IconAlertCircle,
} from "@tabler/icons-react"
import { QRCodeCanvas } from "qrcode.react"
import { toast } from "sonner"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useUsers } from "@/hooks/use-users"
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask, type Task } from "@/hooks/use-tasks"
import { IconCheck, IconSelector } from "@tabler/icons-react"


export function TasksTable() {
  const router = useRouter()
  const { data: tasks = [], isLoading: isTasksLoading, error, refetch } = useTasks()
  const createTask = useCreateTask()
  const updateTask = useUpdateTask()
  const deleteTask = useDeleteTask()

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [globalFilter, setGlobalFilter] = React.useState("")

  const [isAddOpen, setIsAddOpen] = React.useState(false)
  const [isEditOpen, setIsEditOpen] = React.useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false)
  const [isQROpen, setIsQROpen] = React.useState(false)
  const [selectedTask, setSelectedTask] = React.useState<Task | null>(null)
  const { data: users = [], isLoading, isError } = useUsers()
  React.useEffect(() => {
    console.log("TasksTable - Users state:", { users, isLoading, isError })
  }, [users, isLoading, isError])
  const [assigneeSearch, setAssigneeSearch] = React.useState("")
  const [isAssigneePopoverOpen, setIsAssigneePopoverOpen] = React.useState(false)
  const [selectedAssigneeId, setSelectedAssigneeId] = React.useState<string | null>(null)

  const filteredStudents = users.filter((user) => {
    if (user.account_type !== "student") return false
    const search = assigneeSearch.toLowerCase()
    const firstName = user.firstname ?? ""
    const lastName = user.lastname ?? ""
    const fullName = `${firstName} ${lastName}`.toLowerCase()
    const email = user.email?.toLowerCase() ?? ""

    return (
      fullName.includes(search) ||
      email.includes(search) ||
      user.id.toLowerCase().includes(search)
    )
  })

  const columns: ColumnDef<Task>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => <div className="font-mono text-[11px] font-bold text-muted-foreground">{row.getValue("id")}</div>,
    },
    {
      accessorKey: "title",
      header: "Task Title",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-semibold text-foreground">{row.getValue("title")}</span>
          <span className="text-xs text-muted-foreground line-clamp-1">{row.original.description}</span>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        return (
          <Badge variant={
            status === "Completed" ? "default" :
              status === "In Progress" ? "secondary" :
                status === "Maintenance" ? "destructive" : "outline"
          } className="font-bold text-[10px] uppercase tracking-wider">
            {status}
          </Badge>
        )
      },
    },
    {
      accessorKey: "assigned_to",
      header: "Assigned To",
      cell: ({ row }) => {
        const assignee = row.original.assignee
        if (!assignee) return <div className="text-muted-foreground">-</div>
        const name = `${assignee.firstname ?? ""} ${assignee.lastname ?? ""}`.trim()
        return (
          <div className="flex flex-col">
            <span className="font-medium">{name || "Unknown"}</span>
            <span className="text-[10px] text-muted-foreground">{assignee.email}</span>
          </div>
        )
      },
    },
    {
      accessorKey: "location",
      header: "Location",
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
          <IconMapPin className="h-3.5 w-3.5" />
          <span>{row.getValue("location") || "-"}</span>
        </div>
      ),
    },
    {
      accessorKey: "hours",
      header: "Hours",
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
          <IconClock className="h-3.5 w-3.5" />
          <span>{row.getValue("hours") ? `${row.getValue("hours")}h` : "-"}</span>
        </div>
      ),
    },
    {
      accessorKey: "created_at",
      header: "Created",
      cell: ({ row }) => {
        const date = new Date(row.getValue("created_at"))
        return <div className="text-muted-foreground text-sm">{date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}</div>
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <IconDotsVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[160px]">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => { setSelectedTask(row.original); setIsEditOpen(true); }}>
              <IconEdit className="mr-2 h-4 w-4" /> Edit Record
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => { setSelectedTask(row.original); setIsQROpen(true); }}>
              <IconQrcode className="mr-2 h-4 w-4" /> View QR Code
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push(`/protected/manage-logs?taskId=${row.original.id}`)}>
              <IconClipboardList className="mr-2 h-4 w-4" /> View Logs
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => { setSelectedTask(row.original); setIsDeleteOpen(true); }} className="text-destructive">
              <IconTrash className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  const table = useReactTable({
    data: tasks,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
  })

  const downloadQRCode = () => {
    const canvas = document.getElementById("task-qr-code") as HTMLCanvasElement
    if (canvas) {
      const pngUrl = canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream")
      const downloadLink = document.createElement("a")
      downloadLink.href = pngUrl
      downloadLink.download = `task-${selectedTask?.id}.png`
      document.body.appendChild(downloadLink)
      downloadLink.click()
      document.body.removeChild(downloadLink)
      toast.success("QR Code downloaded")
    }
  }

  return (
    <div className="w-full space-y-4">
      {/* Filters and Tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Tabs
            defaultValue="active"
            className="w-full sm:w-auto"
            onValueChange={(value) => {
              if (value === "active") table.getColumn("status")?.setFilterValue(undefined)
              else if (value === "progress") table.getColumn("status")?.setFilterValue("In Progress")
              else if (value === "completed") table.getColumn("status")?.setFilterValue("Completed")
            }}
          >
            <TabsList className="bg-muted/50 p-1 h-10 rounded-xl">
              <TabsTrigger value="active" className="text-xs font-bold px-4 h-full cursor-pointer rounded-lg">All Task</TabsTrigger>
              <TabsTrigger value="progress" className="text-xs font-bold px-4 h-full gap-2 cursor-pointer rounded-lg">
                In Progress
                {tasks.filter(t => t.status === "In Progress").length > 0 && (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] text-destructive-foreground">
                    {tasks.filter(t => t.status === "In Progress").length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="completed" className="text-xs font-bold px-4 h-full cursor-pointer rounded-lg">Completed</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="relative w-full sm:w-72">
            <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search all columns..."
              value={globalFilter ?? ""}
              onChange={(event) => setGlobalFilter(event.target.value)}
              className="pl-9 h-10 bg-muted/20 border-border/50"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <Button onClick={() => setIsAddOpen(true)} className="gap-2 cursor-pointer">
            <IconPlus className="h-4 w-4" /> Create Task
          </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 cursor-pointer">
                  <IconLayoutColumns className="h-4 w-4" /> Columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    )
                  })}
              </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Table Content */}
      <div className="rounded-2xl border border-border/50 bg-card overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-muted/30">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent border-border/50">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-muted-foreground font-bold text-[11px] uppercase tracking-wider py-4">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {error ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-48 text-center text-destructive">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="p-3 bg-destructive/10 rounded-full">
                      <IconAlertCircle className="h-6 w-6 text-destructive" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-bold uppercase tracking-widest">Connection Error</p>
                      <p className="text-xs opacity-80 font-medium max-w-[250px] mx-auto">
                        Failed to reach the task service engine. Please ensure your backend is running.
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => refetch()} 
                      className="mt-2 h-9 text-[10px] font-bold uppercase border-destructive/20 hover:bg-destructive/10 text-destructive cursor-pointer px-6 rounded-full"
                    >
                      Retry Connection
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : isTasksLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-32 text-center text-muted-foreground">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    <p className="text-sm font-medium">Loading tasks..</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-muted/20 border-border/50 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-4">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination UI */}
      <div className="flex items-center justify-between px-2 py-4 border-t border-border/10">
        <div className="flex-1 text-xs text-muted-foreground font-medium">
          Showing {table.getFilteredRowModel().rows.length} records
        </div>
        <div className="flex items-center gap-6 lg:gap-8">
          <div className="flex items-center gap-2">
            <p className="text-xs font-bold text-muted-foreground">Rows per page</p>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value))
              }}
            >
              <SelectTrigger className="h-8 w-[70px] bg-transparent border-none font-bold text-xs">
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
          <div className="flex w-[100px] items-center justify-center text-xs font-bold text-muted-foreground uppercase tracking-widest">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              className="h-8 w-8 p-0 border-border/50"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <IconChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0 border-border/50"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <IconChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* QR Code Dialog */}
      <Dialog open={isQROpen} onOpenChange={setIsQROpen}>
        <DialogContent showCloseButton={false} className="sm:max-w-[400px] p-0 overflow-hidden bg-card border-none shadow-2xl">
          <div className="flex flex-col items-center p-8 space-y-6">
            <div className="flex w-full justify-between items-center">
              <DialogTitle className="text-xl font-bold tracking-tight">Item QR Code</DialogTitle>
              <DialogDescription className="sr-only">Scan this QR code to view task details.</DialogDescription>
              <Button variant="ghost" size="icon" onClick={() => setIsQROpen(false)} className="rounded-full">
                <IconX className="h-5 w-5" />
              </Button>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-inner border border-border/10">
              <QRCodeCanvas
                id="task-qr-code"
                value={JSON.stringify({
                  id: selectedTask?.id,
                  title: selectedTask?.title,
                  description: selectedTask?.description,
                  location: selectedTask?.location,
                  hours: selectedTask?.hours,
                  status: selectedTask?.status,
                  assignee_id: selectedTask?.assigned_to || selectedTask?.assignee?.id
                })}
                size={220}
                level="H"
                includeMargin={false}
              />
            </div>

            <div className="text-center space-y-1">
              <p className="text-lg font-bold tracking-tight text-foreground">{selectedTask?.title}</p>
              <p className="text-xs text-muted-foreground uppercase tracking-[0.2em] font-bold">{selectedTask?.id}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 w-full pt-4">
              <Button variant="outline" className="gap-2">
                <IconExternalLink className="h-4 w-4" /> View Page
              </Button>
              <Button onClick={downloadQRCode} className="gap-2">
                <IconDownload className="h-4 w-4" /> Save PNG
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={(open) => {
        setIsEditOpen(open)
        if (open) {
          setSelectedAssigneeId(selectedTask?.assigned_to || null)
        } else {
          setSelectedAssigneeId(null)
          setAssigneeSearch("")
        }
      }}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Edit Task Record</DialogTitle>
            <DialogDescription>Modify the details of this service task.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Task Title</Label>
              <Input id="edit-title" defaultValue={selectedTask?.title} placeholder="e.g. Server Maintenance" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-desc">Description</Label>
              <Textarea id="edit-desc" defaultValue={selectedTask?.description} placeholder="Provide a detailed description of the task..." className="min-h-[100px] resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-location">Location</Label>
                <Input id="edit-location" defaultValue={selectedTask?.location} placeholder="e.g. Room 402, Building A" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-hours">Hours Needed</Label>
                <Input id="edit-hours" type="number" defaultValue={selectedTask?.hours} placeholder="e.g. 2" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Assigned To</Label>
              <Popover open={isAssigneePopoverOpen} onOpenChange={setIsAssigneePopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between font-normal"
                  >
                    {selectedAssigneeId ? (
                      users.find(u => u.id === selectedAssigneeId) ?
                        `${users.find(u => u.id === selectedAssigneeId)?.firstname} ${users.find(u => u.id === selectedAssigneeId)?.lastname}` :
                        selectedAssigneeId
                    ) : "Select student..."}
                    <IconSelector className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[450px] p-0" align="start">
                  <div className="flex items-center border-b px-3">
                    <IconSearch className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                    <Input
                      placeholder="Search email, first or last name..."
                      value={assigneeSearch}
                      onChange={(e) => setAssigneeSearch(e.target.value)}
                      className="h-10 border-none focus-visible:ring-0 bg-transparent"
                    />
                  </div>
                  <div className="max-h-[300px] overflow-y-auto p-1">
                    {filteredStudents.length === 0 ? (
                      <div className="py-6 text-center text-sm text-muted-foreground">No student found.</div>
                    ) : (
                      filteredStudents.map((student) => {
                        const fullName = `${student.firstname} ${student.lastname}`
                        return (
                          <div
                            key={student.id}
                            className="flex items-center justify-between rounded-md px-3 py-2 text-sm hover:bg-muted cursor-pointer transition-colors"
                            onClick={() => {
                              setSelectedAssigneeId(student.id)
                              setIsAssigneePopoverOpen(false)
                              setAssigneeSearch("")
                            }}
                          >
                            <div className="flex flex-col">
                              <span className="font-medium text-foreground">{fullName}</span>
                              <span className="text-xs text-muted-foreground">{student.email}</span>
                            </div>
                            {selectedAssigneeId === student.id && (
                              <IconCheck className="h-4 w-4 text-primary" />
                            )}
                          </div>
                        )
                      })
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-col gap-2">
            <Button
              onClick={async () => {
                const title = (document.getElementById("edit-title") as HTMLInputElement).value
                const description = (document.getElementById("edit-desc") as HTMLTextAreaElement).value
                const location = (document.getElementById("edit-location") as HTMLInputElement).value
                const hours = (document.getElementById("edit-hours") as HTMLInputElement).value

                await updateTask.mutateAsync({
                  id: selectedTask!.id,
                  updates: {
                    title,
                    description,
                    location,
                    hours,
                    assigned_to: selectedAssigneeId
                  }
                });
                setIsEditOpen(false);
              }}
              className="w-full"
              disabled={updateTask.isPending}
            >
              {updateTask.isPending ? "Updating..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Alert */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the task record for{" "}
              <span className="font-bold text-foreground">{selectedTask?.title}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                await deleteTask.mutateAsync(selectedTask!.id);
                setIsDeleteOpen(false);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteTask.isPending}
            >
              {deleteTask.isPending ? "Deleting..." : "Delete Record"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Add Dialog */}
      <Dialog open={isAddOpen} onOpenChange={(open) => {
        setIsAddOpen(open)
        if (!open) {
          setSelectedAssigneeId(null)
          setAssigneeSearch("")
        }
      }}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Add New Task</DialogTitle>
            <DialogDescription>Enter the service task details to create a new record.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Task Title</Label>
              <Input id="title" placeholder="e.g. Server Maintenance" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="desc">Description</Label>
              <Textarea id="desc" placeholder="Provide a detailed description of the task..." className="min-h-[100px] resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" placeholder="e.g. Room 402, Building A" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hours">Hours Needed</Label>
                <Input id="hours" type="number" placeholder="e.g. 2" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Assigned To</Label>
              <Popover open={isAssigneePopoverOpen} onOpenChange={setIsAssigneePopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between font-normal"
                  >
                    {selectedAssigneeId ? (
                      users.find(u => u.id === selectedAssigneeId) ?
                        `${users.find(u => u.id === selectedAssigneeId)?.firstname} ${users.find(u => u.id === selectedAssigneeId)?.lastname}` :
                        selectedAssigneeId
                    ) : "Select student..."}
                    <IconSelector className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[450px] p-0" align="start">
                  <div className="flex items-center border-b px-3">
                    <IconSearch className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                    <Input
                      placeholder="Search email, first or last name..."
                      value={assigneeSearch}
                      onChange={(e) => setAssigneeSearch(e.target.value)}
                      className="h-10 border-none focus-visible:ring-0 bg-transparent"
                    />
                  </div>
                  <div className="max-h-[300px] overflow-y-auto p-1">
                    {filteredStudents.length === 0 ? (
                      <div className="py-6 text-center text-sm text-muted-foreground">No student found.</div>
                    ) : (
                      filteredStudents.map((student) => {
                        const fullName = `${student.firstname} ${student.lastname}`
                        return (
                          <div
                            key={student.id}
                            className="flex items-center justify-between rounded-md px-3 py-2 text-sm hover:bg-muted cursor-pointer transition-colors"
                            onClick={() => {
                              setSelectedAssigneeId(student.id)
                              setIsAssigneePopoverOpen(false)
                              setAssigneeSearch("")
                            }}
                          >
                            <div className="flex flex-col">
                              <span className="font-medium text-foreground">{fullName}</span>
                              <span className="text-xs text-muted-foreground">{student.email}</span>
                            </div>
                            {selectedAssigneeId === student.id && (
                              <IconCheck className="h-4 w-4 text-primary" />
                            )}
                          </div>
                        )
                      })
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-col gap-2">
            <Button
              onClick={async () => {
                const title = (document.getElementById("title") as HTMLInputElement).value
                const description = (document.getElementById("desc") as HTMLTextAreaElement).value
                const location = (document.getElementById("location") as HTMLInputElement).value
                const hours = (document.getElementById("hours") as HTMLInputElement).value

                await createTask.mutateAsync({
                  title,
                  description,
                  location,
                  hours,
                  status: "In Progress",
                  assigned_to: selectedAssigneeId
                });
                setIsAddOpen(false);
              }}
              className="w-full"
              disabled={createTask.isPending}
            >
              {createTask.isPending ? "Assigning..." : "Assign Task"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
