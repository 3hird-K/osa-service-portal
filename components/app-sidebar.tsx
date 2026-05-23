"use client";

import * as React from "react";
import {
  IconLayoutDashboard,
  IconUsersGroup,
  IconClock,
  IconSettings,
  IconHelpCircle,
  IconClipboardList
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
import LogoLight from "@/assets/osa-dark.png";
import LogoDark from "@/assets/osalogo.png";

const staticData = {
  navMain: [],
  navSecondary: [
    { title: "Settings", url: "/protected/settings", icon: IconSettings },
    { title: "Get Help", url: "/protected/get-help", icon: IconHelpCircle },
  ],
  documents: [
    { name: "Dashboard", url: "/protected", icon: IconLayoutDashboard },
    { name: "Manage Users", url: "/protected/manage-users", icon: IconUsersGroup },
    { name: "Manage Tasks", url: "/protected/manage-tasks", icon: IconClipboardList },
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
    <Sidebar
      collapsible="icon"
      className="border-r-0 bg-sidebar"
      {...props}
    >
      <SidebarHeader className="space-y-6 pt-8 pb-4 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:items-center">
        <div className="flex items-center gap-3 px-4 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:justify-center">
          <a href="/" className="flex items-center gap-3 w-full overflow-hidden group-data-[collapsible=icon]:w-auto group-data-[collapsible=icon]:justify-center transition-all duration-300 group/link">
            <div className="relative group flex h-12 w-12 group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-8 shrink-0 items-center justify-center rounded-2xl group-data-[collapsible=icon]:rounded-lg bg-gradient-to-br from-card to-muted border border-border/40 shadow-2xl transition-all duration-500 -rotate-3 group-hover/link:rotate-3 hover:scale-105 overflow-hidden">
              <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover/link:opacity-100 transition-opacity" />
              <Image
                src={LogoLight}
                alt="Osa Logo"
                width={36}
                height={36}
                className="block dark:hidden object-contain relative z-10 transition-all duration-500 group-hover/link:scale-110 group-data-[collapsible=icon]:w-5 group-data-[collapsible=icon]:h-5 -rotate-3 group-hover/link:rotate-6"
              />
              <Image
                src={LogoDark}
                alt="Osa Logo"
                width={36}
                height={36}
                className="hidden dark:block object-contain relative z-10 transition-all duration-500 group-hover/link:scale-110 group-data-[collapsible=icon]:w-5 group-data-[collapsible=icon]:h-5 -rotate-3 group-hover/link:rotate-6"
              />
            </div>
            <div className="flex flex-col group-data-[collapsible=icon]:hidden opacity-100 transition-all duration-300">
              <span className="font-black text-lg leading-none tracking-tight text-foreground/90 uppercase">
                OSA Portal
              </span>
              <span className="text-[9px] font-black text-primary uppercase tracking-[0.2em] mt-1 whitespace-nowrap opacity-80">
                Management System
              </span>
            </div>
          </a>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:items-center">
        <NavMain items={staticData.navMain} />
        <NavDocuments items={filteredDocuments} />
        <div className="mt-auto px-2 pb-4">
          <NavSecondary items={staticData.navSecondary} />
        </div>
      </SidebarContent>

      <SidebarFooter className="p-4 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:items-center bg-muted/20 border-t border-border/20">
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