"use client";

import * as React from "react";
import {
  IconLayoutDashboard,
  IconUsersGroup,
  IconClock,
  IconSettings,
  IconHelpCircle,
  IconDeviceLaptop
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
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image"
import Logo from "@/assets/imagess.png"

const staticData = {
  navMain: [],
  navSecondary: [
    { title: "Settings", url: "/protected/settings", icon: IconSettings },
    { title: "Get Help", url: "/protected/get-help", icon: IconHelpCircle },
  ],
  documents: [
    { name: "Dashboard", url: "/protected", icon: IconLayoutDashboard },
    { name: "Manage Users", url: "/protected/manage-users", icon: IconUsersGroup },
    { name: "Manage Devices", url: "/protected/manage-devices", icon: IconDeviceLaptop },
    { name: "Time logs", url: "/protected/manage-logs", icon: IconClock },
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
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="space-y-4 pt-6 pb-2">
        <div className="flex items-center gap-3 px-3 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:justify-center">
          <a href="/" className="flex items-center gap-3 w-full overflow-hidden group-data-[collapsible=icon]:w-auto group-data-[collapsible=icon]:justify-center">
            <div className="flex bg-[#1c1d22] p-2 rounded-xl border border-white/10 shadow-sm justify-center items-center shrink-0 transition-transform hover:scale-105">
              <Image
                src={Logo}
                alt="Osa Logo"
                width={28}
                height={28}
                className="block object-contain"
              />
            </div>
            <div className="flex flex-col group-data-[collapsible=icon]:hidden">
              <span className="font-bold text-base tracking-tight truncate text-foreground/90">
                OSA Service Portal
              </span>
              <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-widest truncate">
                Management System
              </span>
            </div>
          </a>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={staticData.navMain} />
        <NavDocuments items={filteredDocuments} />
        <NavSecondary items={staticData.navSecondary} className="mt-auto" />
      </SidebarContent>

      <SidebarFooter>
        <NavUser
          user={{
            id: profile?.id ?? "",
            firstName: profile?.firstname || "User",
            lastName: profile?.lastname || "",
            email: profile?.email || "hello@gmail.com",
            avatar: profile?.avatar_url || "",
            account_type: profile?.account_type || "student",
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}