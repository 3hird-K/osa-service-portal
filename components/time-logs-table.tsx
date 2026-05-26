"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import {
    IconSearch,
    IconChevronLeft,
    IconChevronRight,
    IconPhoto,
    IconClock,
    IconExternalLink,
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { useLogs, type TimeLog } from "@/hooks/use-logs"
import { format } from "date-fns"
import { Badge } from "./ui/badge"
import useEmblaCarousel from 'embla-carousel-react'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function TimeLogsTable() {
    const searchParams = useSearchParams()
    const taskId = searchParams.get("taskId") || undefined
    const { logs, isLoading, error, refetch } = useLogs(taskId)

    const [sorting, setSorting] = React.useState<SortingState>([{ id: 'date', desc: true }])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [globalFilter, setGlobalFilter] = React.useState("")
    const [rowSelection, setRowSelection] = React.useState({})
    const [selectedEvidences, setSelectedEvidences] = React.useState<string[] | null>(null)
    const [activeIndex, setActiveIndex] = React.useState(0)

    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })

    React.useEffect(() => {
        if (emblaApi) {
            emblaApi.on('select', () => {
                setActiveIndex(emblaApi.selectedScrollSnap())
            })
        }
    }, [emblaApi])

    const columns: ColumnDef<TimeLog>[] = [
        {
            accessorKey: "date",
            accessorFn: (row) => {
                const d = row.date ? new Date(row.date) : null
                return d ? format(d, "MMMM dd, yyyy EEEE") : ""
            },
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="hover:bg-transparent -ml-4 font-bold text-[10px] uppercase tracking-widest text-muted-foreground"
                >
                    Date
                    <IconChevronRight className={`ml-1 h-3 w-3 transition-transform ${column.getIsSorted() === "asc" ? "-rotate-90" : "rotate-90"}`} />
                </Button>
            ),
            cell: ({ row }) => {
                const date = row.original.date ? new Date(row.original.date) : null
                return (
                    <div className="flex flex-col">
                        <span className="text-xs font-black text-foreground tabular-nums">
                            {date ? format(date, "MMM dd, yyyy") : "-"}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-medium">
                            {date ? format(date, "EEEE") : ""}
                        </span>
                    </div>
                )
            },
        },
        {
            id: "studentName",
            accessorFn: (row) => row.user ? `${row.user.firstname} ${row.user.lastname} ${row.user.email}` : "Unknown Student",
            header: "Student",
            cell: ({ row }) => {
                const user = row.original.user
                const name = user ? `${user.firstname} ${user.lastname}` : "Unknown Student"
                const initials = user ? `${user.firstname?.[0] || ""}${user.lastname?.[0] || ""}` : "?"
                // Some backends use avatar_url, some use image_url
                const avatarSrc = user?.avatar_url || user?.image_url

                return (
                    <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 rounded-full border border-border/50 shadow-sm transition-transform hover:scale-105 overflow-hidden">
                            <AvatarImage src={avatarSrc} className="object-cover" />
                            <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-black uppercase">{initials}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col min-w-0">
                            <span className="font-bold text-foreground text-sm leading-tight truncate">{name}</span>
                            <span className="text-[10px] text-muted-foreground font-medium truncate">{user?.email || "-"}</span>
                        </div>
                    </div>
                )
            },
        },
        {
            id: "taskTitle",
            accessorFn: (row) => `${row.task?.title || "Direct Entry"} ${row.task?.description || "Manual time log entry"}`,
            header: "Task",
            cell: ({ row }) => (
                <div className="max-w-[200px]">
                    <div className="font-bold text-primary/80 text-xs truncate">
                        {row.original.task?.title || "Direct Entry"}
                    </div>
                    <div className="text-[10px] text-muted-foreground font-medium truncate">
                        {row.original.task?.description || "Manual time log entry"}
                    </div>
                </div>
            ),
        },
        {
            id: "timeline",
            header: "Session Details",
            cell: ({ row }) => (
                <div className="flex items-center gap-3 whitespace-nowrap">
                    <div className="flex flex-col items-center">
                        <span className="text-[10px] font-bold text-foreground">{row.original.start_time || "--:--"}</span>
                        <span className="text-[8px] text-muted-foreground uppercase font-black">Start</span>
                    </div>
                    <div className="h-px w-8 bg-border/50 relative shrink-0">
                        {row.original.break_time && (
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-primary/40" />
                        )}
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-[10px] font-bold text-foreground">{row.original.end_time || "--:--"}</span>
                        <span className="text-[8px] text-muted-foreground uppercase font-black">End</span>
                    </div>
                </div>
            )
        },
        {
            accessorKey: "hours",
            header: "Duration",
            cell: ({ row }) => {
                const hours = parseFloat(row.getValue("hours") || "0")
                return (
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-black text-xs shadow-sm border whitespace-nowrap ${hours > 0 ? 'bg-primary/10 text-primary border-primary/20' : 'bg-muted text-muted-foreground border-border'
                        }`}>
                        <IconClock className="h-3.5 w-3.5" />
                        <span>{hours.toFixed(1)}h</span>
                    </div>
                )
            },
        },
        {
            id: "evidence",
            header: "Verification",
            cell: ({ row }) => {
                const evidenceStr = row.original.evidence_urls
                let urls: string[] = []
                try {
                    if (evidenceStr) urls = JSON.parse(evidenceStr)
                } catch (e) {
                    if (evidenceStr) urls = [evidenceStr]
                }

                return urls && urls.length > 0 ? (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div
                                    className="flex -space-x-3 cursor-pointer group shrink-0"
                                    onClick={() => {
                                        setSelectedEvidences(urls)
                                        setActiveIndex(0)
                                    }}
                                >
                                    {urls.slice(0, 3).map((url, i) => (
                                        <div key={i} className="h-8 w-8 rounded-full border-2 border-background bg-muted overflow-hidden ring-1 ring-border/20 shadow-sm transition-transform group-hover:scale-110">
                                            <img src={url} className="h-full w-full object-cover" alt="" />
                                        </div>
                                    ))}
                                    {urls.length > 3 && (
                                        <div className="h-8 w-8 rounded-full border-2 border-background bg-primary/10 flex items-center justify-center text-[10px] font-black text-primary ring-1 ring-border/20 transition-transform group-hover:scale-110">
                                            +{urls.length - 3}
                                        </div>
                                    )}
                                </div>
                            </TooltipTrigger>
                            <TooltipContent className="rounded-xl font-bold bg-primary text-primary-foreground border-none px-4 py-2 shadow-xl">
                                <p>Click to view evidence ({urls.length})</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                ) : (
                    <Badge variant="outline" className="text-[9px] font-bold uppercase tracking-tighter opacity-40 border-dashed">No Proof</Badge>
                )
            }
        },
    ]

    const table = useReactTable({
        data: logs,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onRowSelectionChange: setRowSelection,
        onGlobalFilterChange: setGlobalFilter,
        state: {
            sorting,
            columnFilters,
            globalFilter,
            rowSelection,
        },
    })

    return (
        <div className="w-full space-y-6 overflow-hidden">
            {/* Table controls */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative w-full md:w-96 group">
                        <div className="absolute inset-0 bg-primary/5 rounded-2xl blur-xl group-focus-within:bg-primary/10 transition-all opacity-0 group-focus-within:opacity-100 pointer-events-none" />
                        <IconSearch className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors pointer-events-none" />
                        <Input
                            placeholder="Search anything..."
                            value={globalFilter ?? ""}
                            onChange={(event) => setGlobalFilter(event.target.value)}
                            className="pl-11 bg-card border-border/40 h-12 rounded-xl text-sm font-semibold shadow-sm focus-visible:ring-primary/20 focus-visible:border-primary/50 transition-all"
                        />
                    </div>
                    {taskId && (
                        <Badge variant="secondary" className="h-12 px-6 rounded-xl bg-primary/10 text-primary border-primary/20 font-black uppercase text-[10px] tracking-widest flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                            Task Context Active
                        </Badge>
                    )}
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
                                    <TableCell colSpan={columns.length} className="h-64 text-center">
                                        <div className="flex flex-col items-center justify-center gap-4 max-w-md mx-auto">
                                            <div className="p-4 rounded-full bg-destructive/5 text-destructive border border-destructive/10 animate-bounce">
                                                <IconClock className="h-8 w-8" />
                                            </div>
                                            <div className="space-y-1">
                                                <h3 className="text-lg font-black tracking-tight text-foreground">Sync Interrupted</h3>
                                                <p className="text-sm text-muted-foreground font-medium">We couldn't establish a secure connection with the log engine. Please try again.</p>
                                            </div>
                                            <Button variant="outline" size="lg" onClick={() => refetch()} className="rounded-2xl px-8 font-black uppercase text-xs tracking-widest border-border hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all shadow-lg">
                                                Reconnect Now
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : isLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <TableRow key={i} className="animate-pulse border-border/20">
                                        {columns.map((_, j) => (
                                            <TableCell key={j} className="py-4 px-6">
                                                <div className="h-4 bg-muted/60 rounded-full w-full" />
                                            </TableCell>
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
                                    <TableCell colSpan={columns.length} className="h-48 text-center text-muted-foreground font-bold italic opacity-40">
                                        No records match your criteria.
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
                        {/* <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Density</span> */}
                        <Select
                            value={`${table.getState().pagination.pageSize}`}
                            onValueChange={(value) => table.setPageSize(Number(value))}
                        >
                            <SelectTrigger className="h-9 w-[110px] bg-card border-border/40 rounded-xl font-bold text-xs shadow-sm">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-border/40 shadow-2xl">
                                {[10, 20, 50].map((size) => (
                                    <SelectItem key={size} value={`${size}`} className="text-xs font-bold">{size} Rows</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="h-4 w-px bg-border/50" />
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                        {table.getFilteredRowModel().rows.length} Total Logs
                    </span>
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                        Page {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            className="h-10 w-10 p-0 border-border/40 rounded-xl shadow-sm hover:bg-primary hover:text-white transition-all disabled:opacity-30"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <IconChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            className="h-10 w-10 p-0 border-border/40 rounded-xl shadow-sm hover:bg-primary hover:text-white transition-all disabled:opacity-30"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            <IconChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Premium Evidence Gallery Modal */}
            <Dialog open={!!selectedEvidences} onOpenChange={(open) => !open && setSelectedEvidences(null)}>
                <DialogContent
                    showCloseButton={false}
                    className="sm:max-w-[700px] p-0 overflow-hidden bg-background/95 backdrop-blur-2xl border-border/40 shadow-[0_0_100px_-20px_rgba(0,0,0,0.5)] rounded-2xl"
                >
                    <DialogTitle className="sr-only">Service Evidence Gallery</DialogTitle>
                    <DialogDescription className="sr-only">View high-resolution evidence images for this time log.</DialogDescription>
                    <div className="relative">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-6 top-6 z-50 rounded-full bg-black/20 text-white backdrop-blur-md hover:bg-black/40 border border-white/10"
                            onClick={() => setSelectedEvidences(null)}
                        >
                            <IconChevronLeft className="h-5 w-5 rotate-180" />
                        </Button>

                        <div className="p-8 pb-4">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20 shadow-inner">
                                    <IconPhoto className="h-5 w-5" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black tracking-tight text-foreground">Service Evidence</h2>
                                    <p className="text-xs text-muted-foreground font-semibold uppercase tracking-widest">
                                        Log Proof {activeIndex + 1} of {selectedEvidences?.length}
                                    </p>
                                </div>
                            </div>

                            <div className="overflow-hidden rounded-2xl border border-border/40 bg-black/20 shadow-2xl" ref={emblaRef}>
                                <div className="flex">
                                    {selectedEvidences?.map((url, idx) => (
                                        <div key={idx} className="relative flex-[0_0_100%] min-w-0 group cursor-zoom-in aspect-video">
                                            <img
                                                src={url}
                                                alt={`Evidence ${idx + 1}`}
                                                className="h-full w-full object-contain bg-black/40"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-8">
                                                <Button
                                                    variant="secondary"
                                                    className="rounded-2xl px-6 font-black uppercase text-xs tracking-widest shadow-2xl border border-white/20"
                                                    onClick={() => window.open(url, '_blank')}
                                                >
                                                    <IconExternalLink className="h-4 w-4 mr-2" />
                                                    View High Res
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Thumbnails */}
                            <div className="flex gap-3 justify-center mt-6 px-4 overflow-x-auto pb-4 scrollbar-hide">
                                {selectedEvidences?.map((url, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => emblaApi?.scrollTo(idx)}
                                        className={`relative h-16 w-24 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 shadow-lg ${activeIndex === idx ? 'border-primary ring-4 ring-primary/20 scale-105' : 'border-border/40 opacity-50 hover:opacity-100'
                                            }`}
                                    >
                                        <img src={url} className="h-full w-full object-cover" alt="" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

