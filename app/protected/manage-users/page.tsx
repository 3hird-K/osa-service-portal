"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { IconUser, IconShieldCheck } from "@tabler/icons-react";
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { DataTable2 } from "@/components/data-table2";
import { Skeleton } from "@/components/ui/skeleton";
import { useProfile } from "@/hooks/use-profile";

const TableSkeleton = () => (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="grid grid-cols-5 gap-4 p-4 border-b border-border bg-muted/30">
            {["w-16", "w-20", "w-20", "w-32", "w-16"].map((w, i) => (
                <Skeleton key={i} className={`h-4 ${w}`} />
            ))}
        </div>
        {[...Array(5)].map((_, i) => (
            <div key={i} className="grid grid-cols-5 gap-4 p-4 items-center border-b border-border last:border-0">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-6 w-16 rounded-full" />
            </div>
        ))}
    </div>
);

export default function ManageUsersPage() {
    const [roleFilter, setRoleFilter] = useState("all");
    const { data: profile } = useProfile();

    const isAdmin = profile?.account_type?.toLowerCase() === "admin";

    const { data: allUsers = [], isLoading, error, refetch: fetchUsers } = useQuery({
        queryKey: ["manage-users-list"],
        queryFn: async () => {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://server-osa-service.onrender.com";
            const [studentsRes, adminsRes] = await Promise.all([
                fetch(`${baseUrl}/students`),
                fetch(`${baseUrl}/admins`),
            ]);

            if (!studentsRes.ok || !adminsRes.ok) {
                console.warn("Backend fetch failed, using empty data");
            }

            const [students, admins] = await Promise.all([
                studentsRes.ok ? studentsRes.json() : Promise.resolve([]),
                adminsRes.ok ? adminsRes.json() : Promise.resolve([]),
            ]);

            const merged = [...admins, ...students];
            const seen = new Set();
            return merged.filter((u: any) => {
                if (!u.id || seen.has(u.id)) return false;
                seen.add(u.id);
                return true;
            });
        },
        refetchInterval: 10000,
    });

    const students = allUsers.filter((u: any) => u.account_type?.toLowerCase() !== "admin");
    const admins = allUsers.filter((u: any) => u.account_type?.toLowerCase() === "admin");

    return (
        <div className="flex-1 space-y-6 p-8 pt-6 bg-background min-h-screen text-foreground">
            {/* Header */}
            <div className="pb-4 border-b border-border/30">
                <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-3xl font-bold tracking-tight">Manage Users</h2>
                    <Badge className="rounded-full px-3 py-1 text-xs font-semibold bg-primary/20 text-primary border border-primary/30">
                        {isLoading ? "—" : allUsers.length} Total Profiles
                    </Badge>
                    {isAdmin && (
                        <Badge className="rounded-full px-3 py-1 text-xs font-semibold bg-primary text-primary-foreground">
                            Admin Mode Active
                        </Badge>
                    )}
                </div>
                <p className="text-sm text-muted-foreground">
                    {isAdmin
                        ? "You have administrative rights. You can upgrade roles, delete app data, and manage personnel."
                        : "Viewing all registered users. Contact an admin to make changes."}
                </p>
            </div>

            {error && (
                <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm">
                    Error: {error instanceof Error ? error.message : "An error occurred"}
                </div>
            )}

            {/* Table Area */}
            <div className="mt-2">
                {isLoading ? (
                    <TableSkeleton />
                ) : (
                    <DataTable2 
                        data={roleFilter === "all" ? allUsers : roleFilter === "admin" ? admins : students} 
                        onRefresh={fetchUsers}
                        extraControls={
                            <Select defaultValue="all" onValueChange={(v) => setRoleFilter(v)}>
                                <SelectTrigger className="w-[180px] bg-card border-border h-10 rounded-lg">
                                    <SelectValue placeholder="Filter by role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Users</SelectItem>
                                    <SelectItem value="student">Students</SelectItem>
                                    <SelectItem value="admin">Admins</SelectItem>
                                </SelectContent>
                            </Select>
                        }
                    />
                )}
            </div>
        </div>
    );
}