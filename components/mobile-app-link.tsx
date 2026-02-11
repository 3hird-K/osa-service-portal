import { ArrowRight, Github, Smartphone } from "lucide-react"
import Link from "next/link"

export function MobileAppLink() {
  return (
    <section className="w-full max-w-5xl mx-auto my-8 px-4 sm:px-12">
      <div className="relative overflow-hidden rounded-2xl border border-primary/10 bg-gradient-to-br from-card to-muted/50 p-5 sm:p-10 shadow-xl">
        
        {/* Background Decoration */}
        <Smartphone className="absolute -right-6 -top-6 h-32 w-32 text-primary/5 rotate-12 pointer-events-none sm:block hidden" />

        <div className="relative flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Github className="h-5 w-5" />
              </div>
              <h2 className="text-xl sm:text-3xl font-bold tracking-tight">Mobile App</h2>
            </div>
            
            {/* max-w-prose helps with readability on larger mobile screens */}
            <p className="text-muted-foreground text-[13px] leading-relaxed sm:text-base max-w-prose">
              Take the portal with you. Access the <span className="text-foreground font-medium">OSA Service</span> mobile app on GitHub, 
              featuring native QR scanning for instant service tracking and hour verification.
            </p>
          </div>

          <div className="w-full sm:w-auto">
            <Link
              href="https://github.com/3hird-K/osa-service-mobile"
              target="_blank"
              rel="noreferrer"
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-foreground px-6 py-3 text-sm font-bold text-background hover:bg-foreground/90 transition-all active:scale-[0.98] sm:w-fit sm:text-base"
            >
              View on GitHub
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}