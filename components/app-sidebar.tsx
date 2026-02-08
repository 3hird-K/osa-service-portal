"use client";

import * as React from "react";
import { 
  IconBooks, 
  IconBuildingArch, 
  IconSettings2, 
  IconHelpCircle,
  IconDashboard, 
} from "@tabler/icons-react";

import { NavDocuments } from "@/components/nav-documents";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import { useProfile } from "@/hooks/use-profile";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image"
import Logo from "@/assets/image.png"

const staticData = {
  navMain: [],
  navSecondary: [
    { title: "Settings", url: "/settings", icon: IconSettings2 },
    { title: "Get Help", url: "/help", icon: IconHelpCircle },
  ],
  documents: [
    { name: "Dashboard", url: "/protected/dashboard", icon: IconDashboard },
    { name: "Library", url: "/protected", icon: IconBuildingArch },
    { name: "My Shelf", url: "/protected/shelf", icon: IconBooks },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: profile, isLoading } = useProfile();

  const filteredDocuments = React.useMemo(() => {
    if (!profile) return staticData.documents;

    if (profile.account_type === "User") {
      return staticData.documents.filter((doc) => doc.name !== "Dashboard");
    }

    return staticData.documents;
  }, [profile]);

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5 h-auto">
              <a href="/">
                <div className="flex w-full justify-center py-4">
                  <Image
                    src={Logo}
                    alt="BookVault Logo"
                    width={200}
                    height={200}
                    className="block object-contain"
                  />
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={staticData.navMain} />
        
        {/* Pass the FILTERED items here instead of staticData.documents */}
        {isLoading ? (
           <div className="px-4 space-y-2 mt-4">
             <Skeleton className="h-8 w-full" />
             <Skeleton className="h-8 w-full" />
           </div>
        ) : (
          <NavDocuments items={filteredDocuments} />
        )}

        <NavSecondary items={staticData.navSecondary} className="mt-auto" />
      </SidebarContent>

      <SidebarFooter>
        {isLoading ? (
          <div className="p-4">
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>
        ) : (
          <NavUser 
            user={{
              id: profile?.id ?? "",
              firstName: profile?.firstname || "User",
              lastName: profile?.lastname || "",
              email: profile?.email || "",
              avatar: profile?.avatar_url || "",
              account_type: profile?.account_type || "User",
            }} 
          />
        )}
      </SidebarFooter>
    </Sidebar>
  );
}