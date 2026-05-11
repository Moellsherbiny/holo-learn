import { Code2, LucideIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import { cn } from "@/lib/utils";

interface LogoProps {
  href?: string;
  icon?: LucideIcon;
  prefix?: string;
  highlight?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  iconClassName?: string;
  textClassName?: string;
  disableLink?: boolean;
}
export function Logo({ href = "/", className }: LogoProps) {
  return (
    <Link href={href} className="inline-block">
      <span
        className={cn(
          "flex items-center gap-3 group select-none",
          className
        )}
      >
        {/* Icon */}
        <span className="relative flex items-center justify-center w-10 h-10 rounded-full border border-primary/40 font-bold text-sm tracking-tight text-primary transition-all duration-300 group-hover:scale-105 group-hover:border-primary">
          
          {/* Glow effect */}
          <span className="absolute inset-0 rounded-full bg-primary/10 blur-md opacity-0 group-hover:opacity-100 transition" />

          OL
        </span>

        {/* Text */}
        <span className="flex items-center font-bold text-lg tracking-tight text-foreground">
          <span>Optic</span>

          <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
            Learn
          </span>

          {/* Dot */}
          <span className="ml-1 mb-0.5 h-1.5 w-1.5 rounded-full bg-primary transition-all group-hover:scale-125" />
        </span>
      </span>
    </Link>
  )
}

export function HologramLogo({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Fan base */}
      <rect x="10" y="24" width="12" height="3" rx="1.5" fill="currentColor" opacity="0.3" />
      <rect x="15" y="22" width="2" height="3" fill="currentColor" opacity="0.5" />
      {/* Hologram projection lines */}
      <path d="M16 20 L6 8 M16 20 L26 8 M16 20 L10 6 M16 20 L22 6" stroke="currentColor" strokeWidth="1" opacity="0.25" />
      {/* Hologram shape */}
      <polygon
        points="16,6 22,13 10,13"
        fill="currentColor"
        opacity="0.15"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeOpacity="0.7"
      />
      {/* Center glow dot */}
      <circle cx="16" cy="10" r="2" fill="currentColor" opacity="0.9" />
    </svg>
  );
}

export default Logo;