"use client";

import { useEffect, useState } from "react";
import { IconUser, IconShieldCheck } from "@tabler/icons-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { DataTable2 } from "@/components/data-table2";

export default function ManageUsersPage() {
    const [studentsList, setStudentsList] = useState<any[]>([]);
    const [adminList, setAdminList] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setIsLoading(true);
                const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://server-osa-service.onrender.com";
                
                // Fetch students and admins in parallel
                const [studentsResponse, adminsResponse] = await Promise.all([
                    fetch(`${baseUrl}/students`),
                    fetch(`${baseUrl}/admins`)
                ]);

                console.log("Hello")
                console.log("hello", JSON.stringify(studentsResponse));
                console.log("hello", JSON.stringify(adminsResponse));
                
                if (!studentsResponse.ok) {
                    const studentError = await studentsResponse.text();
                    throw new Error(`Failed to fetch students (${studentsResponse.status}): ${studentError}`);
                }
                if (!adminsResponse.ok) {
                    const adminError = await adminsResponse.text();
                    throw new Error(`Failed to fetch admins (${adminsResponse.status}): ${adminError}`);
                }
                
                const [studentsData, adminsData] = await Promise.all([
                    studentsResponse.json(),
                    adminsResponse.json()
                ]);
                
                setStudentsList(studentsData);
                setAdminList(adminsData);
                setError(null);
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : "An error occurred";
                setError(errorMessage);
                console.error("Error fetching users:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, []);

    return (
        <div className="flex-1 space-y-6 p-8 pt-6 bg-background min-h-screen text-foreground">
            {/* Header Section */}
            <div className="flex items-center justify-between pb-4 border-b border-border/10">
                <div>
                    <h2 className="text-xl font-semibold tracking-tight text-white/90">
                        Manage Users <span className="text-muted-foreground font-normal">— Dashboard</span>
                    </h2>
                </div>
            </div>

            {/* Error Display */}
            {error && (
                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-600 text-sm">
                    Error: {error}
                </div>
            )}

            {/* Loading State */}
            {isLoading && (
                <div className="p-4 rounded-lg bg-muted/50 border border-border text-muted-foreground text-sm">
                    Loading users...
                </div>
            )}

            {/* Tabs & Datatable Section */}
            {!isLoading && (
                <Tabs defaultValue="students" className="space-y-6 pt-2">
                    <div className="flex items-center justify-between">
                        <TabsList className="bg-card border border-border p-1 rounded-lg h-12">
                            <TabsTrigger value="students" className="px-6 gap-2 h-9 data-[state=active]:bg-[#2c2d3c] data-[state=active]:text-white text-muted-foreground rounded-md transition-all">
                                <IconUser size={16} />
                                Students
                                <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-[10px] bg-background text-muted-foreground border-none">
                                    {studentsList.length}
                                </Badge>
                            </TabsTrigger>
                            <TabsTrigger value="admin" className="px-6 gap-2 h-9 data-[state=active]:bg-[#2c2d3c] data-[state=active]:text-white text-muted-foreground rounded-md transition-all">
                                <IconShieldCheck size={16} />
                                Admin
                                <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-[10px] bg-background text-muted-foreground border-none">
                                    {adminList.length}
                                </Badge>
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <div className="mt-2">
                        <TabsContent value="students" className="m-0 border-none p-0 outline-none">
                            <DataTable2 data={studentsList} />
                        </TabsContent>
                        <TabsContent value="admin" className="m-0 border-none p-0 outline-none">
                            <DataTable2 data={adminList} />
                        </TabsContent>
                    </div>
                </Tabs>
            )}
        </div>
    );
}
