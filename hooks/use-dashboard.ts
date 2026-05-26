"use client"

import { useQuery } from "@tanstack/react-query"

export interface DashboardStats {
  total_users: number
  total_tasks: number
  completed_tasks: number
  pending_tasks: number
  total_hours: number
  staff_count: number
  recent_logs: any[]
  chart_data: { name: string; users: number; tasks: number; hours: number }[]
}

export function useDashboardStats() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://server-osa-service.onrender.com"

  return useQuery<DashboardStats>({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const response = await fetch(`${apiUrl}/dashboard/stats`)
      if (!response.ok) {
        throw new Error("Failed to fetch dashboard statistics")
      }
      return response.json()
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  })
}
