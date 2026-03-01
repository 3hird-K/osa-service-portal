"use client"

import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { TimeLogsTable } from "@/components/time-logs-table"

export default function LibraryPage() {
  return (
    <div className="flex-1 space-y-8 p-4 md:p-8 pt-6 min-h-screen bg-background text-foreground">
      {/* --- PAGE TITLE SECTION --- */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <h1 className="text-4xl font-extrabold tracking-tight">Time Logs</h1>
          <Badge variant="secondary" className="h-6 rounded-full px-3 font-bold bg-primary/10 text-primary border-none">
            20 Total Hours: 87
          </Badge>
        </div>
        <p className="text-muted-foreground text-sm">
          Track community service hours - start and end times
        </p>
      </div>

      <Separator className="border-t border-border opacity-50 block h-[1px] w-full" />

      {/* --- TABLE CONTENT --- */}
      <TimeLogsTable />

    </div>
  )
}