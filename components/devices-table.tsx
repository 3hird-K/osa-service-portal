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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  IconDotsVertical,
  IconSearch,
  IconPlus,
  IconDeviceLaptop,
  IconEdit,
  IconTrash,
} from "@tabler/icons-react"
import { toast } from "sonner"

type Device = {
  id: string
  name: string
  type: string
  status: string
  assignedTo: string
  lastUpdated: string
}
const dummyDevices = [ { id: "DEV-001", name: "Dell Latitude 5420", type: "Laptop", status: "Available", assignedTo: "-", lastUpdated: "Mar 01, 2026" }, { id: "DEV-002", name: "MacBook Pro M2", type: "Laptop", status: "In Use", assignedTo: "Emma Myers", lastUpdated: "Mar 02, 2026" }, { id: "DEV-003", name: "iPad Air 5th Gen", type: "Tablet", status: "In Use", assignedTo: "Jenna Ortega", lastUpdated: "Feb 28, 2026" }, { id: "DEV-004", name: "Epson Projector X41", type: "Projector", status: "Maintenance", assignedTo: "-", lastUpdated: "Mar 01, 2026" }, { id: "DEV-005", name: "ThinkPad T14", type: "Laptop", status: "Available", assignedTo: "-", lastUpdated: "Mar 03, 2026" }, { id: "DEV-006", name: "Logitech WebCam C920", type: "Peripheral", status: "In Use", assignedTo: "Gabimaru Hollow", lastUpdated: "Feb 25, 2026" }, { id: "DEV-007", name: "Dell P2419H Monitor", type: "Monitor", status: "Available", assignedTo: "-", lastUpdated: "Feb 20, 2026" }, { id: "DEV-008", name: "MacBook Air M1", type: "Laptop", status: "In Use", assignedTo: "Grant Gustin", lastUpdated: "Mar 01, 2026" }, { id: "DEV-009", name: "iPad Pro 11-inch", type: "Tablet", status: "Maintenance", assignedTo: "-", lastUpdated: "Feb 15, 2026" }, { id: "DEV-010", name: "Sony Alpha a7 III", type: "Camera", status: "In Use", assignedTo: "Tina Tamashiro", lastUpdated: "Mar 02, 2026" }, ]
export function DevicesTable() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [devices, setDevices] = React.useState<Device[]>(dummyDevices)

  const [isAddOpen, setIsAddOpen] = React.useState(false)
  const [isEditOpen, setIsEditOpen] = React.useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false)
  const [selectedDevice, setSelectedDevice] = React.useState<Device | null>(null)

  const filteredDevices = devices.filter(
    (d) =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.id.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAddSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    toast.success("Device added")
    setIsAddOpen(false)
  }

  const handleEditSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    toast.success("Device updated ")
    setIsEditOpen(false)
  }

  const handleDeleteConfirm = () => {
    if (!selectedDevice) return
    setDevices((prev) => prev.filter((d) => d.id !== selectedDevice.id))
    toast.success("Device deleted")
    setIsDeleteOpen(false)
  }

  const openEdit = (device: Device) => {
    setSelectedDevice(device)
    setIsEditOpen(true)
  }

  const openDelete = (device: Device) => {
    setSelectedDevice(device)
    setIsDeleteOpen(true)
  }

  return (
    <div className="w-full space-y-4">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-[350px]">
          <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search devices by name or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Add Device */}
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <IconPlus className="h-4 w-4" />
              Add Device
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Device</DialogTitle>
              <DialogDescription>
                Enter the device details.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleAddSubmit} className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Device</Label>
                <Input className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Last Name</Label>
                <Input className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">First Name</Label>
                <Input className="col-span-3" required />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Device Type</Label>
                <Select required>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Laptop">Laptop</SelectItem>
                    <SelectItem value="Tablet">Tablet</SelectItem>
                    <SelectItem value="Projector">Projector</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <DialogFooter>
                <Button type="submit">Save Device</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Table */}
      <div className="rounded-xl border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Device Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="text-right" />
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredDevices.length > 0 ? (
              filteredDevices.map((device) => (
                <TableRow key={device.id}>
                  <TableCell>{device.id}</TableCell>
                  <TableCell className="flex items-center gap-2">
                    <IconDeviceLaptop className="h-4 w-4 text-primary" />
                    {device.name}
                  </TableCell>
                  <TableCell>{device.type}</TableCell>
                  <TableCell>
                    <Badge>{device.status}</Badge>
                  </TableCell>
                  <TableCell>{device.assignedTo}</TableCell>
                  <TableCell>{device.lastUpdated}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <IconDotsVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEdit(device)}>
                          <IconEdit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => openDelete(device)}
                          className="text-destructive"
                        >
                          <IconTrash className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6">
                  No devices found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Dialog */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete{" "}
              <span className="font-semibold">
                {selectedDevice?.name}
              </span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}