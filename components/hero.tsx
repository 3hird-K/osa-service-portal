"use client";

import Image from "next/image";
import UstpLogo from "@/assets/ustp.png";
import { Search, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

export function Hero() {
  const [taskId, setTaskId] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (taskId.trim()) {
      router.push(`/track?id=${taskId.trim()}`);
    }
  };

  return (
    <section className="flex flex-col items-center justify-center text-center gap-8 px-6 pt-20 pb-12 sm:gap-10 sm:py-32">

      <a
        href="https://www.ustp.edu.ph/"
        target="_blank"
        rel="noreferrer"
        className="group"
      >
        <Image
          src={UstpLogo}
          alt="USTP Logo"
          width={140}
          height={140}
          priority
          className="h-auto w-20 sm:w-32 md:w-40 rounded-xl shadow-md transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl"
        />
      </a>

      <div className="flex w-full max-w-4xl flex-col items-center space-y-6">
        <h1 className="text-4xl font-extrabold tracking-tighter text-foreground sm:text-6xl md:text-7xl lg:text-8xl">
          OSA Service Portal
        </h1>

        <p className="max-w-md text-base leading-relaxed text-muted-foreground sm:max-w-xl sm:text-lg md:text-xl">
          Streamline your{" "}
          <span className="font-semibold text-primary">community service,</span>{" "}
          track <span className="font-semibold text-primary">real-time hours,</span>{" "}
          and manage{" "}
          <span className="font-semibold text-primary">IoT verification</span> —
          all in one unified dashboard.
        </p>

        {/* Tracking Search Interface */}
        <div className="w-full max-w-md pt-4">
          <form
            onSubmit={handleSearch}
            className="group relative flex items-center p-1.5 bg-muted/40 border border-border/50 rounded-full focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/5 transition-all duration-300"
          >
            <div className="pl-4 pr-2 text-muted-foreground group-focus-within:text-primary transition-colors">
              <Search size={20} />
            </div>
            <input
              type="text"
              placeholder="Enter Task ID to track..."
              value={taskId}
              onChange={(e) => setTaskId(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-sm font-medium placeholder:text-muted-foreground/60 h-10"
            />
            <Button
              type="submit"
              size="sm"
              className="rounded-full px-4 h-10 font-bold tracking-tight shadow-lg shadow-primary/20 cursor-pointer"
            >
              Track <ArrowRight size={16} className="ml-2" />
            </Button>
          </form>
          <p className="mt-4 text-[11px] font-bold text-muted-foreground uppercase tracking-[0.2em] opacity-40">
            QR verification deep-linking enabled
          </p>
        </div>
      </div>

      <div className="mt-8 h-px w-full max-w-[100px] bg-gradient-to-r from-transparent via-primary/50 to-transparent sm:max-w-md" />
    </section>
  );
}
