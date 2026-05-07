"use client";

import { useState } from "react";
import { IconDotsVertical, IconLogout, IconUserCircle } from "@tabler/icons-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { EditAccountDialog } from "./edit-account-dialog";

export function NavUser({
  user,
}: {
  user: {
    id: string;
    email: string;
    avatar: string;
    firstName: string;
    lastName: string;
    account_type: string;
  };
}) {
  const { isMobile } = useSidebar();
  const router = useRouter();
  const { signOut } = useClerk();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const logout = async () => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://server-osa-service.onrender.com";
    try {
      // Notify backend that user is logging out
      await fetch(`${baseUrl}/users/${user.id}/logout`, { method: "POST" });
    } catch (error) {
      console.error("Failed to notify backend of logout", error);
    }
    await signOut({ redirectUrl: "/auth/login" });
  };

  // Logic to get initials safely
  const initials = `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase() || "??";
  const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User";

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="h-14 group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-8 rounded-2xl group-data-[collapsible=icon]:rounded-lg bg-card/40 border border-border/20 backdrop-blur-sm shadow-xl transition-all duration-300 hover:bg-muted/50 data-[state=open]:bg-primary/10 data-[state=open]:text-primary data-[state=open]:border-primary/20 px-3 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:mx-0"
              >
                <div className="relative shrink-0 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-full h-full">
                    <Avatar className="h-9 w-9 group-data-[collapsible=icon]:h-6 group-data-[collapsible=icon]:w-6 rounded-xl group-data-[collapsible=icon]:rounded-lg border-2 border-border shadow-sm transition-transform group-hover:scale-105">
                      <AvatarImage 
                        key={user.avatar} 
                        src={user.avatar} 
                        alt={fullName} 
                        className="object-cover"
                      />
                      <AvatarFallback className="rounded-xl bg-primary/10 text-primary font-black text-[10px] group-data-[collapsible=icon]:text-[8px]">{initials}</AvatarFallback>
                    </Avatar>
                    <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 group-data-[collapsible=icon]:h-2 group-data-[collapsible=icon]:w-2 rounded-full bg-emerald-500 ring-2 ring-background shadow-lg" />
                </div>
                
                <div className="grid flex-1 text-left text-sm leading-tight ml-2 group-data-[collapsible=icon]:hidden">
                  <span className="truncate font-black text-[11px] uppercase tracking-wider text-foreground/90">{fullName}</span>
                  <span className="text-[9px] font-black text-primary uppercase tracking-[0.15em] opacity-70">
                    {user.account_type}
                  </span>
                </div>
                <IconDotsVertical className="ml-auto size-4 text-muted-foreground group-data-[collapsible=icon]:hidden" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-64 rounded-2xl bg-background/95 backdrop-blur-2xl border-border/40 shadow-2xl p-2"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={8}
            >
              <DropdownMenuLabel className="p-3 font-normal">
                <div className="flex items-center gap-3 text-left">
                  <Avatar className="h-10 w-10 rounded-xl border border-border shadow-sm">
                    <AvatarImage src={user.avatar} alt={fullName} className="object-cover" />
                    <AvatarFallback className="rounded-xl bg-primary/10 text-primary font-black">{initials}</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left leading-tight">
                    <span className="truncate font-black text-xs uppercase tracking-wider">{fullName}</span>
                    <span className="text-[10px] text-muted-foreground font-medium truncate mt-0.5">{user.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border/40 my-1" />
              <DropdownMenuGroup className="p-1">
                <DropdownMenuItem onSelect={() => setIsDialogOpen(true)} className="rounded-xl px-3 py-2 text-xs font-bold gap-3 focus:bg-primary/10 focus:text-primary transition-colors cursor-pointer">
                  <IconUserCircle className="size-4" />
                  Account Settings
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator className="bg-border/40 my-1" />
              <DropdownMenuItem onClick={logout} className="rounded-xl px-3 py-2 text-xs font-bold gap-3 text-destructive focus:bg-destructive/10 focus:text-destructive transition-colors cursor-pointer">
                <IconLogout className="size-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      <EditAccountDialog 
        user={user} 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
      />
    </>
  );
}