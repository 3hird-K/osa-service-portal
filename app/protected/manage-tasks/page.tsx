"use client"
 
import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { IconClipboardList } from "@tabler/icons-react"
import { TasksTable } from "@/components/tasks-table"
 
export default function ManageTasksPage() {
    return (
        <div className="flex-1 space-y-6 p-8 pt-6 bg-background min-h-screen text-foreground">
            {/* Header Section */}
            <div className="flex items-center justify-between pb-4 border-b border-border/10">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Manage Tasks</h2>
                    <p className="text-muted-foreground mt-1">
                        View and manage all service tasks, including their status, assignments, and progress.
                    </p>
                </div>
            </div>
 
            <TasksTable />
        </div>
    )
}
