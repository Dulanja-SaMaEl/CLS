"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "./ThemeProvider";
import { Sun, Moon } from "lucide-react";

interface ThemeToggleProps {
  variant?: "pill" | "icon" | "full";
  className?: string;
}

export default function ThemeToggle({ variant = "pill", className = "" }: ThemeToggleProps) {
  const { resolvedTheme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Render placeholder to avoid layout shift while preserving dimensions
    return (
      <div
        className={`w-9 h-9 rounded-full border border-stone-300 dark:border-white/10 bg-transparent flex items-center justify-center opacity-40 ${className}`}
        aria-hidden="true"
      >
        <div className="w-4 h-4 rounded-full bg-stone-400 dark:bg-stone-600 animate-pulse" />
      </div>
    );
  }

  const isDark = resolvedTheme === "dark";

  if (variant === "icon") {
    return (
      <button
        onClick={toggleTheme}
        type="button"
        title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        className={`p-2 rounded-full border border-stone-300 dark:border-white/15 bg-white/80 dark:bg-stone-900/80 text-stone-700 dark:text-stone-300 hover:text-[#9E7D3B] dark:hover:text-[#C5A059] hover:border-[#9E7D3B]/40 dark:hover:border-[#C5A059]/40 transition-all shadow-sm active:scale-95 ${className}`}
      >
        {isDark ? (
          <Sun className="w-4 h-4 transition-transform hover:rotate-45" />
        ) : (
          <Moon className="w-4 h-4 transition-transform hover:-rotate-12" />
        )}
      </button>
    );
  }

  if (variant === "full") {
    return (
      <button
        onClick={toggleTheme}
        type="button"
        title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        className={`w-full flex items-center justify-between px-4 py-3 rounded-md border border-stone-300 dark:border-white/15 bg-stone-100/80 dark:bg-stone-900/80 text-xs font-mono uppercase tracking-wider text-stone-800 dark:text-stone-200 transition-all hover:border-[#9E7D3B] dark:hover:border-[#C5A059] ${className}`}
      >
        <span className="flex items-center gap-2">
          {isDark ? (
            <Sun className="w-4 h-4 text-[#C5A059]" />
          ) : (
            <Moon className="w-4 h-4 text-[#9E7D3B]" />
          )}
          <span>{isDark ? "Theme: Dark Mode" : "Theme: Light Mode"}</span>
        </span>
        <span className="text-[10px] text-stone-500 font-sans tracking-normal">
          {isDark ? "Tap for Light" : "Tap for Dark"}
        </span>
      </button>
    );
  }

  // Default 'pill' variant: High-clarity Segmented Switcher
  return (
    <div
      className={`inline-flex items-center p-0.5 rounded-full border border-stone-300 dark:border-white/20 bg-stone-100 dark:bg-[#161616] shadow-sm select-none ${className}`}
      role="group"
      aria-label="Theme selector"
    >
      <button
        type="button"
        onClick={() => isDark && toggleTheme()}
        title="Switch to Light Mode"
        aria-pressed={!isDark}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider font-bold transition-all cursor-pointer ${
          !isDark
            ? "bg-white text-stone-900 shadow-sm border border-stone-200"
            : "text-stone-400 hover:text-stone-200"
        }`}
      >
        <Sun className={`w-3.5 h-3.5 ${!isDark ? "text-amber-600" : "text-stone-400"}`} />
        <span className="hidden sm:inline">Light</span>
      </button>

      <button
        type="button"
        onClick={() => !isDark && toggleTheme()}
        title="Switch to Dark Mode"
        aria-pressed={isDark}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider font-bold transition-all cursor-pointer ${
          isDark
            ? "bg-[#C5A059] text-noir-900 shadow-sm"
            : "text-stone-500 hover:text-stone-800"
        }`}
      >
        <Moon className={`w-3.5 h-3.5 ${isDark ? "text-noir-900" : "text-stone-400"}`} />
        <span className="hidden sm:inline">Dark</span>
      </button>
    </div>
  );
}
