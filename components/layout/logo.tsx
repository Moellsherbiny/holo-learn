import { Circle, Code2, LucideIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import { cn } from "@/lib/utils";

interface LogoProps {
  locale?: string;
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
export function Logo({ href = "/", className, locale = "" }: LogoProps) {
  return (
    <Link
      href={`/${locale}`}
      className="flex min-w-0 shrink-0 items-center gap-2.5"
      aria-label="Optic Learn"
    >
      <span className="relative flex size-8 items-center justify-center rounded-full border border-foreground/30">
        <Circle
          className="size-5 text-primary"
          strokeWidth={2}
          aria-hidden="true"
        />
        <span className="absolute size-1.5 rounded-full bg-foreground" />
      </span>

      <span className="whitespace-nowrap text-base font-semibold tracking-tight sm:text-lg">
        optic
        <span className="font-normal text-muted-foreground">learn</span>
      </span>
    </Link>
  );
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
      <rect
        x="10"
        y="24"
        width="12"
        height="3"
        rx="1.5"
        fill="currentColor"
        opacity="0.3"
      />
      <rect
        x="15"
        y="22"
        width="2"
        height="3"
        fill="currentColor"
        opacity="0.5"
      />
      {/* Hologram projection lines */}
      <path
        d="M16 20 L6 8 M16 20 L26 8 M16 20 L10 6 M16 20 L22 6"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.25"
      />
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
