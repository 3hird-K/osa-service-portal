"use client";

import { Button } from "@/components/ui/button";
import { Laptop, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-9 h-9" />; // Placeholder to prevent layout shift
  }

  const toggleTheme = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  };

  const ICON_SIZE = 18;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="rounded-full hover:bg-muted/50 transition-all duration-300 active:scale-90"
      title={`Current theme: ${theme}. Click to switch.`}
    >
      {theme === "light" ? (
        <Sun size={ICON_SIZE} className="text-orange-500 animate-in fade-in zoom-in duration-300" />
      ) : theme === "dark" ? (
        <Moon size={ICON_SIZE} className="text-blue-400 animate-in fade-in zoom-in duration-300" />
      ) : (
        <Laptop size={ICON_SIZE} className="text-muted-foreground animate-in fade-in zoom-in duration-300" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};

export { ThemeSwitcher };
