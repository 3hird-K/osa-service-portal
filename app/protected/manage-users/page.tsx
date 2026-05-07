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
import { UsersTable } from "@/components/users-table";
import { useProfile } from "@/hooks/use-profile";

export default function ManageUsersPage() {
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

    return (
        <div className="flex-1 space-y-8 p-8 pt-6 bg-background min-h-screen text-foreground">
            {/* Premium Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
                <div className="space-y-1">
                    <div className="flex items-center gap-3 mb-1">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">
                            User List
                        </p>
                        <Badge variant="outline" className="rounded-full px-3 py-0.5 text-[9px] font-black uppercase tracking-widest bg-primary/5 text-primary border-primary/20">
                            Live
                        </Badge>
                    </div>
                    <h2 className="text-4xl font-black tracking-tight bg-gradient-to-r from-foreground to-foreground/50 bg-clip-text text-transparent uppercase">
                        Users
                    </h2>
                    <p className="text-sm text-muted-foreground font-medium max-w-2xl">
                        {isAdmin
                            ? "View and manage user accounts, roles, and permissions."
                            : "List of all active participants."}
                    </p>
                </div>

                {isAdmin && (
                    <Badge variant="outline" className="h-12 px-6 rounded-xl bg-primary/5 text-primary border-primary/20 font-black uppercase text-[10px] tracking-widest flex items-center gap-2 shadow-lg shadow-primary/5 hover:bg-primary/10 transition-colors">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        Admin Privileges Active
                    </Badge>
                )}
            </div>

            {error && (
                <div className="p-4 rounded-xl bg-destructive/5 border border-destructive/10 text-destructive text-sm font-bold flex items-center gap-3">
                    <IconShieldCheck className="h-5 w-5" />
                    <span>Error: {error instanceof Error ? error.message : "Failed to load users"}</span>
                </div>
            )}

            {/* Table Area */}
            <UsersTable 
                data={allUsers} 
                isLoading={isLoading} 
                isAdmin={isAdmin} 
                onRefresh={fetchUsers} 
            />
        </div>
    );
}