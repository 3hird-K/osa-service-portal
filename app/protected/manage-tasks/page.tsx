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
        <div className="flex-1 space-y-8 p-8 pt-6 bg-background min-h-screen text-foreground">
            {/* Premium Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
                <div className="space-y-1">
                    <div className="flex items-center gap-3 mb-1">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">
                            Operational Command
                        </p>
                        <Badge variant="outline" className="rounded-full px-3 py-0.5 text-[9px] font-black uppercase tracking-widest bg-primary/5 text-primary border-primary/20">
                            Task Engine Online
                        </Badge>
                    </div>
                    <h2 className="text-4xl font-black tracking-tight bg-gradient-to-r from-foreground to-foreground/50 bg-clip-text text-transparent uppercase">
                        Manage Tasks
                    </h2>
                    <p className="text-sm text-muted-foreground font-medium max-w-2xl">
                        {isAdmin
                            ? "Deployment center for service operations. Monitor mission status, assign personnel to field sites, and audit operational progress across the infrastructure."
                            : "Registry of active service missions and ongoing operations. High-priority tasks are monitored in real-time by system administrators."}
                    </p>
                </div>

                {isAdmin && (
                    <Badge variant="outline" className="h-12 px-6 rounded-xl bg-primary/5 text-primary border-primary/20 font-black uppercase text-[10px] tracking-widest flex items-center gap-2 shadow-lg shadow-primary/5 hover:bg-primary/10 transition-colors">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        Admin Privileges Active
                    </Badge>
                )}
            </div>

            <TasksTable />
        </div>
    )
}

