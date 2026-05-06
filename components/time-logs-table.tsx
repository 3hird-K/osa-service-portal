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
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useLogs, type TimeLog } from "@/hooks/use-logs"
import { format } from "date-fns"
import { Badge } from "./ui/badge"

export function TimeLogsTable() {
    const searchParams = useSearchParams()
    const taskId = searchParams.get("taskId") || undefined
    const { logs, isLoading, error, refetch } = useLogs(taskId)

    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [rowSelection, setRowSelection] = React.useState({})
    const [selectedEvidences, setSelectedEvidences] = React.useState<string[] | null>(null)

    const columns: ColumnDef<TimeLog>[] = [
        {
            accessorKey: "date",
            header: "Date",
            cell: ({ row }) => (
                <div className="text-xs font-bold text-foreground">
                    {row.original.date ? format(new Date(row.original.date), "yyyy-MM-dd") : "-"}
                </div>
            ),
        },
        {
            accessorKey: "studentName",
            header: "Student",
            cell: ({ row }) => {
                const user = row.original.user
                const name = user ? `${user.firstname} ${user.lastname}` : "Unknown Student"
                return (
                    <div className="flex flex-col">
                        <span className="font-semibold text-foreground text-sm">{name}</span>
                        <span className="text-[10px] text-muted-foreground">{user?.email || "-"}</span>
                    </div>
                )
            },
        },
        {
            accessorKey: "taskTitle",
            header: "Task Name",
            cell: ({ row }) => (
                <div className="font-medium text-primary/90 text-sm">
                    {row.original.task?.title || "Unknown Task"}
                </div>
            ),
        },
        {
            accessorKey: "start_time",
            header: "Start",
            cell: ({ row }) => <div className="text-xs text-muted-foreground">{row.getValue("start_time") || "-"}</div>,
        },
        {
            accessorKey: "break_time",
            header: "Break",
            cell: ({ row }) => <div className="text-xs text-muted-foreground">{row.getValue("break_time") || "-"}</div>,
        },
        {
            accessorKey: "back_time",
            header: "Back",
            cell: ({ row }) => <div className="text-xs text-muted-foreground">{row.getValue("back_time") || "-"}</div>,
        },
        {
            accessorKey: "end_time",
            header: "End",
            cell: ({ row }) => <div className="text-xs text-muted-foreground">{row.getValue("end_time") || "-"}</div>,
        },
        {
            accessorKey: "hours",
            header: "Hours",
            cell: ({ row }) => (
                <div className="flex items-center gap-1.5 font-bold text-primary">
                    <IconClock className="h-3.5 w-3.5 opacity-50" />
                    <span className="text-sm">{row.getValue("hours") || "0h"}</span>
                </div>
            ),
        },
        {
            id: "evidence",
            header: "Evidence",
            cell: ({ row }) => {
                const evidenceStr = row.original.evidence_urls
                let urls: string[] = []
                try {
                    if (evidenceStr) urls = JSON.parse(evidenceStr)
                } catch (e) {
                    if (evidenceStr) urls = [evidenceStr]
                }

                return urls && urls.length > 0 ? (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 gap-2 px-2 hover:bg-primary/10 hover:text-primary text-xs font-medium"
                        onClick={() => setSelectedEvidences(urls)}
                    >
                        <IconPhoto className="h-4 w-4" />
                        <span>{urls.length}</span>
                    </Button>
                ) : (
                    <span className="text-[10px] text-muted-foreground italic px-2">No evidence</span>
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
        state: {
            sorting,
            columnFilters,
            rowSelection,
        },
    })

    return (
        <div className="w-full space-y-4">
            {/* Table controls */}
            <div className="flex flex-col md:flex-row items-center gap-3">
                <div className="relative w-full md:w-80">
                    <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search logs or students..."
                        value={(table.getColumn("studentName")?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn("studentName")?.setFilterValue(event.target.value)
                        }
                        className="pl-9 bg-muted/20 border-border/50 h-10 rounded-lg text-sm font-medium"
                    />
                </div>
                {taskId && (
                    <Badge variant="secondary" className="h-10 px-4 rounded-lg bg-primary/10 text-primary border-primary/20">
                        Task: {logs[0]?.task?.title || taskId}
                    </Badge>
                )}
            </div>

            {/* Main Table */}
            <div className="rounded-2xl border border-border/50 bg-card overflow-hidden shadow-sm">
                <Table>
                    <TableHeader className="bg-muted/30">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="hover:bg-transparent border-border/50">
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id} className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground py-4">
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {error ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-32 text-center text-destructive">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <p className="text-sm font-bold uppercase tracking-widest">Connection Error</p>
                                        <p className="text-xs opacity-80 font-medium">Failed to reach the service engine. Please check if your backend is running.</p>
                                        <Button variant="outline" size="sm" onClick={() => refetch()} className="mt-2 h-8 text-[10px] font-bold uppercase border-destructive/20 hover:bg-destructive/10 text-destructive cursor-pointer">
                                            Retry Connection
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : isLoading ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-32 text-center text-muted-foreground">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                                        <p className="text-sm font-medium">Loading time logs...</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    className="border-border/50 hover:bg-muted/20 transition-colors"
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
                                <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                                    No records found.
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
                        {table.getPageCount() || 1}
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

            {/* Evidence Modal */}
            <Dialog open={!!selectedEvidences} onOpenChange={(open) => !open && setSelectedEvidences(null)}>
                <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden bg-card border border-border/50 shadow-2xl">
                    <DialogHeader className="p-4 border-b border-border/50 bg-muted/30">
                        <DialogTitle className="text-sm font-bold flex items-center gap-2">
                            <IconPhoto className="h-4 w-4 text-primary" />
                            Service Evidence ({selectedEvidences?.length})
                        </DialogTitle>
                    </DialogHeader>

                    <div className="p-4 space-y-4">
                        <div className="flex gap-4 overflow-x-auto pb-4 px-2 snap-x snap-mandatory">
                            {selectedEvidences?.map((url, idx) => (
                                <div key={idx} className="relative min-w-[300px] aspect-[4/3] bg-muted rounded-xl overflow-hidden border border-border/50 group snap-center shadow-md">
                                    <img
                                        src={url}
                                        alt={`Evidence ${idx + 1}`}
                                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            className="gap-2 h-9 rounded-full font-bold shadow-xl"
                                            onClick={() => window.open(url, '_blank')}
                                        >
                                            <IconExternalLink className="h-4 w-4" />
                                            Open Full View
                                        </Button>
                                    </div>
                                    <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-[10px] text-white px-2 py-1 rounded-full font-bold border border-white/10">
                                        IMG_{idx + 1}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-col items-center gap-1">
                            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">
                                Swipe or scroll horizontally to browse
                            </p>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
