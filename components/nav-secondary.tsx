"use client"

import * as React from "react"
import { type Icon } from "@tabler/icons-react"
import { usePathname } from "next/navigation"
import Link from "next/link"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavSecondary({
  items,
  ...props
}: {
  items: {
    title: string
    url: string
    icon: Icon
  }[]
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const pathname = usePathname()
  return (
    <SidebarGroup {...props} className="py-2 group-data-[collapsible=icon]:p-0">
      <SidebarGroupContent>
        <SidebarMenu className="gap-1.5 px-2 group-data-[collapsible=icon]:px-0">
          {items.map((item) => {
            const isActive = pathname === item.url || (item.url !== "/" && item.url !== "/protected" && pathname.startsWith(item.url + "/"))
            
            return (
              <SidebarMenuItem key={item.title} className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
                <SidebarMenuButton 
                  asChild 
                  isActive={isActive}
                  tooltip={item.title}
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
                    <span className="font-bold text-[11px] uppercase tracking-wider group-data-[collapsible=icon]:hidden">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
