"use client";

import { useState, type ReactNode } from "react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`
        group flex flex-col gap-3 rounded-xl border border-border/60 bg-card/80 p-4
        transition-all duration-300 cursor-default
        ${hovered ? "border-primary/30 shadow-md -translate-y-1 bg-card" : "hover:border-primary/20"}
      `}
    >
      <div className="flex items-center gap-3">
        <div
          className={`
            flex h-9 w-9 shrink-0 items-center justify-center rounded-lg
            bg-primary/10 transition-colors duration-300
            ${hovered ? "bg-primary/20" : ""}
          `}
        >
          <span
            className={`transition-transform duration-300 ${hovered ? "scale-110" : ""}`}
          >
            {icon}
          </span>
        </div>
        <h3 className="text-sm font-semibold tracking-tight">{title}</h3>
      </div>
      <p className="text-xs leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
