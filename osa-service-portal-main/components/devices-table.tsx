"use client"

import * as React from "react"
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
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { IconDotsVertical, IconSearch, IconPlus, IconDeviceLaptop, IconEdit, IconTrash } from "@tabler/icons-react"
import { toast } from "sonner"

// --- Dummy Data ---
const dummyDevices = [
    { id: "DEV-001", name: "Dell Latitude 5420", type: "Laptop", status: "Available", assignedTo: "-", lastUpdated: "Mar 01, 2026" },
    { id: "DEV-002", name: "MacBook Pro M2", type: "Laptop", status: "In Use", assignedTo: "Emma Myers", lastUpdated: "Mar 02, 2026" },
    { id: "DEV-003", name: "iPad Air 5th Gen", type: "Tablet", status: "In Use", assignedTo: "Jenna Ortega", lastUpdated: "Feb 28, 2026" },
    { id: "DEV-004", name: "Epson Projector X41", type: "Projector", status: "Maintenance", assignedTo: "-", lastUpdated: "Mar 01, 2026" },
    { id: "DEV-005", name: "ThinkPad T14", type: "Laptop", status: "Available", assignedTo: "-", lastUpdated: "Mar 03, 2026" },
    { id: "DEV-006", name: "Logitech WebCam C920", type: "Peripheral", status: "In Use", assignedTo: "Gabimaru Hollow", lastUpdated: "Feb 25, 2026" },
    { id: "DEV-007", name: "Dell P2419H Monitor", type: "Monitor", status: "Available", assignedTo: "-", lastUpdated: "Feb 20, 2026" },
    { id: "DEV-008", name: "MacBook Air M1", type: "Laptop", status: "In Use", assignedTo: "Grant Gustin", lastUpdated: "Mar 01, 2026" },
    { id: "DEV-009", name: "iPad Pro 11-inch", type: "Tablet", status: "Maintenance", assignedTo: "-", lastUpdated: "Feb 15, 2026" },
    { id: "DEV-010", name: "Sony Alpha a7 III", type: "Camera", status: "In Use", assignedTo: "Tina Tamashiro", lastUpdated: "Mar 02, 2026" },
]

export function DevicesTable() {
    const [searchQuery, setSearchQuery] = React.useState("")
    const [devices, setDevices] = React.useState(dummyDevices)

    // For Modals
    const [isAddOpen, setIsAddOpen] = React.useState(false)
    const [isEditOpen, setIsEditOpen] = React.useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = React.useState(false)
    const [selectedDevice, setSelectedDevice] = React.useState<any>(null)

    const filteredDevices = devices.filter(d =>
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.id.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleAddSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        toast.error("Failed to add device")
        setIsAddOpen(false)
    }

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        toast.error("Failed to update device")
        setIsEditOpen(false)
    }

    const handleDeleteConfirm = () => {
        toast.error("Failed to delete device")
        setIsDeleteOpen(false)
    }

    const openEdit = (device: any) => {
        setSelectedDevice(device)
        setIsEditOpen(true)
    }

    const openDelete = (device: any) => {
        setSelectedDevice(device)
        setIsDeleteOpen(true)
    }

    return (
        <div className="w-full space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative w-full sm:w-[350px]">
                    <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search devices by name or ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 bg-card border-border h-10 rounded-md"
                    />
                </div>

                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button className="h-10 px-4 gap-2 text-sm font-medium">
                            <IconPlus className="h-4 w-4" />
                            Add Device
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] bg-card border-border">
                        <DialogHeader>
                            <DialogTitle>Add New Device</DialogTitle>
                            <DialogDescription className="text-muted-foreground">
                                Enter the details of the new device to add to the inventory.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleAddSubmit} className="grid gap-4 py-4">
    <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="firstName" className="text-right">
            First Name
        </Label>
        <Input
            id="firstName"
            name="firstName"
            placeholder="Enter first name"
            className="col-span-3 bg-background border-border"
            required
        />
    </div>
    <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="lastName" className="text-right">
            Last Name
        </Label>
        <Input
            id="lastName"
            name="lastName"
            placeholder="Enter last name"
            className="col-span-3 bg-background border-border"
            required
        />
    </div>
    <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="deviceName" className="text-right">
            Device Name
        </Label>
        <Input
            id="deviceName"
            name="deviceName"
            placeholder="e.g. MacBook Pro M3"
            className="col-span-3 bg-background border-border"
            required
        />
    </div>

    {/* Device Type */}
    <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="type" className="text-right">
            Device Type
        </Label>
        <Select name="type" required>
            <SelectTrigger className="col-span-3 bg-background border-border text-foreground">
                <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border text-foreground">
                <SelectItem value="laptop">Laptop</SelectItem>
                <SelectItem value="tablet">Tablet</SelectItem>
                <SelectItem value="projector">Projector</SelectItem>
                <SelectItem value="peripheral">Peripheral</SelectItem>
                <SelectItem value="other">Other</SelectItem>
            </SelectContent>
        </Select>
    </div>

    <DialogFooter>
        <Button type="submit">Save Device</Button>
    </DialogFooter>

</form>

            <div className="rounded-xl border border-border bg-card overflow-hidden shadow-md">
                <Table>
                    <TableHeader className="bg-transparent hover:bg-transparent border-b border-border">
                        <TableRow className="border-none hover:bg-transparent">
                            <TableHead className="text-muted-foreground font-medium w-[100px]">ID</TableHead>
                            <TableHead className="text-muted-foreground font-medium">Device Name</TableHead>
                            <TableHead className="text-muted-foreground font-medium">Type</TableHead>
                            <TableHead className="text-muted-foreground font-medium">Status</TableHead>
                            <TableHead className="text-muted-foreground font-medium">Assigned To</TableHead>
                            <TableHead className="text-muted-foreground font-medium">Last Updated</TableHead>
                            <TableHead className="text-right text-muted-foreground font-medium w-[80px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredDevices.length > 0 ? (
                            filteredDevices.map((device) => (
                                <TableRow key={device.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                                    <TableCell className="font-medium text-muted-foreground">{device.id}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <IconDeviceLaptop className="h-4 w-4 text-primary" />
                                            {device.name}
                                        </div>
                                    </TableCell>
                                    <TableCell>{device.type}</TableCell>
                                    <TableCell>
                                        <Badge variant={device.status === 'Available' ? 'secondary' : device.status === 'In Use' ? 'default' : 'destructive'}
                                            className={
                                                device.status === 'Available' ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-none' :
                                                    device.status === 'In Use' ? 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-none' :
                                                        'bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 border-none'
                                            }
                                        >
                                            {device.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">{device.assignedTo}</TableCell>
                                    <TableCell className="text-muted-foreground text-sm">{device.lastUpdated}</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <IconDotsVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="bg-card border-border">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => openEdit(device)} className="cursor-pointer gap-2">
                                                    <IconEdit className="h-4 w-4" /> Edit Details
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator className="bg-border" />
                                                <DropdownMenuItem onClick={() => openDelete(device)} className="cursor-pointer text-destructive focus:text-destructive gap-2">
                                                    <IconTrash className="h-4 w-4" /> Delete Device
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center">
                                    No devices found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Edit Modal */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-[425px] bg-card border-border">
                    <DialogHeader>
                        <DialogTitle>Edit Device</DialogTitle>
                        <DialogDescription className="text-muted-foreground">
                            Make changes to the device details here.
                        </DialogDescription>
                    </DialogHeader>
                    {selectedDevice && (
                        <form onSubmit={handleEditSubmit} className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-name" className="text-right">Name</Label>
                                <Input id="edit-name" defaultValue={selectedDevice.name} className="col-span-3 bg-background border-border" required />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-status" className="text-right">Status</Label>
                                <Select defaultValue={selectedDevice.status === "Available" ? "available" : selectedDevice.status === "In Use" ? "in-use" : "maintenance"}>
                                    <SelectTrigger className="col-span-3 bg-background border-border text-foreground">
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-card border-border text-foreground">
                                        <SelectItem value="available">Available</SelectItem>
                                        <SelectItem value="in-use">In Use</SelectItem>
                                        <SelectItem value="maintenance">Maintenance</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-assigned" className="text-right">Assignee</Label>
                                <Input id="edit-assigned" defaultValue={selectedDevice.assignedTo !== "-" ? selectedDevice.assignedTo : ""} placeholder="e.g. John Doe" className="col-span-3 bg-background border-border" />
                            </div>
                            <DialogFooter>
                                <Button type="submit">Save Changes</Button>
                            </DialogFooter>
                        </form>
                    )}
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <AlertDialogContent className="bg-card border-border">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription className="text-muted-foreground">
                            This action cannot be undone. This will permanently delete
                            the device <span className="font-semibold text-foreground">{selectedDevice?.name}</span> from the inventory.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="bg-transparent border-border hover:bg-muted text-foreground">Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
