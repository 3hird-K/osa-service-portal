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
import {
    IconSearch,
    IconChevronLeft,
    IconChevronRight,
    IconUser,
    IconShieldCheck,
    IconUsers,
    IconActivity,
    IconMail,
    IconId,
    IconX,
    IconLoader2,
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
    DialogHeader,
} from "@/components/ui/dialog"
import { Badge } from "./ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
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

export interface User {
    id: string | number
    firstname: string | null
    lastname: string | null
    email: string | null
    avatar_url?: string | null
    account_type: string
    updated_at: string
    is_online?: boolean
}

interface UsersTableProps {
    data: User[]
    isLoading: boolean
    isAdmin: boolean
    onRefresh: () => void
}

export function UsersTable({ data, isLoading, isAdmin, onRefresh }: UsersTableProps) {
    const [sorting, setSorting] = React.useState<SortingState>([{ id: 'studentName', desc: false }])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [globalFilter, setGlobalFilter] = React.useState("")
    const [selectedUser, setSelectedUser] = React.useState<User | null>(null)

    const columns: ColumnDef<User>[] = [
        {
            id: "studentName",
            accessorFn: (row) => `${row.firstname} ${row.lastname} ${row.email}`,
            header: "User Profile",
            cell: ({ row }) => {
                const user = row.original
                const name = `${user.firstname} ${user.lastname}`
                const initials = `${user.firstname?.[0] || ""}${user.lastname?.[0] || ""}`

                return (
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Avatar className="h-9 w-9 rounded-xl border border-border/50 shadow-sm transition-transform hover:scale-105 overflow-hidden">
                                <AvatarImage src={user.avatar_url || ""} className="object-cover" />
                                <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-black uppercase">{initials}</AvatarFallback>
                            </Avatar>
                            {user.is_online && (
                                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-background shadow-sm" />
                            )}
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="font-bold text-foreground text-sm leading-tight truncate">{name}</span>
                            <div className="flex items-center gap-1.5 truncate">
                                <IconMail className="h-2.5 w-2.5 text-muted-foreground" />
                                <span className="text-[10px] text-muted-foreground font-medium truncate">{user.email || "-"}</span>
                            </div>
                        </div>
                    </div>
                )
            },
        },
        {
            accessorKey: "id",
            header: "Identification",
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-muted/50 border border-border/30">
                        <IconId className="h-3 w-3 text-muted-foreground" />
                    </div>
                    <span className="font-mono text-[10px] font-bold text-muted-foreground tracking-wider uppercase">
                        {String(row.original.id).slice(0, 8)}
                    </span>
                </div>
            ),
        },
        {
            accessorKey: "account_type",
            header: "Access Level",
            cell: ({ row }) => {
                const type = row.original.account_type?.toLowerCase()
                const is_admin = type === "admin"
                return (
                    <Badge 
                        variant="outline" 
                        className={`gap-1.5 px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${
                            is_admin 
                            ? "bg-primary/10 text-primary border-primary/20 shadow-sm shadow-primary/5" 
                            : "bg-muted/50 text-muted-foreground border-border/50"
                        }`}
                    >
                        {is_admin ? <IconShieldCheck className="h-3 w-3" /> : <IconUser className="h-3 w-3" />}
                        {is_admin ? "Administrator" : "Student"}
                    </Badge>
                )
            },
        },
        {
            id: "actions",
            header: "Management",
            cell: ({ row }) => (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedUser(row.original)}
                    className="h-8 rounded-xl px-4 font-black uppercase text-[9px] tracking-widest border-border/40 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all shadow-sm"
                >
                    Configure
                </Button>
            ),
        },
    ]

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onGlobalFilterChange: setGlobalFilter,
        state: {
            sorting,
            columnFilters,
            globalFilter,
        },
    })

    const stats = React.useMemo(() => ({
        total: data.length,
        admins: data.filter(u => u.account_type?.toLowerCase() === 'admin').length,
        students: data.filter(u => u.account_type?.toLowerCase() !== 'admin').length,
        online: data.filter(u => u.is_online).length
    }), [data])

    return (
        <div className="w-full space-y-8">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Total Profiles", value: stats.total, icon: IconUsers, color: "text-primary", bg: "bg-primary/5" },
                    { label: "Active Admins", value: stats.admins, icon: IconShieldCheck, color: "text-blue-500", bg: "bg-blue-500/5" },
                    { label: "Student Base", value: stats.students, icon: IconUser, color: "text-amber-500", bg: "bg-amber-500/5" },
                    { label: "Real-time Online", value: stats.online, icon: IconActivity, color: "text-emerald-500", bg: "bg-emerald-500/5" },
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

            {/* Table controls */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="relative w-full md:w-96 group">
                    <div className="absolute inset-0 bg-primary/5 rounded-xl blur-xl group-focus-within:bg-primary/10 transition-all opacity-0 group-focus-within:opacity-100 pointer-events-none" />
                    <IconSearch className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors pointer-events-none" />
                    <Input
                        placeholder="Search users, emails, or roles..."
                        value={globalFilter ?? ""}
                        onChange={(event) => setGlobalFilter(event.target.value)}
                        className="pl-11 bg-card border-border/40 h-12 rounded-xl text-sm font-semibold shadow-sm focus-visible:ring-primary/20 focus-visible:border-primary/50 transition-all"
                    />
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
                            {isLoading ? (
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
                                        No profiles found in the registry.
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
                        {table.getFilteredRowModel().rows.length} Total Users
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

            {/* User Configuration Modal */}
            <UserSheet 
                user={selectedUser} 
                isAdmin={isAdmin} 
                onClose={() => setSelectedUser(null)} 
                onSaved={() => {
                    onRefresh()
                    setSelectedUser(null)
                }}
            />
        </div>
    )
}

interface UserSheetProps {
    user: User | null
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

    const handleSave = async () => {
        setIsSaving(true)
        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://server-osa-service.onrender.com";
            const res = await fetch(`${baseUrl}/api/admin/update-user`, {
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
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to update")
        } finally {
            setIsSaving(false)
        }
    }

    const handleDelete = async () => {
        setIsDeleting(true)
        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://server-osa-service.onrender.com";
            const res = await fetch(`${baseUrl}/api/admin/delete-user`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ targetUserId: user.id }),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error ?? "Delete failed")
            toast.success("User deleted")
            onSaved()
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to delete")
        } finally {
            setIsDeleting(false)
            setShowDeleteAlert(false)
        }
    }

    return (
        <Dialog open={!!user} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-md bg-background/95 backdrop-blur-2xl border-border/40 shadow-2xl rounded-2xl p-0 overflow-hidden">
                <DialogTitle className="sr-only">Configure User Profile</DialogTitle>
                <DialogDescription className="sr-only">Edit user details, roles, or remove the profile from the system.</DialogDescription>
                
                <div className="relative">
                    {/* Header */}
                    <div className="p-8 pb-6 border-b border-border/40">
                        <div className="flex flex-col items-center gap-4 text-center">
                            <div className="relative">
                                <Avatar className="h-24 w-24 border-4 border-background shadow-xl rounded-2xl">
                                    <AvatarImage src={user.avatar_url ?? ""} />
                                    <AvatarFallback className="text-2xl font-black bg-primary/10 text-primary">
                                        {user.firstname?.[0]}{user.lastname?.[0]}
                                    </AvatarFallback>
                                </Avatar>
                                {user.is_online && (
                                    <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full bg-emerald-500 ring-4 ring-background shadow-lg" />
                                )}
                            </div>
                            <div>
                                <h2 className="text-xl font-black tracking-tight text-foreground uppercase">{user.firstname} {user.lastname}</h2>
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">{user.email}</p>
                            </div>
                        </div>
                    </div>

                    {/* Form Body */}
                    <div className="p-8 space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">First Name</Label>
                                <Input 
                                    value={firstName} 
                                    onChange={(e) => setFirstName(e.target.value)} 
                                    disabled={!isAdmin}
                                    className="bg-muted/30 border-border/40 rounded-xl font-bold"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Last Name</Label>
                                <Input 
                                    value={lastName} 
                                    onChange={(e) => setLastName(e.target.value)} 
                                    disabled={!isAdmin}
                                    className="bg-muted/30 border-border/40 rounded-xl font-bold"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Access Role</Label>
                            <Select value={accountType} onValueChange={setAccountType} disabled={!isAdmin}>
                                <SelectTrigger className="bg-muted/30 border-border/40 rounded-xl h-11 font-bold">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-border/40 shadow-2xl font-bold">
                                    <SelectItem value="admin">Administrator (Full Access)</SelectItem>
                                    <SelectItem value="student">Student (Restricted)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                            <p className="text-[10px] font-medium leading-relaxed text-muted-foreground italic">
                                {accountType === "admin" 
                                    ? "Admins can manage tasks, users, and audit logs across the entire infrastructure."
                                    : "Students are restricted to logging their own service hours and viewing personal tasks."}
                            </p>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-8 pt-0 flex flex-col gap-3">
                        {isAdmin && (
                            <>
                                <Button 
                                    onClick={handleSave} 
                                    disabled={isSaving}
                                    className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-black uppercase text-xs tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                >
                                    {isSaving && <IconLoader2 className="h-4 w-4 mr-2 animate-spin" />}
                                    Apply System Update
                                </Button>
                                <Button 
                                    variant="ghost" 
                                    onClick={() => setShowDeleteAlert(true)}
                                    className="w-full h-11 rounded-xl text-destructive hover:bg-destructive/10 font-bold uppercase text-[10px] tracking-widest"
                                >
                                    Purge Profile Registry
                                </Button>
                            </>
                        )}
                        {!isAdmin && (
                            <p className="text-[10px] font-black text-center text-muted-foreground uppercase tracking-widest opacity-40 py-2">
                                Read-Only Access • Registry Locked
                            </p>
                        )}
                    </div>
                </div>

                {/* Delete Confirmation */}
                <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
                    <AlertDialogContent className="rounded-2xl border-border/40 bg-background/95 backdrop-blur-2xl">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="font-black uppercase tracking-tight">Irreversible Action</AlertDialogTitle>
                            <AlertDialogDescription className="text-sm font-medium">
                                This will permanently remove <span className="text-foreground font-bold">{user.firstname} {user.lastname}</span> from the OSA system. All associated session data will be archived.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="gap-3">
                            <AlertDialogCancel className="rounded-xl font-bold border-border/40">Abort</AlertDialogCancel>
                            <AlertDialogAction 
                                onClick={handleDelete}
                                className="bg-destructive text-destructive-foreground rounded-xl font-bold hover:bg-destructive/90"
                            >
                                {isDeleting && <IconLoader2 className="h-4 w-4 mr-2 animate-spin" />}
                                Confirm Purge
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </DialogContent>
        </Dialog>
    )
}
