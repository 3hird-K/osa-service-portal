"use client";

import * as React from "react";
import {
  IconUsers,
  IconClock,
  IconClipboardList,
  IconShieldCheck,
  IconArrowUpRight,
  IconLoader2,
  IconAlertCircle,
  IconExternalLink,
  IconActivity,
  IconMapPin,
  IconCalendar,
  IconUser,
  IconClipboardCheck,
  IconInfoCircle
} from "@tabler/icons-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { useDashboardStats } from "@/hooks/use-dashboard";
import { formatDistanceToNow, format } from "date-fns";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";


export default function DashboardPage() {
  const { data: stats, isLoading, isError, refetch } = useDashboardStats();
  const router = useRouter();
  const [selectedLog, setSelectedLog] = React.useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = React.useState(false);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen bg-background relative overflow-hidden">
        {/* Animated Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-pulse" />

        <div className="relative z-10 flex flex-col items-center max-w-sm text-center px-6">
          <div className="relative mb-8">
            <div className="h-24 w-24 rounded-full border-2 border-primary/20 flex items-center justify-center">
              <IconLoader2 className="h-10 w-10 text-primary animate-spin" />
            </div>
            <div className="absolute inset-0 rounded-full border-t-2 border-primary animate-[spin_1.5s_linear_infinite]" />
          </div>

          <h2 className="text-xl font-bold text-foreground mb-2">Waking up Service Engine</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The OSA server is resuming from a sleep state. This usually takes <span className="text-primary font-bold">15-30 seconds</span> on the free tier.
          </p>

          <div className="mt-8 w-full h-1 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary animate-[loading_20s_ease-in-out_infinite]" />
          </div>
          <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
            Initialising USTP Infrastructure...
          </p>
        </div>

        <style jsx global>{`
          @keyframes loading {
            0% { width: 0%; }
            50% { width: 70%; }
            100% { width: 95%; }
          }
        `}</style>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-4 max-w-md px-6">
          <div className="p-4 bg-destructive/10 rounded-full w-fit mx-auto">
            <IconAlertCircle className="h-10 w-10 text-destructive" />
          </div>
          <h2 className="text-xl font-bold tracking-tight">Sync Connection Failed</h2>
          <p className="text-muted-foreground text-sm">We couldn't connect to the OSA Service Engine. Please ensure the backend is operational and try again.</p>
          <button
            onClick={() => refetch()}
            className="px-8 py-2.5 bg-primary text-primary-foreground rounded-full text-sm font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
          >
            Retry Sync
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-8 pt-6 bg-background min-h-screen text-foreground">
      {/* Modernized Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2">
        <div className="space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary mb-1">
            USTP Management System
          </p>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/50 bg-clip-text text-transparent">
            {new Date().getHours() < 12 ? "Good Morning" : new Date().getHours() < 18 ? "Good Afternoon" : "Good Evening"}
          </h2>
          <p className="text-sm text-muted-foreground font-medium">
            Here's the operational overview for <span className="text-foreground">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden lg:flex flex-col items-end mr-2">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Server Status</p>
            <p className="text-[11px] font-medium text-emerald-500">Latency: 24ms</p>
          </div>
          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 gap-1.5 px-4 py-1.5 font-bold uppercase tracking-wider text-[10px] shadow-sm shadow-emerald-500/10">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live Sync
          </Badge>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 pt-4">
        {/* Total Users */}
        <Card className="bg-card border-border shadow-md rounded-2xl overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-transparent pointer-events-none" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <div className="flex items-center gap-2">
              <IconUsers className="h-4 w-4 text-indigo-400" />
              <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Total Service Users</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold mb-1">{stats?.total_users.toLocaleString()}</div>
            <div className="flex items-center gap-1.5 mt-4">
              <span className="text-[10px] font-bold text-indigo-400 bg-indigo-400/10 px-2 py-0.5 rounded-full">System Wide</span>
              <p className="text-[10px] text-muted-foreground">Updated just now</p>
            </div>
          </CardContent>
        </Card>

        {/* Total Service Hours */}
        <Card className="bg-card border-border shadow-md rounded-2xl overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-transparent pointer-events-none" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <div className="flex items-center gap-2">
              <IconClock className="h-4 w-4 text-amber-400" />
              <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Total Hours Logged</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold mb-1">{stats?.total_hours.toLocaleString()}h</div>
            <div className="flex items-center gap-1.5 mt-4">
              <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full">Cumulative</span>
              <p className="text-[10px] text-muted-foreground">Real-time count</p>
            </div>
          </CardContent>
        </Card>

        {/* Active Tasks */}
        <Card className="bg-card border-border shadow-md rounded-2xl overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent pointer-events-none" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <div className="flex items-center gap-2">
              <IconClipboardList className="h-4 w-4 text-blue-400" />
              <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Active Assignments</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold mb-1">{stats?.pending_tasks.toLocaleString()}</div>
            <div className="flex items-center gap-1.5 mt-4">
              <span className="text-[10px] font-bold text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded-full">In Progress</span>
              <p className="text-[10px] text-muted-foreground">{stats?.completed_tasks} Completed</p>
            </div>
          </CardContent>
        </Card>

        {/* Staff/Admin Count */}
        <Card className="bg-card border-border shadow-md rounded-2xl overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent pointer-events-none" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <div className="flex items-center gap-2">
              <IconShieldCheck className="h-4 w-4 text-emerald-400" />
              <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Administrative Staff</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold mb-1">{stats?.staff_count.toLocaleString()}</div>
            <div className="flex items-center gap-1.5 mt-4">
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">Verified Admins</span>
              <p className="text-[10px] text-muted-foreground">Management team</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 mt-6">
        {/* Chart Card */}
        <Card className="col-span-4 bg-card border-border shadow-md rounded-2xl overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold">Service Impact Analysis</CardTitle>
              <CardDescription className="text-xs">
                Correlation between Growth, Tasks, and Service Hours.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pl-0">
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={stats?.chart_data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="name"
                  stroke="#555"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#888" }}
                  dy={10}
                />
                <YAxis
                  stroke="#555"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                  tick={{ fill: "#888" }}
                  domain={[0, 'dataMax + 10']}
                />
                <Tooltip
                  cursor={{ stroke: 'rgba(255, 255, 255, 0.1)', strokeWidth: 1, strokeDasharray: '5 5' }}
                  contentStyle={{ backgroundColor: '#17181c', border: '1px solid #38444d', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
                <Area
                  type="monotone"
                  dataKey="users"
                  name="Users"
                  stroke="#f97316"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorUsers)"
                />
                <Area
                  type="monotone"
                  dataKey="tasks"
                  name="Completed Tasks"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorTasks)"
                />
                <Area
                  type="monotone"
                  dataKey="hours"
                  name="Service Hours"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorHours)"
                />
              </AreaChart>
            </ResponsiveContainer>

            {/* Custom Legend */}
            <div className="flex items-center justify-center gap-6 mt-4 border-t border-border/10 pt-4 px-4">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-[#f97316]" />
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">User Growth</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-[#3b82f6]" />
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Task Completion</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-[#10b981]" />
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Labor Hours</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity Card */}
        <Card className="col-span-3 bg-card border-border shadow-md rounded-2xl overflow-hidden flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div>
              <CardTitle className="text-base font-bold">System Activity</CardTitle>
              <CardDescription className="text-xs">Latest student field updates.</CardDescription>
            </div>
            <button
              onClick={() => router.push("/protected/manage-logs")}
              className="text-[10px] font-bold text-primary hover:underline underline-offset-4 uppercase tracking-widest cursor-pointer"
            >
              View All
            </button>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto px-4">
            <div className="space-y-4">
              {stats?.recent_logs && stats.recent_logs.length > 0 ? (
                stats.recent_logs.slice(0, 3).map((log) => (
                  <div
                    key={log.id}
                    onClick={() => { setSelectedLog(log); setIsDetailsOpen(true); }}
                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted/30 transition-colors group cursor-pointer"
                  >
                    <Avatar className="h-10 w-10 border border-border shadow-sm">
                      <AvatarImage src={log.user?.avatar_url} />
                      <AvatarFallback className="bg-muted text-xs font-bold uppercase tracking-tighter">
                        {log.user?.firstname?.[0]}{log.user?.lastname?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-bold text-foreground truncate">
                          {log.user?.firstname} {log.user?.lastname}
                        </p>
                        <span className="text-[10px] font-medium text-muted-foreground whitespace-nowrap">
                          {formatDistanceToNow(new Date(log.date), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                        Logged <span className="font-bold text-amber-500">{log.hours}</span> for <span className="text-primary font-medium">{log.task?.title}</span>
                      </p>
                      <div className="flex items-center gap-1.5 mt-2">
                        <Badge variant="outline" className="text-[9px] font-bold h-4 px-1.5 py-0 border-border/50 bg-muted/20">
                          {log.task?.location || "On-field"}
                        </Badge>
                        {log.evidence_urls && (
                          <Badge variant="outline" className="text-[9px] font-bold h-4 px-1.5 py-0 border-primary/20 bg-primary/5 text-primary">
                            Evidence Attached
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-40 flex flex-col items-center justify-center text-center space-y-2 opacity-40">
                  <IconActivity className="h-8 w-8" />
                  <p className="text-xs font-bold uppercase tracking-widest">No recent activity</p>
                </div>
              )}
            </div>
          </CardContent>
          <div className="p-4 border-t border-border/10 bg-muted/10 mt-auto">
            <button
              onClick={() => router.push("/protected/manage-tasks")}
              className="w-full flex items-center justify-center gap-2 py-2 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <IconArrowUpRight className="h-3.5 w-3.5" />
              Open Audit Logs
            </button>
          </div>
        </Card>
      </div>

      {/* Activity Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-md bg-card border-border rounded-2xl p-0 overflow-hidden">
          <DialogHeader className="p-6 pb-2">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <IconActivity className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold">Activity Details</DialogTitle>
                <DialogDescription className="text-xs">
                  Reviewing student field submission
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {selectedLog && (
            <div className="p-6 pt-2 space-y-6">
              {/* Student Info */}
              <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-2xl border border-border/50">
                <Avatar className="h-12 w-12 border-2 border-primary/20">
                  <AvatarImage src={selectedLog.user?.avatar_url} />
                  <AvatarFallback className="bg-primary/10 text-primary font-bold">
                    {selectedLog.user?.firstname?.[0]}{selectedLog.user?.lastname?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-bold text-foreground">
                    {selectedLog.user?.firstname} {selectedLog.user?.lastname}
                  </p>
                  <p className="text-xs text-muted-foreground">{selectedLog.user?.email}</p>
                </div>
                <Badge className="ml-auto bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20">
                  Verified Student
                </Badge>
              </div>

              {/* Log Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                    <IconCalendar className="h-3 w-3" /> Date Logged
                  </p>
                  <p className="text-sm font-semibold">
                    {format(new Date(selectedLog.date), "MMMM dd, yyyy")}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {formatDistanceToNow(new Date(selectedLog.date), { addSuffix: true })}
                  </p>
                </div>
                <div className="space-y-1.5">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                    <IconClock className="h-3 w-3" /> Time Rendered
                  </p>
                  <p className="text-sm font-black text-amber-500">
                    {selectedLog.hours} Hours
                  </p>
                </div>
              </div>

              {/* Task Details */}
              <div className="space-y-3 p-4 bg-muted/20 rounded-2xl border border-border/30">
                 <div className="flex items-center justify-between">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                      <IconClipboardCheck className="h-3 w-3" /> Related Task
                    </p>
                    <Badge variant="outline" className="text-[9px] font-bold h-4 px-1.5 py-0">
                      {selectedLog.task_id}
                    </Badge>
                 </div>
                 <p className="text-sm font-bold text-primary">{selectedLog.task?.title}</p>
                 <p className="text-xs text-muted-foreground leading-relaxed italic">
                   "{selectedLog.task?.description || "No task description available."}"
                 </p>
                 <div className="flex items-center gap-1.5 pt-2">
                    <IconMapPin className="h-3.5 w-3.5 text-zinc-500" />
                    <span className="text-xs font-medium text-zinc-500">{selectedLog.task?.location || "Field Assignment"}</span>
                 </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => setIsDetailsOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-zinc-800 text-zinc-100 text-xs font-bold hover:bg-zinc-700 transition-colors"
                >
                  Close Detail
                </button>
                <button 
                  onClick={() => router.push(`/protected/manage-logs?taskId=${selectedLog.task_id}`)}
                  className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  Full Audit Log <IconArrowUpRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}