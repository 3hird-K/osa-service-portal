"use client"

import * as React from "react"
import { Suspense } from "react"
import { Badge } from "@/components/ui/badge"
import { TimeLogsTable } from "@/components/time-logs-table"
import { useLogs } from "@/hooks/use-logs"
import { useProfile } from "@/hooks/use-profile"
import { useSearchParams } from "next/navigation"

function ManageLogsContent() {
  const searchParams = useSearchParams()
  const taskId = searchParams.get("taskId") || undefined
  const { logs, isLoading } = useLogs(taskId)
  const { data: profile } = useProfile()
  const isAdmin = profile?.account_type?.toLowerCase() === "admin"

  // Calculate some quick stats
  const totalHours = logs.reduce((acc, log) => acc + (parseFloat(log.hours as string) || 0), 0)
  const uniqueStudents = new Set(logs.map(log => log.user_id)).size

  return (
    <div className="flex-1 space-y-8 p-8 pt-6 bg-background min-h-screen text-foreground animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h2 className="text-4xl font-extrabold tracking-tight bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">
              Time Logs
            </h2>
            {isAdmin && (
              <Badge className="rounded-full px-2.5 py-0.5 text-[10px] font-bold bg-primary text-primary-foreground uppercase tracking-wider">
                Admin Mode
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground font-medium">
            Monitoring community service contributions and verification proofs.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="flex flex-col items-center justify-center px-6 py-3 rounded-2xl bg-card border border-border/50 shadow-sm transition-all hover:shadow-md hover:border-primary/20 group">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1 group-hover:text-primary/70 transition-colors">Total Hours</span>
            <span className="text-2xl font-black text-primary">
              {isLoading ? "—" : totalHours.toFixed(1)}
            </span>
          </div>
          <div className="flex flex-col items-center justify-center px-6 py-3 rounded-2xl bg-card border border-border/50 shadow-sm transition-all hover:shadow-md hover:border-primary/20 group">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1 group-hover:text-primary/70 transition-colors">Students</span>
            <span className="text-2xl font-black text-foreground">
              {isLoading ? "—" : uniqueStudents}
            </span>
          </div>
          <div className="flex flex-col items-center justify-center px-6 py-3 rounded-2xl bg-card border border-border/50 shadow-sm transition-all hover:shadow-md hover:border-primary/20 group">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1 group-hover:text-primary/70 transition-colors">Sessions</span>
            <span className="text-2xl font-black text-foreground">
              {isLoading ? "—" : logs.length}
            </span>
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-transparent pointer-events-none rounded-3xl" />
        <Suspense fallback={
          <div className="h-64 w-full flex items-center justify-center rounded-3xl border border-dashed border-border/50">
            <div className="flex flex-col items-center gap-3">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent shadow-lg" />
              <p className="text-sm font-bold text-muted-foreground animate-pulse">Initializing Data Stream...</p>
            </div>
          </div>
        }>
          <TimeLogsTable />
        </Suspense>
      </div>
    </div>
  )
}

export default function ManageLogsPage() {
  return (
    <Suspense fallback={
      <div className="flex-1 h-screen flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    }>
      <ManageLogsContent />
    </Suspense>
  )
}