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
  IconActivity,
  IconUser,
  IconLoader2,
  IconCheck,
  IconSelector,
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
import { useProfile } from "@/hooks/use-profile"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"


export function TasksTable() {
  const router = useRouter()
  const { data: tasks = [], isLoading: isTasksLoading, error, refetch } = useTasks()
  const { data: profile } = useProfile()
  const isAdmin = profile?.account_type?.toLowerCase() === "admin"

  const createTask = useCreateTask()
  const updateTask = useUpdateTask()
  const deleteTask = useDeleteTask()

  const [sorting, setSorting] = React.useState<SortingState>([{ id: 'created_at', desc: true }])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [globalFilter, setGlobalFilter] = React.useState("")

  const [isAddOpen, setIsAddOpen] = React.useState(false)
  const [isEditOpen, setIsEditOpen] = React.useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false)
  const [isQROpen, setIsQROpen] = React.useState(false)
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = React.useState(false)
  const [selectedTask, setSelectedTask] = React.useState<Task | null>(null)
  const { data: users = [], isLoading } = useUsers()

  React.useEffect(() => {
    setColumnVisibility(prev => ({
      ...prev,
      select: isAdmin,
      created_at: false
    }))
  }, [isAdmin])

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

  const stats = React.useMemo(() => ({
    total: tasks.length,
    inProgress: tasks.filter(t => t.status === "In Progress").length,
    completed: tasks.filter(t => t.status === "Completed").length,
  }), [tasks])

  const columns: ColumnDef<Task>[] = [
    {
      accessorKey: "created_at",
      header: "Timestamp",
      enableHiding: true,
    },
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-[2px] border-muted-foreground/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-[2px] border-muted-foreground/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "title",
      header: "Task Definition",
      cell: ({ row }) => (
        <div className="flex flex-col min-w-[200px]">
          <span className="font-bold text-foreground text-sm leading-tight group-hover:text-primary transition-colors cursor-default">
            {row.getValue("title")}
          </span>
          <span className="text-[10px] text-muted-foreground font-medium line-clamp-1 mt-0.5 uppercase tracking-wider">
            {row.original.description || "No description provided"}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Current State",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        const isCompleted = status === "Completed"
        const isInProgress = status === "In Progress"
        
        return (
          <Badge 
            variant="outline" 
            className={`gap-1.5 px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${
              isCompleted ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-sm shadow-emerald-500/5" :
              isInProgress ? "bg-blue-500/10 text-blue-500 border-blue-500/20 shadow-sm shadow-blue-500/5" :
              "bg-muted/50 text-muted-foreground border-border/50"
            }`}
          >
            <div className={`h-1.5 w-1.5 rounded-full ${
              isCompleted ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" :
              isInProgress ? "bg-blue-500 animate-pulse" :
              "bg-muted-foreground"
            }`} />
            {status}
          </Badge>
        )
      },
    },
    {
      id: "assignee",
      header: "Assignee",
      cell: ({ row }) => {
        const assignee = row.original.assignee
        if (!assignee) return (
            <div className="flex items-center gap-2 opacity-40">
                <div className="h-8 w-8 rounded-full bg-muted border border-dashed border-border flex items-center justify-center">
                    <IconUser className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Unassigned</span>
            </div>
        )
        const name = `${assignee.firstname ?? ""} ${assignee.lastname ?? ""}`.trim()
        const initials = `${assignee.firstname?.[0] || ""}${assignee.lastname?.[0] || ""}`
        
        return (
          <div className="flex items-center gap-2.5">
            <Avatar className="h-8 w-8 rounded-full border border-border/50 shadow-sm transition-transform group-hover:scale-105 overflow-hidden">
                <AvatarImage src={assignee.avatar_url || ""} />
                <AvatarFallback className="bg-primary/10 text-primary text-[9px] font-black uppercase">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0">
                <span className="font-bold text-foreground text-xs leading-tight truncate">{name}</span>
                <span className="text-[9px] text-muted-foreground font-medium truncate">{assignee.email}</span>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "location",
      header: "Location",
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-muted-foreground">
          <div className="p-1.5 rounded-lg bg-muted/50 border border-border/30">
            <IconMapPin className="h-3 w-3" />
          </div>
          <span className="text-xs font-bold tracking-tight">{row.getValue("location") || "No Location"}</span>
        </div>
      ),
    },
    {
      accessorKey: "hours",
      header: "Hours",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
            <Badge variant="outline" className="h-7 px-3 rounded-lg border-amber-500/20 bg-amber-500/5 text-amber-500 gap-1.5">
                <IconClock className="h-3 w-3" />
                <span className="text-[10px] font-black">{row.getValue("hours") || "0"}h</span>
            </Badge>
        </div>
      ),
    },
    {
      id: "actions",
      header: "Admin",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 rounded-full hover:bg-muted transition-colors">
              <IconDotsVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[180px] rounded-xl border-border/40 shadow-2xl">
            <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 px-3 py-2">Operations</DropdownMenuLabel>
            {isAdmin && (
              <DropdownMenuItem onClick={() => { setSelectedTask(row.original); setIsEditOpen(true); }} className="rounded-lg m-1 font-bold text-xs gap-2">
                <IconEdit className="h-4 w-4 text-blue-500" /> Edit Record
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={() => { setSelectedTask(row.original); setIsQROpen(true); }} className="rounded-lg m-1 font-bold text-xs gap-2">
              <IconQrcode className="h-4 w-4 text-emerald-500" /> View QR Scan
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push(`/protected/manage-logs?taskId=${row.original.id}`)} className="rounded-lg m-1 font-bold text-xs gap-2">
              <IconClipboardList className="h-4 w-4 text-primary" /> Audit Logs
            </DropdownMenuItem>
            {isAdmin && row.original.status?.toLowerCase() !== "completed" && (
              <>
                <DropdownMenuSeparator className="bg-border/40" />
                <DropdownMenuItem onClick={() => { setSelectedTask(row.original); setIsDeleteOpen(true); }} className="rounded-lg m-1 font-bold text-xs gap-2 text-destructive hover:bg-destructive/10 transition-colors">
                  <IconTrash className="h-4 w-4" /> Delete Task
                </DropdownMenuItem>
              </>
            )}
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
      const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream")
      const downloadLink = document.createElement("a")
      downloadLink.href = pngUrl
      downloadLink.download = `task-qr-${selectedTask?.id}.png`
      document.body.appendChild(downloadLink)
      downloadLink.click()
      document.body.removeChild(downloadLink)
      toast.success("Identity QR downloaded")
    }
  }

  return (
    <div className="w-full space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
              { label: "Total Tasks", value: stats.total, icon: IconClipboardList, color: "text-primary" },
              { label: "In Progress", value: stats.inProgress, icon: IconActivity, color: "text-blue-500" },
              { label: "Completed", value: stats.completed, icon: IconCheck, color: "text-emerald-500" },
          ].map((stat, i) => (
              <div key={i} className="group relative overflow-hidden rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm p-4 transition-all hover:shadow-xl hover:shadow-primary/5">
                  <div className={`absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform ${stat.color}`}>
                      <stat.icon className="h-12 w-12" />
                  </div>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">{stat.label}</p>
                  <p className="text-2xl font-black tracking-tight">{stat.value}</p>
              </div>
          ))}
      </div>

      {/* Control Bar */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
              <Tabs
                  defaultValue="active"
                  className="w-full sm:w-auto"
                  onValueChange={(value) => {
                      if (value === "active") table.getColumn("status")?.setFilterValue(undefined)
                      else if (value === "progress") table.getColumn("status")?.setFilterValue("In Progress")
                      else if (value === "completed") table.getColumn("status")?.setFilterValue("Completed")
                  }}
              >
                  <TabsList className="bg-card/50 border border-border/40 p-1 h-11 rounded-xl shadow-sm">
                      <TabsTrigger value="active" className="text-[10px] font-black uppercase tracking-widest px-6 h-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg transition-all">All Tasks</TabsTrigger>
                      <TabsTrigger value="progress" className="text-[10px] font-black uppercase tracking-widest px-6 h-full gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg transition-all">
                          Active
                          {stats.inProgress > 0 && (
                              <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                          )}
                      </TabsTrigger>
                      <TabsTrigger value="completed" className="text-[10px] font-black uppercase tracking-widest px-6 h-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg transition-all">Completed</TabsTrigger>
                  </TabsList>
              </Tabs>

              <div className="relative w-full sm:w-80 group">
                  <IconSearch className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                      placeholder="Filter by title, location, or student..."
                      value={globalFilter ?? ""}
                      onChange={(event) => setGlobalFilter(event.target.value)}
                      className="pl-11 h-11 bg-card border-border/40 rounded-xl text-sm font-semibold shadow-sm focus-visible:ring-primary/20 focus-visible:border-primary/50 transition-all"
                  />
              </div>
          </div>

          <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
              {isAdmin && table.getFilteredSelectedRowModel().rows.length > 0 && (
                  <Button 
                    variant="destructive"
                    onClick={() => setIsBulkDeleteOpen(true)}
                    className="h-11 px-6 rounded-xl bg-destructive text-white font-black uppercase text-[10px] tracking-widest shadow-lg shadow-destructive/20 hover:scale-[1.02] active:scale-[0.98] transition-all gap-2"
                  >
                      <IconTrash className="h-4 w-4" /> Delete Selected ({table.getFilteredSelectedRowModel().rows.length})
                  </Button>
              )}
              {isAdmin && (
                  <Button 
                    onClick={() => setIsAddOpen(true)} 
                    className="h-11 px-6 rounded-xl bg-primary text-primary-foreground font-black uppercase text-[10px] tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all gap-2"
                  >
                      <IconPlus className="h-4 w-4" /> Create Task
                  </Button>
              )}
              <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="h-11 px-5 rounded-xl border-border/40 font-black uppercase text-[10px] tracking-widest shadow-sm gap-2 bg-card hover:bg-muted transition-all">
                          <IconLayoutColumns className="h-4 w-4" /> Visibility
                      </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[180px] rounded-xl border-border/40 shadow-2xl">
                      <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 px-3 py-2">Toggle Columns</DropdownMenuLabel>
                      {table.getAllColumns().filter((col) => col.getCanHide()).map((col) => (
                          <DropdownMenuCheckboxItem
                              key={col.id}
                              className="capitalize font-bold text-xs rounded-lg m-1"
                              checked={col.getIsVisible()}
                              onCheckedChange={(val) => col.toggleVisibility(!!val)}
                          >
                              {col.id}
                          </DropdownMenuCheckboxItem>
                      ))}
                  </DropdownMenuContent>
              </DropdownMenu>
          </div>
      </div>

      {/* Main Table Wrapper */}
      <div className="rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm overflow-hidden shadow-2xl shadow-primary/5">
        <div className="overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <Table>
            <TableHeader className="bg-muted/40">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hover:bg-transparent border-border/40">
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/70 py-3 px-6 whitespace-nowrap">
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
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
                              <div className="p-4 bg-destructive/5 rounded-full border border-destructive/10">
                                  <IconAlertCircle className="h-6 w-6 text-destructive" />
                              </div>
                              <p className="text-xs font-black uppercase tracking-widest opacity-60">Critical Link Failed</p>
                              <Button onClick={() => refetch()} className="h-9 px-6 rounded-xl bg-destructive text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-destructive/20">Retry Sync</Button>
                          </div>
                      </TableCell>
                  </TableRow>
              ) : isTasksLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i} className="animate-pulse border-border/20">
                          {columns.map((_, j) => (
                              <TableCell key={j} className="py-4 px-6"><div className="h-4 bg-muted/60 rounded-full w-full" /></TableCell>
                          ))}
                      </TableRow>
                  ))
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="border-border/20 hover:bg-primary/[0.02] transition-colors group"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-3 px-6 transition-all duration-300">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-48 text-center text-muted-foreground font-bold italic opacity-40 uppercase tracking-[0.2em] text-[10px]">
                    No Operational Units Found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination UI */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 py-6">
          <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                  <Select
                      value={`${table.getState().pagination.pageSize}`}
                      onValueChange={(value) => table.setPageSize(Number(value))}
                  >
                      <SelectTrigger className="h-9 w-[110px] bg-card border-border/40 rounded-xl font-bold text-xs shadow-sm focus:ring-primary/20">
                          <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-border/40 shadow-2xl">
                          {[10, 20, 50].map((size) => (
                              <SelectItem key={size} value={`${size}`} className="text-xs font-bold">{size} Units</SelectItem>
                          ))}
                      </SelectContent>
                  </Select>
              </div>
              <div className="h-4 w-px bg-border/50" />
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60">
                  {table.getFilteredRowModel().rows.length} Active Records
              </span>
          </div>

          <div className="flex items-center gap-4">
              <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                  Page {table.getState().pagination.pageIndex + 1} / {table.getPageCount() || 1}
              </div>
              <div className="flex items-center gap-2">
                  <Button
                      variant="outline"
                      className="h-10 w-10 p-0 border-border/40 rounded-xl shadow-sm hover:bg-primary hover:text-white transition-all disabled:opacity-30 active:scale-90"
                      onClick={() => table.previousPage()}
                      disabled={!table.getCanPreviousPage()}
                  >
                      <IconChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                      variant="outline"
                      className="h-10 w-10 p-0 border-border/40 rounded-xl shadow-sm hover:bg-primary hover:text-white transition-all disabled:opacity-30 active:scale-90"
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
        <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden bg-background/95 backdrop-blur-2xl border-border/40 shadow-2xl rounded-2xl">
          <DialogTitle className="sr-only">Task Scan ID</DialogTitle>
          <DialogDescription className="sr-only">Scan this digital identity to track task progress in the mobile app.</DialogDescription>
          
          <div className="flex flex-col items-center p-8 space-y-6 relative">


            <div className="text-center space-y-1 pt-4">
                <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Task QR Code</p>
                <h3 className="text-xl font-black uppercase tracking-tight">{selectedTask?.title}</h3>
            </div>

            <div className="relative group p-6 bg-white rounded-[32px] shadow-2xl shadow-black/5 ring-1 ring-black/5">
              <QRCodeCanvas
                id="task-qr-code"
                value={JSON.stringify({
                  id: selectedTask?.id,
                  title: selectedTask?.title,
                  assignee_id: selectedTask?.assigned_to || selectedTask?.assignee?.id
                })}
                size={220}
                level="H"
                includeMargin={false}
                imageSettings={{
                  src: "/favicon.ico",
                  height: 40,
                  width: 40,
                  excavate: true,
                }}
              />
            </div>

            <div className="flex flex-col items-center gap-1">
                <Badge variant="outline" className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-tight bg-muted/50 border-border/50">
                    ID: {selectedTask?.id}
                </Badge>
                <p className="text-[11px] text-muted-foreground font-medium mt-2">Scan with the mobile app to verify attendance</p>
            </div>

            <div className="w-full grid grid-cols-2 gap-3 pt-2">
              <Button 
                variant="outline"
                onClick={() => window.open(`/track?id=${selectedTask?.id}`, '_blank')} 
                className="h-12 gap-2 text-[10px] font-black uppercase tracking-widest rounded-xl border-border/40 bg-background hover:bg-muted transition-all active:scale-[0.95]"
              >
                <IconExternalLink className="h-4 w-4" /> Tracking
              </Button>
              <Button 
                onClick={downloadQRCode} 
                className="h-12 gap-2 text-[10px] font-black uppercase tracking-widest rounded-xl bg-primary text-white shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.95]"
              >
                <IconDownload className="h-4 w-4" /> Get PNG
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
        <DialogContent className="sm:max-w-[500px] bg-background/95 backdrop-blur-2xl border-border/40 shadow-2xl rounded-2xl p-0 overflow-hidden">
          <DialogTitle className="sr-only">Modify Operational Unit</DialogTitle>
          <DialogDescription className="sr-only">Update task parameters and personnel assignments.</DialogDescription>
          
          <div className="p-8 space-y-6">
            <div className="flex justify-between items-center mb-2">
                <div className="space-y-1">
                    <p className="text-[10px] font-black text-primary uppercase tracking-widest">Edit Task</p>
                    <h3 className="text-2xl font-black uppercase tracking-tight">Task Details</h3>
                </div>
            </div>

            <div className="space-y-5">
                <div className="space-y-2">
                    <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Task Title</Label>
                    <Input id="edit-title" defaultValue={selectedTask?.title} className="h-11 bg-muted/30 border-border/40 rounded-xl font-bold" />
                </div>
                <div className="space-y-2">
                    <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Description</Label>
                    <Textarea id="edit-desc" defaultValue={selectedTask?.description} className="min-h-[100px] bg-muted/30 border-border/40 rounded-xl font-bold resize-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Location</Label>
                        <Input id="edit-location" defaultValue={selectedTask?.location} className="h-11 bg-muted/30 border-border/40 rounded-xl font-bold" />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Required Hours</Label>
                        <Input id="edit-hours" type="number" defaultValue={selectedTask?.hours} className="h-11 bg-muted/30 border-border/40 rounded-xl font-bold" />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Assigned Student</Label>
                    <Popover open={isAssigneePopoverOpen} onOpenChange={setIsAssigneePopoverOpen}>
                        <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full h-11 justify-between bg-muted/30 border-border/40 rounded-xl font-bold text-sm shadow-sm">
                            {selectedAssigneeId ? (
                            users.find(u => u.id === selectedAssigneeId) ?
                                `${users.find(u => u.id === selectedAssigneeId)?.firstname} ${users.find(u => u.id === selectedAssigneeId)?.lastname}` :
                                selectedAssigneeId
                            ) : "Open Personnel Registry..."}
                            <IconSelector className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[450px] p-0 rounded-2xl border-border/40 shadow-2xl overflow-hidden" align="start">
                        <div className="flex items-center border-b border-border/40 px-4 bg-muted/20">
                            <IconSearch className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                            <Input
                                placeholder="Search registry by name or email..."
                                value={assigneeSearch}
                                onChange={(e) => setAssigneeSearch(e.target.value)}
                                className="h-12 border-none focus-visible:ring-0 bg-transparent font-bold text-sm"
                            />
                        </div>
                        <div className="max-h-[300px] overflow-y-auto p-2 bg-background/95 backdrop-blur-xl">
                            {filteredStudents.length === 0 ? (
                                <div className="py-12 text-center text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-40 italic">No Personnel Found</div>
                            ) : (
                                filteredStudents.map((student) => {
                                    const fullName = `${student.firstname} ${student.lastname}`
                                    return (
                                    <div
                                        key={student.id}
                                        className="flex items-center justify-between rounded-xl px-4 py-3 hover:bg-primary/5 cursor-pointer transition-all mb-1 group"
                                        onClick={() => {
                                            setSelectedAssigneeId(student.id)
                                            setIsAssigneePopoverOpen(false)
                                            setAssigneeSearch("")
                                        }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-8 w-8 border border-border/50">
                                                <AvatarImage src={student.avatar_url || ""} />
                                                <AvatarFallback className="bg-muted text-[10px] font-black">{student.firstname?.[0]}{student.lastname?.[0]}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-foreground text-sm group-hover:text-primary transition-colors">{fullName}</span>
                                                <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">{student.email}</span>
                                            </div>
                                        </div>
                                        {selectedAssigneeId === student.id && <IconCheck className="h-4 w-4 text-primary" />}
                                    </div>
                                    )
                                })
                            )}
                        </div>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>

            <div className="pt-2">
                <Button
                    onClick={async () => {
                        const title = (document.getElementById("edit-title") as HTMLInputElement).value
                        const description = (document.getElementById("edit-desc") as HTMLTextAreaElement).value
                        const location = (document.getElementById("edit-location") as HTMLInputElement).value
                        const hours = (document.getElementById("edit-hours") as HTMLInputElement).value

                        await updateTask.mutateAsync({
                            id: selectedTask!.id,
                            updates: { title, description, location, hours, assigned_to: selectedAssigneeId }
                        });
                        setIsEditOpen(false);
                    }}
                    className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-black uppercase text-xs tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                    disabled={updateTask.isPending}
                >
                    {updateTask.isPending ? <IconLoader2 className="h-4 w-4 mr-2 animate-spin" /> : "Save Changes"}
                </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Alert */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent className="rounded-2xl border-border/40 bg-background/95 backdrop-blur-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-black uppercase tracking-tight">Delete Task</AlertDialogTitle>
            <AlertDialogDescription className="text-sm font-medium">
              Are you sure you want to delete <span className="font-bold text-foreground">{selectedTask?.title}</span>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3">
            <AlertDialogCancel className="rounded-xl font-bold border-border/40">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                await deleteTask.mutateAsync(selectedTask!.id);
                setIsDeleteOpen(false);
              }}
              className="bg-destructive text-white rounded-xl font-bold hover:bg-destructive/90 transition-all px-6"
              disabled={deleteTask.isPending}
            >
              {deleteTask.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Delete Alert */}
      <AlertDialog open={isBulkDeleteOpen} onOpenChange={setIsBulkDeleteOpen}>
        <AlertDialogContent className="rounded-2xl border-border/40 bg-background/95 backdrop-blur-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-black uppercase tracking-tight">Delete Multiple Tasks</AlertDialogTitle>
            <AlertDialogDescription className="text-sm font-medium">
              Are you sure you want to delete <span className="font-bold text-foreground">{table.getFilteredSelectedRowModel().rows.length} tasks</span>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3">
            <AlertDialogCancel className="rounded-xl font-bold border-border/40">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                const selectedRows = table.getFilteredSelectedRowModel().rows;
                const deletePromises = selectedRows.map(row => deleteTask.mutateAsync(row.original.id));
                try {
                  await Promise.all(deletePromises);
                  setRowSelection({});
                  setIsBulkDeleteOpen(false);
                  toast.success(`Successfully deleted ${selectedRows.length} tasks`);
                } catch (err) {
                  toast.error("Failed to delete tasks");
                }
              }}
              className="bg-destructive text-white rounded-xl font-bold hover:bg-destructive/90 transition-all px-6"
              disabled={deleteTask.isPending}
            >
              {deleteTask.isPending ? "Deleting..." : "Delete"}
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
        <DialogContent className="sm:max-w-[500px] bg-background/95 backdrop-blur-2xl border-border/40 shadow-2xl rounded-2xl p-0 overflow-hidden">
          <DialogTitle className="sr-only">Initialize New Unit</DialogTitle>
          <DialogDescription className="sr-only">Create a new service task record and assign it to personnel.</DialogDescription>
          
          <div className="p-8 space-y-6">
            <div className="flex justify-between items-center mb-2">
                <div className="space-y-1">
                    <p className="text-[10px] font-black text-primary uppercase tracking-widest">Create Task</p>
                    <h3 className="text-2xl font-black uppercase tracking-tight">New Task</h3>
                </div>
            </div>

            <div className="space-y-5">
                <div className="space-y-2">
                    <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Task Title</Label>
                    <Input id="title" placeholder="e.g. Campus Beautification" className="h-11 bg-muted/30 border-border/40 rounded-xl font-bold placeholder:opacity-30" />
                </div>
                <div className="space-y-2">
                    <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Description</Label>
                    <Textarea id="desc" placeholder="What needs to be done?" className="min-h-[100px] bg-muted/30 border-border/40 rounded-xl font-bold resize-none placeholder:opacity-30" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Location</Label>
                        <Input id="location" placeholder="e.g. Quadrangle" className="h-11 bg-muted/30 border-border/40 rounded-xl font-bold placeholder:opacity-30" />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Required Hours</Label>
                        <Input id="hours" type="number" placeholder="e.g. 5" className="h-11 bg-muted/30 border-border/40 rounded-xl font-bold placeholder:opacity-30" />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Assign Student</Label>
                    <Popover open={isAssigneePopoverOpen} onOpenChange={setIsAssigneePopoverOpen}>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full h-11 justify-between bg-muted/30 border-border/40 rounded-xl font-bold text-sm shadow-sm">
                                {selectedAssigneeId ? (
                                    users.find(u => u.id === selectedAssigneeId) ?
                                        `${users.find(u => u.id === selectedAssigneeId)?.firstname} ${users.find(u => u.id === selectedAssigneeId)?.lastname}` :
                                        selectedAssigneeId
                                ) : "Select student from registry..."}
                                <IconSelector className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[450px] p-0 rounded-2xl border-border/40 shadow-2xl overflow-hidden" align="start">
                            <div className="flex items-center border-b border-border/40 px-4 bg-muted/20">
                                <IconSearch className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                                <Input
                                    placeholder="Search student by name or email..."
                                    value={assigneeSearch}
                                    onChange={(e) => setAssigneeSearch(e.target.value)}
                                    className="h-12 border-none focus-visible:ring-0 bg-transparent font-bold text-sm"
                                />
                            </div>
                            <div className="max-h-[300px] overflow-y-auto p-2 bg-background/95 backdrop-blur-xl">
                                {filteredStudents.length === 0 ? (
                                    <div className="py-12 text-center text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-40 italic">No matches found</div>
                                ) : (
                                    filteredStudents.map((student) => {
                                        const fullName = `${student.firstname} ${student.lastname}`
                                        return (
                                        <div
                                            key={student.id}
                                            className="flex items-center justify-between rounded-xl px-4 py-3 hover:bg-primary/5 cursor-pointer transition-all mb-1 group"
                                            onClick={() => {
                                                setSelectedAssigneeId(student.id)
                                                setIsAssigneePopoverOpen(false)
                                                setAssigneeSearch("")
                                            }}
                                        >
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-8 w-8 border border-border/50">
                                                    <AvatarImage src={student.avatar_url || ""} />
                                                    <AvatarFallback className="bg-muted text-[10px] font-black">{student.firstname?.[0]}{student.lastname?.[0]}</AvatarFallback>
                                                </Avatar>
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-foreground text-sm group-hover:text-primary transition-colors">{fullName}</span>
                                                    <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">{student.email}</span>
                                                </div>
                                            </div>
                                            {selectedAssigneeId === student.id && <IconCheck className="h-4 w-4 text-primary" />}
                                        </div>
                                        )
                                    })
                                )}
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>

            <div className="pt-2">
                <Button
                    onClick={async () => {
                        const title = (document.getElementById("title") as HTMLInputElement).value
                        const description = (document.getElementById("desc") as HTMLTextAreaElement).value
                        const location = (document.getElementById("location") as HTMLInputElement).value
                        const hours = (document.getElementById("hours") as HTMLInputElement).value

                        await createTask.mutateAsync({ 
                            title, description, location, hours, 
                            assigned_to: selectedAssigneeId,
                            status: "In Progress"
                        });
                        setIsAddOpen(false);
                    }}
                    className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-black uppercase text-xs tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                    disabled={createTask.isPending}
                >
                    {createTask.isPending ? <IconLoader2 className="h-4 w-4 mr-2 animate-spin" /> : "Create Task"}
                </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
