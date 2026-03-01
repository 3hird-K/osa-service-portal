"use client";

import * as React from "react";
import { IconUsers, IconUser, IconUserCheck, IconShieldCheck } from "@tabler/icons-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { DataTable2 } from "@/components/data-table2";

const allUsersData = [
    { id: 1, firstname: "Emma", lastname: "Myers", avatar_url: "", account_type: "User", updated_at: "2026-03-01T10:00:00Z" },
    { id: 2, firstname: "Jenna", lastname: "Ortega", avatar_url: "", account_type: "User", updated_at: "2026-03-01T11:00:00Z" },
    { id: 3, firstname: "Gabimaru", lastname: "Hollow", avatar_url: "", account_type: "User", updated_at: "2026-03-02T09:00:00Z" },
    { id: 4, firstname: "Grant", lastname: "Gustin", avatar_url: "", account_type: "Staff", updated_at: "2026-03-02T10:30:00Z" },
    { id: 5, firstname: "Linda", lastname: "Walker", avatar_url: "", account_type: "Staff", updated_at: "2026-03-02T08:15:00Z" },
    { id: 6, firstname: "Tina", lastname: "Tamashiro", avatar_url: "", account_type: "User", updated_at: "2026-03-02T12:00:00Z" },
    { id: 7, firstname: "Neil", lastname: "Dime", avatar_url: "", account_type: "Admin", updated_at: "2026-03-01T14:45:00Z" },
    { id: 8, firstname: "Iezhera", lastname: "Sajol", avatar_url: "", account_type: "Staff", updated_at: "2026-03-02T13:10:00Z" },
    { id: 9, firstname: "Daniel", lastname: "Palle", avatar_url: "", account_type: "Admin", updated_at: "2026-03-02T14:20:00Z" },
    { id: 10, firstname: "Car", lastname: "Lo", avatar_url: "", account_type: "User", updated_at: "2026-03-02T15:30:00Z" },
    { id: 11, firstname: "Sadie", lastname: "Sink", avatar_url: "", account_type: "User", updated_at: "2026-03-02T16:00:00Z" },
    { id: 12, firstname: "Millie Bobby", lastname: "Brown", avatar_url: "", account_type: "Staff", updated_at: "2026-03-02T16:45:00Z" },
    { id: 13, firstname: "Finn", lastname: "Wolfhard", avatar_url: "", account_type: "User", updated_at: "2026-03-02T17:15:00Z" },
    { id: 14, firstname: "Tom", lastname: "Holland", avatar_url: "", account_type: "User", updated_at: "2026-03-02T18:00:00Z" },
    { id: 15, firstname: "Zendaya", lastname: "Maree", avatar_url: "", account_type: "Staff", updated_at: "2026-03-02T18:30:00Z" },
    { id: 16, firstname: "Chris", lastname: "Evans", avatar_url: "", account_type: "Admin", updated_at: "2026-03-02T19:00:00Z" },
    { id: 17, firstname: "Scarlett", lastname: "Johansson", avatar_url: "", account_type: "User", updated_at: "2026-03-02T19:30:00Z" },
    { id: 18, firstname: "Robert", lastname: "Downey Jr.", avatar_url: "", account_type: "User", updated_at: "2026-03-02T20:00:00Z" },
    { id: 19, firstname: "Chris", lastname: "Hemsworth", avatar_url: "", account_type: "Staff", updated_at: "2026-03-02T20:30:00Z" },
    { id: 20, firstname: "Mark", lastname: "Ruffalo", avatar_url: "", account_type: "User", updated_at: "2026-03-02T21:00:00Z" },
];


export default function ManageUsersPage() {
    const usersList = allUsersData.filter(u => u.account_type === "User");
    const staffList = allUsersData.filter(u => u.account_type === "Staff");
    const adminList = allUsersData.filter(u => u.account_type === "Admin");

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

            {/* Tabs & Datatable Section */}
            <Tabs defaultValue="users" className="space-y-6 pt-2">
                <div className="flex items-center justify-between">
                    <TabsList className="bg-card border border-border p-1 rounded-lg h-12">
                        <TabsTrigger value="users" className="px-6 gap-2 h-9 data-[state=active]:bg-[#2c2d3c] data-[state=active]:text-white text-muted-foreground rounded-md transition-all">
                            <IconUser size={16} />
                            Users
                            <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-[10px] bg-background text-muted-foreground border-none">
                                {usersList.length}
                            </Badge>
                        </TabsTrigger>
                        <TabsTrigger value="staff" className="px-6 gap-2 h-9 data-[state=active]:bg-[#2c2d3c] data-[state=active]:text-white text-muted-foreground rounded-md transition-all">
                            <IconUserCheck size={16} />
                            Staff
                            <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-[10px] bg-background text-muted-foreground border-none">
                                {staffList.length}
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
                    <TabsContent value="users" className="m-0 border-none p-0 outline-none">
                        <DataTable2 data={usersList} />
                    </TabsContent>
                    <TabsContent value="staff" className="m-0 border-none p-0 outline-none">
                        <DataTable2 data={staffList} />
                    </TabsContent>
                    <TabsContent value="admin" className="m-0 border-none p-0 outline-none">
                        <DataTable2 data={adminList} />
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    );
}
