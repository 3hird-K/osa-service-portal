import {
  ArrowRight,
  Github,
  Smartphone,
  QrCode,
  Clock,
  Shield,
  Wifi,
  Download,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { StatusIndicator } from "@/components/status-indicator";
import { FeatureCard } from "@/components/feature-card";
import MobileAppQR from "@/assets/mobile-app.png";

const mobileFeatures = [
  {
    icon: <QrCode className="h-4 w-4 text-primary" />,
    title: "QR Code Scanning",
    description:
      "Instantly scan QR codes for quick service tracking and attendance verification.",
  },
  {
    icon: <Clock className="h-4 w-4 text-primary" />,
    title: "Hour Tracking",
    description:
      "Monitor your community service hours in real-time with automatic logging.",
  },
  {
    icon: <Shield className="h-4 w-4 text-primary" />,
    title: "Secure Access",
    description:
      "Role-based authentication keeps your data safe with encrypted sessions.",
  },
  {
    icon: <Wifi className="h-4 w-4 text-primary" />,
    title: "Offline Support",
    description:
      "Continue tracking even without internet — data syncs when you reconnect.",
  },
];

export function MobileAppLink() {
  return (
    <section className="w-full max-w-5xl mx-auto my-8 px-4 sm:px-12">
      <div className="relative overflow-hidden rounded-2xl border border-primary/10 bg-gradient-to-br from-card to-muted/50 p-5 sm:p-10 shadow-xl">
        {/* Background Decoration */}
        <Smartphone className="absolute -right-6 -top-6 h-32 w-32 text-primary/5 rotate-12 pointer-events-none sm:block hidden" />

        <div className="relative flex flex-col gap-6">
          {/* Header */}
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Github className="h-5 w-5" />
              </div>
              <h2 className="text-xl sm:text-3xl font-bold tracking-tight">
                Mobile App
              </h2>
              <StatusIndicator label="Open Source" variant="success" />
            </div>

            <p className="text-muted-foreground text-[13px] leading-relaxed sm:text-base max-w-prose">
              Take the portal with you. Access the{" "}
              <span className="text-foreground font-medium">OSA Service</span>{" "}
              mobile app on GitHub, featuring native QR scanning for instant
              service tracking and hour verification.
            </p>
          </div>

          {/* Main content: Features + QR Code side by side */}
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            {/* Feature Cards Grid */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {mobileFeatures.map((feature) => (
                <FeatureCard
                  key={feature.title}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                />
              ))}
            </div>

            {/* QR Code Download Card */}
            <div className="w-full lg:w-auto flex justify-center lg:justify-end">
              <div className="relative group flex flex-col items-center gap-4 rounded-2xl border border-primary/10 bg-background/60 backdrop-blur-xl p-6 shadow-lg transition-all duration-300 hover:shadow-2xl hover:border-primary/20 hover:scale-[1.02]">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                <div className="relative">
                  <div className="rounded-xl overflow-hidden bg-white p-2 shadow-sm ring-1 ring-black/5">
                    <Image
                      src={MobileAppQR}
                      alt="Download OSA Service Mobile App"
                      width={160}
                      height={160}
                      className="rounded-lg"
                    />
                  </div>
                </div>
                <div className="relative flex flex-col items-center gap-1.5 text-center">
                  <div className="flex items-center gap-1.5 text-sm font-semibold tracking-tight">
                    <Download className="h-3.5 w-3.5 text-primary" />
                    <span>Download App</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-tight max-w-[160px]">
                    Scan with your camera to install on your device
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Status row */}
          <div className="flex flex-wrap items-center gap-2">
            <StatusIndicator label="Android" variant="info" pulse={false} />
            <StatusIndicator
              label="Cross-Platform"
              variant="warning"
              pulse={false}
            />
          </div>

          {/* CTA Button */}
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
  );
}
