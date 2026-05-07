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

  return (
    <div className="flex-1 space-y-6 p-8 pt-6 bg-background min-h-screen text-foreground">
      {/* Header Section */}
      <div className="pb-4 border-b border-border/30">
        <div className="flex items-center gap-3 mb-1">
          <h2 className="text-3xl font-bold tracking-tight">Time Logs</h2>
          <Badge className="rounded-full px-3 py-1 text-xs font-semibold bg-primary/20 text-primary border border-primary/30">
            {isLoading ? "—" : logs.length} Total Logs
          </Badge>
          {isAdmin && (
            <Badge className="rounded-full px-3 py-1 text-xs font-semibold bg-primary text-primary-foreground">
              Admin Mode Active
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          Track community service hours - start and end times
        </p>
      </div>

      {/* --- TABLE CONTENT --- */}
      <Suspense fallback={
        <div className="h-32 w-full flex items-center justify-center">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      }>
        <TimeLogsTable />
      </Suspense>

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