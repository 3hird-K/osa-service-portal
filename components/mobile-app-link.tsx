import { ArrowRight, Github } from "lucide-react"
import Link from "next/link"

export function MobileAppLink() {
  return (
    <section className="w-full">
      <div className="rounded-lg border border-foreground/10 bg-gradient-to-br from-background to-muted p-8">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Github className="h-6 w-6" />
            <h2 className="text-2xl font-bold">Mobile App</h2>
          </div>
          <p className="text-foreground/70">
            Check out the OSA Service mobile app on GitHub. Built to provide seamless access on the go.
          </p>
          <div className="pt-4">
            <Link
              href="https://github.com/3hird-K/osa-service-mobile"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-md bg-foreground px-4 py-2 text-background font-semibold hover:bg-foreground/90 transition-colors"
            >
              View on GitHub
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
