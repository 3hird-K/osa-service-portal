import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ThemeSwitcher } from "./theme-switcher"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 flex h-(--header-height) shrink-0 items-center gap-2 border-b border-border/40 bg-background/80 backdrop-blur-xl transition-all ease-in-out group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-3 px-4 sm:px-6">
        <div className="flex items-center gap-1.5">
          <SidebarTrigger className="-ml-1 hover:bg-muted/50 rounded-lg transition-colors size-8" />
          <div className="h-4 w-px bg-border/40 mx-2 hidden sm:block" />
        </div>

        <div className="flex flex-col">
          <h1 className="text-sm font-bold tracking-tight text-foreground/50 uppercase">
            USTP DASHBOARD
          </h1>
        </div>

        <div className="ml-auto flex items-center gap-2 sm:gap-4">
          <div className="h-8 w-px bg-border/20 mx-1 hidden sm:block" />
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  )
}
