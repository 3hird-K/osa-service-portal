"use client"

import { type Icon } from "@tabler/icons-react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavDocuments({
  items,
}: {
  items: {
    name: string
    url: string
    icon: Icon
  }[]
}) {
  const pathname = usePathname()
  return (
    <SidebarGroup className="py-4">
      <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 mb-2 px-4">
        Service Management
      </SidebarGroupLabel>
      <SidebarMenu className="gap-1.5 px-2 group-data-[collapsible=icon]:px-0">
        {items.map((item) => {
          const isActive = pathname === item.url || (item.url !== "/" && item.url !== "/protected" && pathname.startsWith(item.url + "/"))
          
          return (
            <SidebarMenuItem key={item.name} className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
              <SidebarMenuButton 
                asChild 
                isActive={isActive}
                tooltip={item.name}
                className={`
                  h-11 rounded-xl transition-all duration-300 group/btn px-4
                  group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:mx-0
                  ${isActive 
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 hover:text-primary-foreground" 
                    : "hover:bg-muted/50 hover:text-foreground text-muted-foreground"
                  }
                `}
              >
                <Link href={item.url} className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:w-full h-full">
                  <div className={`
                    p-1.5 rounded-lg transition-all duration-300 shrink-0
                    ${isActive ? "bg-white/20" : "bg-muted/30 group-hover/btn:bg-primary/10 group-hover/btn:text-primary"}
                  `}>
                    <item.icon className={`h-4 w-4 transition-transform duration-300 group-hover/btn:scale-110`} />
                  </div>
                  <span className="font-bold text-[11px] uppercase tracking-wider group-data-[collapsible=icon]:hidden">{item.name}</span>
                  {isActive && (
                    <div className="ml-auto w-1 h-4 bg-white/40 rounded-full group-data-[collapsible=icon]:hidden" />
                  )}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}