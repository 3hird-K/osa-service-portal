import { UserButton } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import Image from "next/image";
import { Hero } from "@/components/hero";
import { TeamCarousel } from "@/components/team-carousel";
import { MobileAppLink } from "@/components/mobile-app-link";
import { WebAppLink } from "@/components/web-app-link";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { link } from "fs";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { IconBrandFacebook, IconBrandInstagram, IconBrandTiktok, IconBrandX } from "@tabler/icons-react";
import LogoLight from "@/assets/osa-dark.png";
import LogoDark from "@/assets/osalogo.png";


export default async function Home() {
  const { userId } = await auth();
  const user = await currentUser();
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-10 items-center">
        {/* Navbar */}
        <nav className="sticky top-0 z-50 w-full flex justify-center border-b border-border/40 bg-background/80 backdrop-blur-xl">
          <div className="w-full max-w-5xl flex justify-between items-center p-3 px-4 sm:px-6 h-16">
            <div className="flex items-center gap-3 font-semibold shrink-0">
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="relative flex items-center justify-center shrink-0">
                  <Image
                    src={LogoLight}
                    alt="Logo"
                    width={36}
                    height={36}
                    className="block dark:hidden rounded-lg object-contain transition-transform duration-500 group-hover:scale-110"
                  />
                  <Image
                    src={LogoDark}
                    alt="Logo"
                    width={36}
                    height={36}
                    className="hidden dark:block rounded-lg object-contain transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-extrabold text-sm sm:text-base tracking-tight text-foreground whitespace-nowrap leading-tight">
                    OSA <span className="hidden xs:inline">Service</span> Portal
                  </span>
                  <span className="text-[8px] sm:text-[9px] text-muted-foreground font-bold uppercase tracking-[0.15em] leading-none">
                    Management System
                  </span>
                </div>
              </Link>
            </div>

            <Suspense fallback={<div className="h-9 w-24 bg-muted/40 animate-pulse rounded-full" />}>
              <div className="flex items-center gap-2 sm:gap-4 ml-auto">
                {!userId ? (
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <Button variant="ghost" size="sm" asChild className="h-9 px-3 sm:px-4 rounded-full text-xs sm:text-sm font-semibold transition-all">
                      <Link href="/auth/login">Sign In</Link>
                    </Button>
                    <Button size="sm" asChild className="h-9 px-3 sm:px-4 rounded-full text-xs sm:text-sm font-bold shadow-md shadow-primary/10 transition-all active:scale-95">
                      <Link href="/auth/sign-up">Sign Up</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 pl-3 pr-1.5 py-1 rounded-full bg-muted/40 border border-border/40 hover:bg-muted/60 transition-all group">
                    <div className="hidden sm:flex flex-col items-end px-1">
                      <span className="text-[11px] font-bold text-foreground leading-tight">
                        {user?.firstName}
                      </span>
                      <span className="text-[9px] text-muted-foreground font-medium leading-tight opacity-70 truncate max-w-[80px]">
                        {user?.emailAddresses[0].emailAddress}
                      </span>
                    </div>
                    <UserButton />
                  </div>
                )}
                <div className="h-6 w-px bg-border/20 mx-1 hidden xs:block" />
                <ThemeSwitcher />
              </div>
            </Suspense>
          </div>
        </nav>

        {/* Page Content */}
        <div className="flex-1 w-full flex flex-col gap-10 sm:gap-20 max-w-5xl p-5">
          <div data-aos="fade-up">
            <Hero />
          </div>
          <div data-aos="fade-up" data-aos-delay="100">
            <TeamCarousel />
          </div>
          <div data-aos="fade-right" data-aos-delay="200">
            <MobileAppLink />
          </div>
          <div data-aos="fade-left" data-aos-delay="300">
            <WebAppLink />
          </div>
        </div>

        {/* Footer */}
        <footer className="w-full border-t bg-muted/20 pb-12 pt-20">
          <div className="max-w-5xl mx-auto px-5 grid gap-12 md:grid-cols-3">
            {/* Brand Section */}
            <div className="flex flex-col gap-6" data-aos="fade-up">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-background flex items-center justify-center shadow-sm border border-border/50 overflow-hidden">
                  <Image src={LogoLight} alt="OSA Logo" width={28} height={28} className="block dark:hidden rounded-md object-contain" />
                  <Image src={LogoDark} alt="OSA Logo" width={28} height={28} className="hidden dark:block rounded-md object-contain" />
                </div>
                <span className="font-bold text-lg tracking-tight">OSA Portal</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed max-w-xs">
                The official administrative hub for USTP's QR-based service tracking and student engagement.
              </p>
            </div>

            {/* Social Links */}
            <div className="flex flex-col gap-6 md:items-center" data-aos="fade-up" data-aos-delay="100">
              <div className="w-full md:w-auto">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/50 block mb-4">Connect with us</span>
                <div className="flex gap-3">
                  {[
                    { icon: IconBrandFacebook, href: "https://www.facebook.com/ustposacdo", label: "Facebook" },
                    { icon: IconBrandInstagram, href: "https://www.instagram.com/ustposacdo/", label: "Instagram" },
                    { icon: IconBrandTiktok, href: "https://www.tiktok.com/@ustposacdo", label: "TikTok" },
                    { icon: IconBrandX, href: "https://x.com/osaustpcdo", label: "X" },
                  ].map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      className="h-10 w-10 rounded-full bg-background border border-border/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all shadow-sm"
                      aria-label={social.label}
                    >
                      <social.icon size={20} stroke={1.5} />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Attribution & Theme */}
            <div className="flex flex-col gap-6 md:items-end" data-aos="fade-up" data-aos-delay="200">
              <div className="w-full md:w-auto flex flex-col md:items-end">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/50 block mb-4">Interface</span>
                <div className="flex items-center gap-4">
                  <div className="text-[10px] text-muted-foreground text-left md:text-right leading-tight font-medium">
                    Built for USTP by{" "}
                    <a href="https://github.com/3hird-K" target="_blank" rel="noreferrer" className="font-bold text-foreground hover:underline tracking-tight">USTP student</a>
                  </div>
                  {/* <div className="h-8 w-[1px] bg-border/50 hidden md:block" /> */}
                  {/* <ThemeSwitcher /> */}
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-5xl mx-auto px-5 mt-20 pt-8 border-t border-border/20 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-muted-foreground/60 font-bold uppercase tracking-[0.3em]">
            <span>© {new Date().getFullYear()} USTP OSA PORTAL</span>
            <span className="hidden md:block opacity-30">•</span>
            <span>All Rights Reserved</span>
          </div>
        </footer>
      </div>
    </main>
  );
}
