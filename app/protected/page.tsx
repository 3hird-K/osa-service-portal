"use client";

import * as React from "react";
import { IconUsers, IconLayoutDashboard, IconActivity } from "@tabler/icons-react";
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
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

const chartData = [
  { name: "Dec 2", users: 0 },
  { name: "Dec 7", users: 2 },
  { name: "Dec 12", users: 4 },
  { name: "Dec 17", users: 4 },
  { name: "Dec 22", users: 9 },
  { name: "Dec 27", users: 9 },
  { name: "Jan 1", users: 9 },
  { name: "Jan 6", users: 9 },
  { name: "Jan 11", users: 9 },
  { name: "Jan 16", users: 9 },
  { name: "Jan 21", users: 9 },
  { name: "Jan 26", users: 9 },
  { name: "Jan 31", users: 9 },
  { name: "Feb 5", users: 9 },
  { name: "Feb 10", users: 9 },
  { name: "Feb 15", users: 9 },
  { name: "Feb 20", users: 9 },
  { name: "Feb 25", users: 9 },
  { name: "Mar 2", users: 9 },
];

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-6 p-8 pt-6 bg-background min-h-screen text-foreground">
      {/* Header Section */}
      <div className="flex items-center justify-between pb-4 border-b border-border/10">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-white/90">
            OSA Service Portal <span className="text-muted-foreground font-normal">— USTP Dashboard</span>
          </h2>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 pt-4">
        {/* Total Properties (Users equivalent) */}
        <Card className="bg-card border-border shadow-md rounded-xl overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-transparent pointer-events-none" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <div className="flex items-center gap-2">
              <IconUsers className="h-4 w-4 text-indigo-400" />
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold mb-4">1,248</div>
            <div className="flex items-center gap-2">
              <span className="flex items-center text-xs text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded font-medium">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
                +12 this week
              </span>
            </div>
            <div className="mt-4 flex flex-col gap-1">
              <p className="text-xs text-emerald-500 flex items-center">
                Growth this week
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
              </p>
              <p className="text-[10px] text-muted-foreground">Updated Mar 2, 2026</p>
            </div>
          </CardContent>
        </Card>

        {/* Pending Verifications */}
        <Card className="bg-card border-border shadow-md rounded-xl overflow-hidden relative">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <div className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-400"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending Verifications</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold mb-4">24</div>
            <div className="flex items-center gap-2">
              <span className="flex items-center text-xs text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded font-medium">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
                +4 this week
              </span>
            </div>
            <div className="mt-4 flex flex-col gap-1">
              <p className="text-xs text-emerald-500 flex items-center">
                Growth this week
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
              </p>
              <p className="text-[10px] text-muted-foreground">Updated Mar 2, 2026</p>
            </div>
          </CardContent>
        </Card>

        {/* Verified Staff */}
        <Card className="bg-card border-border shadow-md rounded-xl overflow-hidden relative">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <div className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              <CardTitle className="text-sm font-medium text-muted-foreground">Verified Staff/Admin</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold mb-4">86</div>
            <div className="flex items-center gap-2">
              <span className="flex items-center text-xs text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded font-medium">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
                +0 this week
              </span>
            </div>
            <div className="mt-4 flex flex-col gap-1">
              <p className="text-xs text-emerald-500 flex items-center">
                Growth this week
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
              </p>
              <p className="text-[10px] text-muted-foreground">Updated Mar 2, 2026</p>
            </div>
          </CardContent>
        </Card>

        {/* Registered Users */}
        <Card className="bg-card border-border shadow-md rounded-xl overflow-hidden relative">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <div className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><polyline points="16 11 18 13 22 9"></polyline></svg>
              <CardTitle className="text-sm font-medium text-muted-foreground">Registered Users</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold mb-4">1,138</div>
            <div className="flex items-center gap-2">
              <span className="flex items-center text-xs text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded font-medium">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
                +18 this month
              </span>
            </div>
            <div className="mt-4 flex flex-col gap-1">
              <p className="text-xs text-emerald-500 flex items-center">
                Growth this month
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
              </p>
              <p className="text-[10px] text-muted-foreground">Updated Mar 2, 2026</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 mt-8">
        {/* Full Width Area Chart */}
        <Card className="bg-card border-border shadow-md pb-4 pt-6 rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-8">
            <div>
              <CardTitle className="text-xl font-bold mb-1">Total Users Trend</CardTitle>
              <CardDescription className="text-muted-foreground">Cumulative Total: <span className="font-bold text-foreground">1,248</span></CardDescription>
            </div>
            <div className="px-3 py-1.5 rounded-lg border border-border text-xs flex items-center gap-2 text-muted-foreground bg-[#1c1e29]">
              Total Users
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>
          </CardHeader>
          <CardContent className="pl-0 pr-6">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
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
                  domain={[0, 15]}
                />
                <Tooltip
                  cursor={{ stroke: 'rgba(255, 255, 255, 0.1)', strokeWidth: 1, strokeDasharray: '5 5' }}
                  contentStyle={{ backgroundColor: '#17181c', border: '1px solid #38444d', borderRadius: '8px', color: '#fff' }}
                />
                <Area type="step" dataKey="users" stroke="#f97316" strokeWidth={2} fillOpacity={1} fill="url(#colorUsers)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}