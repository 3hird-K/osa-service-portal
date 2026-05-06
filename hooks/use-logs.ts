import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

const API_URL = process.env.NEXT_PUBLIC_API_URL || (typeof window !== "undefined" && window.location.hostname === "localhost" ? "http://localhost:8000" : "https://server-osa-service.onrender.com")

export interface TimeLog {
    id: string
    task_id: string
    user_id: string
    date: string
    start_time: string
    break_time: string
    back_time: string
    end_time: string
    hours: string
    evidence_urls: string | null // JSON string
    task?: {
        title: string
    }
    user?: {
        firstname: string
        lastname: string
        email: string
    }
}

export function useLogs(taskId?: string) {
    const queryClient = useQueryClient()
    const endpoint = taskId ? `${API_URL}/tasks/${taskId}/logs` : `${API_URL}/timelogs`

    const { data: logs = [], isLoading, error, refetch } = useQuery<TimeLog[]>({
        queryKey: taskId ? ["logs", taskId] : ["logs"],
        queryFn: async () => {
            const res = await fetch(endpoint)
            if (!res.ok) throw new Error("Failed to fetch logs")
            return res.json()
        },
    })

    const createLog = useMutation({
        mutationFn: async (newLog: Partial<TimeLog>) => {
            const res = await fetch(`${API_URL}/timelogs`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newLog),
            })
            if (!res.ok) throw new Error("Failed to create log")
            return res.json()
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["logs"] })
            if (taskId) queryClient.invalidateQueries({ queryKey: ["logs", taskId] })
        },
    })

    return {
        logs,
        isLoading,
        error,
        refetch,
        createLog,
    }
}
