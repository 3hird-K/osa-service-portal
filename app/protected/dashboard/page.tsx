"use client";

import * as React from "react";
import { DataTable } from "@/components/data-table";
import { DataTable2 } from "@/components/data-table2";
import { useBooks } from "@/hooks/use-books";
import { useUsers } from "@/hooks/use-users";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IconBook, IconUsers, IconLayoutDashboard } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";

export default function LibraryPage() {
  const { data: books, isLoading: isBooksLoading } = useBooks();
  const { data: users, isLoading: isUsersLoading } = useUsers();
  console.log("users:", users)
  console.log("books:", books)

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      {/* Header Section */}
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <IconLayoutDashboard className="text-primary" size={28} />
            Management Dashboard
          </h2>
          <p className="text-muted-foreground">
            Manage your library inventory and monitor member activity.
          </p>
        </div>
      </div>

      <Tabs defaultValue="books" className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList className="bg-muted/50 p-1 border">
            <TabsTrigger value="books" className="px-6 gap-2">
              <IconBook size={16} />
              Books
              <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-[10px]">
                {books?.length || 0}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="users" className="px-6 gap-2">
              <IconUsers size={16} />
              Users
              <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-[10px]">
                {users?.length || 0}
              </Badge>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Content Area with a subtle background and border */}
        <div className="rounded-xl border bg-card/50 backdrop-blur-sm p-6 shadow-sm">
          <TabsContent value="books" className="m-0 border-none p-0 outline-none">
            <div className="flex flex-col gap-4">
              <div>
                <h3 className="text-lg font-semibold">Book Inventory</h3>
                <p className="text-sm text-muted-foreground">Full catalog of available titles.</p>
              </div>
              {isBooksLoading ? <DataTableSkeleton /> : <DataTable data={books || []} />}
            </div>
          </TabsContent>

          <TabsContent value="users" className="m-0 border-none p-0 outline-none">
            <div className="flex flex-col gap-4">
              <div>
                <h3 className="text-lg font-semibold">Member Directory</h3>
                <p className="text-sm text-muted-foreground">Manage user profiles and permissions.</p>
              </div>
              {isUsersLoading ? <DataTableSkeleton /> : <DataTable2 data={users || []} />}
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

function DataTableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-9 w-[250px]" />
        <Skeleton className="h-9 w-[100px]" />
      </div>
      <div className="rounded-md border">
        <div className="h-10 border-b bg-muted/50" />
        <div className="p-4 space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-8 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}