"use client";

import { useState } from "react";

type StatusVariant = "success" | "warning" | "info" | "error";

interface StatusIndicatorProps {
  label: string;
  variant?: StatusVariant;
  pulse?: boolean;
}

const variantStyles: Record<
  StatusVariant,
  { dot: string; bg: string; text: string }
> = {
  success: {
    dot: "bg-green-500",
    bg: "bg-green-500/10 hover:bg-green-500/20",
    text: "text-green-700 dark:text-green-400",
  },
  warning: {
    dot: "bg-yellow-500",
    bg: "bg-yellow-500/10 hover:bg-yellow-500/20",
    text: "text-yellow-700 dark:text-yellow-400",
  },
  info: {
    dot: "bg-blue-500",
    bg: "bg-blue-500/10 hover:bg-blue-500/20",
    text: "text-blue-700 dark:text-blue-400",
  },
  error: {
    dot: "bg-red-500",
    bg: "bg-red-500/10 hover:bg-red-500/20",
    text: "text-red-700 dark:text-red-400",
  },
};

export function StatusIndicator({
  label,
  variant = "success",
  pulse = true,
}: StatusIndicatorProps) {
  const [hovered, setHovered] = useState(false);
  const styles = variantStyles[variant];

  return (
    <span
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`
        inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold
        transition-all duration-200 cursor-default select-none
        ${styles.bg} ${styles.text}
        ${hovered ? "scale-105 shadow-sm" : ""}
      `}
    >
      <span className="relative flex h-2 w-2">
        {pulse && (
          <span
            className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${styles.dot}`}
          />
        )}
        <span
          className={`relative inline-flex h-2 w-2 rounded-full ${styles.dot}`}
        />
      </span>
      {label}
    </span>
  );
}
