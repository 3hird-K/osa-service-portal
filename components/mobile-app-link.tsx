import { ArrowRight, Github } from "lucide-react"
import Link from "next/link"

export function MobileAppLink() {
  return (
    <section className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-4xl mx-auto my-6 sm:my-8 lg:my-12 px-3 sm:px-4 lg:px-6">
      <div className="rounded-lg border border-foreground/10 bg-gradient-to-br from-background to-muted p-4 sm:p-5 md:p-6 lg:p-8">
        <div className="flex flex-col gap-3 sm:gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <Github className="h-6 w-6 flex-shrink-0" />
            <h2 className="text-xl sm:text-2xl font-bold break-words">Mobile App</h2>
          </div>
          <p className="text-foreground/70 break-words leading-relaxed">
            Check out the OSA Service mobile app on GitHub. Built to provide seamless access on the go.
          </p>
          <div className="pt-4">
            <Link
              href="https://github.com/3hird-K/osa-service-mobile"
              target="_blank"
              rel="noreferrer"
              className="inline-flex flex-wrap items-center gap-2 rounded-md bg-foreground px-4 py-2 text-background font-semibold hover:bg-foreground/90 transition-colors"
            >
              View on GitHub
              <ArrowRight className="h-4 w-4 flex-shrink-0" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
