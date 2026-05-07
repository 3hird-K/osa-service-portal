"use client"
 
import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { TasksTable } from "@/components/tasks-table"
import { useTasks } from "@/hooks/use-tasks"
import { useProfile } from "@/hooks/use-profile"
 
export default function ManageTasksPage() {
    const { data: tasks = [], isLoading } = useTasks();
    const { data: profile } = useProfile();
    const isAdmin = profile?.account_type?.toLowerCase() === "admin";

    return (
        <div className="flex-1 space-y-6 p-8 pt-6 bg-background min-h-screen text-foreground">
            {/* Header Section */}
            <div className="pb-4 border-b border-border/30">
                <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-3xl font-bold tracking-tight">Manage Tasks</h2>
                    <Badge className="rounded-full px-3 py-1 text-xs font-semibold bg-primary/20 text-primary border border-primary/30">
                        {isLoading ? "—" : tasks.length} Total Tasks
                    </Badge>
                    {isAdmin && (
                        <Badge className="rounded-full px-3 py-1 text-xs font-semibold bg-primary text-primary-foreground">
                            Admin Mode Active
                        </Badge>
                    )}
                </div>
                <p className="text-sm text-muted-foreground">
                    {isAdmin
                        ? "View and manage all service tasks, including their status, assignments, and progress."
                        : "Viewing all service tasks and their current progress status."}
                </p>
            </div>
 
            <TasksTable />
        </div>
    )
}

