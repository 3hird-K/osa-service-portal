"use client"

import * as React from "react"
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
import { IconSearch, IconCalendar, IconChevronDown, IconChevronLeft, IconChevronRight, IconChevronsLeft, IconChevronsRight } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
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
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"

export type TimeLog = {
    id: string
    studentName: string
    course: string
    year: string
    startTime: string
    endTime: string
    hours: string
    status: "completed" | "in-progress"
}

const data: TimeLog[] = [
    {
        id: "1",
        studentName: "Emma Myers",
        course: "BSIT",
        year: "1st yr",
        startTime: "2026-02-14 08:30 AM",
        endTime: "2026-03-17 08:30 AM",
        hours: "72h",
        status: "completed",
    },
    {
        id: "2",
        studentName: "Jenna Ortega",
        course: "BSCS",
        year: "2nd yr",
        startTime: "2026-02-28 01:00 PM",
        endTime: "2026-02-28 05:00 PM",
        hours: "4h",
        status: "completed",
    },
    {
        id: "3",
        studentName: "Gabimaru Hollow",
        course: "BSIT",
        year: "3rd yr",
        startTime: "2024-03-16 09:00 AM",
        endTime: "2024-03-16 01:00 PM",
        hours: "4h",
        status: "completed",
    },
    {
        id: "4",
        studentName: "Grant Gustin",
        course: "BSIT",
        year: "1st yr",
        startTime: "2024-03-16 08:00 AM",
        endTime: "2024-03-16 12:00 PM",
        hours: "4h",
        status: "completed",
    },
    {
        id: "5",
        studentName: "Linda Walker",
        course: "BSCS",
        year: "2nd yr",
        startTime: "2024-03-17 08:30 AM",
        endTime: "2024-03-17 11:30 AM",
        hours: "3h",
        status: "completed",
    },
    {
        id: "6",
        studentName: "Tina Tamashiro",
        course: "BSIT",
        year: "1st yr",
        startTime: "2024-03-17 01:00 PM",
        endTime: "-",
        hours: "-",
        status: "in-progress",
    },
    {
        id: "7",
        studentName: "Neil Dime",
        course: "BSCS",
        year: "3rd yr",
        startTime: "2026-03-01 10:00 AM",
        endTime: "2026-03-01 02:00 PM",
        hours: "4h",
        status: "completed",
    },
    {
        id: "8",
        studentName: "Iezhera Sajol",
        course: "BSIT",
        year: "2nd yr",
        startTime: "2026-03-02 08:00 AM",
        endTime: "-",
        hours: "-",
        status: "in-progress",
    },
    {
        id: "9",
        studentName: "Daniel Palle",
        course: "BSIT",
        year: "1st yr",
        startTime: "2026-03-02 09:00 AM",
        endTime: "2026-03-02 12:00 PM",
        hours: "3h",
        status: "completed",
    },
    {
        id: "10",
        studentName: "Car Lo",
        course: "BSCS",
        year: "4th yr",
        startTime: "2026-03-02 01:00 PM",
        endTime: "-",
        hours: "-",
        status: "in-progress",
    },
    { id: "11", studentName: "Sadie Sink", course: "BSIT", year: "2nd yr", startTime: "2026-03-03 08:00 AM", endTime: "2026-03-03 12:00 PM", hours: "4h", status: "completed" },
    { id: "12", studentName: "Millie Bobby Brown", course: "BSCS", year: "3rd yr", startTime: "2026-03-03 09:00 AM", endTime: "-", hours: "-", status: "in-progress" },
    { id: "13", studentName: "Finn Wolfhard", course: "BSIT", year: "1st yr", startTime: "2026-03-04 10:00 AM", endTime: "2026-03-04 02:00 PM", hours: "4h", status: "completed" },
    { id: "14", studentName: "Tom Holland", course: "BSIT", year: "4th yr", startTime: "2026-03-04 01:00 PM", endTime: "-", hours: "-", status: "in-progress" },
    { id: "15", studentName: "Zendaya Maree", course: "BSCS", year: "2nd yr", startTime: "2026-03-05 08:30 AM", endTime: "2026-03-05 11:30 AM", hours: "3h", status: "completed" },
    { id: "16", studentName: "Chris Evans", course: "BSIT", year: "3rd yr", startTime: "2026-03-05 01:00 PM", endTime: "-", hours: "-", status: "in-progress" },
    { id: "17", studentName: "Scarlett Johansson", course: "BSCS", year: "1st yr", startTime: "2026-03-06 09:00 AM", endTime: "2026-03-06 01:00 PM", hours: "4h", status: "completed" },
    { id: "18", studentName: "Robert Downey Jr.", course: "BSIT", year: "2nd yr", startTime: "2026-03-06 02:00 PM", endTime: "-", hours: "-", status: "in-progress" },
    { id: "19", studentName: "Chris Hemsworth", course: "BSCS", year: "4th yr", startTime: "2026-03-07 08:00 AM", endTime: "2026-03-07 12:00 PM", hours: "4h", status: "completed" },
    { id: "20", studentName: "Mark Ruffalo", course: "BSIT", year: "3rd yr", startTime: "2026-03-07 01:00 PM", endTime: "-", hours: "-", status: "in-progress" },
]

export const columns: ColumnDef<TimeLog>[] = [
    {
        accessorKey: "id",
        header: "ID",
        cell: ({ row }) => <div className="text-muted-foreground">{row.getValue("id")}</div>,
    },
    {
        accessorKey: "studentName",
        header: "Student Name",
        cell: ({ row }) => <div className="font-medium">{row.getValue("studentName")}</div>,
    },
    {
        accessorKey: "course",
        header: "Course",
        cell: ({ row }) => <div className="text-muted-foreground">{row.getValue("course")}</div>,
    },
    {
        accessorKey: "year",
        header: "Year",
        cell: ({ row }) => <div className="text-muted-foreground">{row.getValue("year")}</div>,
    },
    {
        accessorKey: "startTime",
        header: "Start Time",
        cell: ({ row }) => <div className="text-muted-foreground">{row.getValue("startTime")}</div>,
    },
    {
        accessorKey: "endTime",
        header: "End Time",
        cell: ({ row }) => <div className="text-muted-foreground">{row.getValue("endTime")}</div>,
    },
    {
        accessorKey: "hours",
        header: "Hours",
        cell: ({ row }) => <div className="text-muted-foreground">{row.getValue("hours")}</div>,
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as string
            return (
                <Badge
                    className={`rounded-full px-3 py-0.5 font-medium ${status === "completed"
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "bg-foreground text-background hover:bg-foreground/90 border-transparent"
                        }`}
                >
                    {status}
                </Badge>
            )
        },
    },
]

export function TimeLogsTable() {
    const [date, setDate] = React.useState<Date>()
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [rowSelection, setRowSelection] = React.useState({})

    const table = useReactTable({
        data,
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
        <div className="w-full space-y-6">
            {/* Table controls */}
            <div className="flex items-center gap-4">
                <div className="relative w-72">
                    <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search student name..."
                        value={(table.getColumn("studentName")?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn("studentName")?.setFilterValue(event.target.value)
                        }
                        className="pl-9 bg-card border-border h-10 rounded-full"
                    />
                </div>

                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="h-10 rounded-full bg-card border-border px-4 flex items-center gap-2 justify-start font-normal text-muted-foreground hover:bg-[#1a1d27] hover:text-white">
                            <IconCalendar className="h-4 w-4" />
                            {date ? format(date, "PPP") : <span>Pick a date</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 border-border bg-card text-white">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>

                <Select
                    value={(table.getColumn("status")?.getFilterValue() as string) ?? "all"}
                    onValueChange={(value) =>
                        table.getColumn("status")?.setFilterValue(value === "all" ? "" : value)
                    }
                >
                    <SelectTrigger className="h-10 w-[140px] rounded-full bg-card border-border text-muted-foreground focus:ring-0">
                        <SelectValue placeholder="All status" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border text-muted-foreground">
                        <SelectItem value="all">All status</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="in-progress">In-progress</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Main Table */}
            <div className="rounded-xl border border-border bg-card overflow-hidden shadow-md">
                <Table>
                    <TableHeader className="bg-transparent hover:bg-transparent border-b border-border">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="border-none hover:bg-transparent">
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id} className="text-xs font-semibold text-muted-foreground h-12">
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
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    className="border-b-[#2c2d3c] hover:bg-white/5 transition-colors"
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
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                {/* Table Footer / Pagination */}
                <div className="flex items-center justify-between py-4 px-6 text-sm text-muted-foreground bg-card border-t border-border">
                    <div>
                        Showing {table.getFilteredRowModel().rows.length} of {data.length} logs
                    </div>
                    <div className="flex items-center space-x-6 lg:space-x-8">
                        <div className="flex items-center space-x-2">
                            <p className="text-sm font-medium">Rows per page</p>
                            <Select
                                value={`${table.getState().pagination.pageSize}`}
                                onValueChange={(value) => {
                                    table.setPageSize(Number(value))
                                }}
                            >
                                <SelectTrigger className="h-8 w-[70px] bg-card border-border">
                                    <SelectValue placeholder={table.getState().pagination.pageSize} />
                                </SelectTrigger>
                                <SelectContent side="top" className="bg-card border-border text-muted-foreground">
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
                                className="hidden h-8 w-8 p-0 lg:flex bg-card border-border"
                                onClick={() => table.setPageIndex(0)}
                                disabled={!table.getCanPreviousPage()}
                            >
                                <span className="sr-only">Go to first page</span>
                                <IconChevronsLeft className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                className="h-8 w-8 p-0 bg-card border-border"
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                            >
                                <span className="sr-only">Go to previous page</span>
                                <IconChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                className="h-8 w-8 p-0 bg-card border-border"
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                            >
                                <span className="sr-only">Go to next page</span>
                                <IconChevronRight className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                className="hidden h-8 w-8 p-0 lg:flex bg-card border-border"
                                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                                disabled={!table.getCanNextPage()}
                            >
                                <span className="sr-only">Go to last page</span>
                                <IconChevronsRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
