"use client"

import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { IconDeviceLaptop } from "@tabler/icons-react"
import { DevicesTable } from "@/components/devices-table"

export default function ManageDevicesPage() {
    return (
        <div className="flex-1 space-y-6 p-8 pt-6 bg-background min-h-screen text-foreground">
            {/* Header Section */}
            <div className="flex items-center justify-between pb-4 border-b border-border/10">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Manage Devices</h2>
                    <p className="text-muted-foreground mt-1">
                        View and manage all registered portal devices, including their status and assignments.
                    </p>
                </div>
            </div>

            <DevicesTable />
        </div>
    )
}
