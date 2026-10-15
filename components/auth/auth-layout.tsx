
"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Circle } from "lucide-react";

import { ModeToggle } from "@/components/layout/theme-toggle";
import LanguageSwitcher from "@/components/layout/language-switcher";

export default function AuthShell({
  children,
  locale,
}: {
  children: ReactNode;
  locale: string;
}) {
  const t = useTranslations("auth");
  const isRtl = locale.startsWith("ar");

  const BackIcon = isRtl ? ArrowRight : ArrowLeft;

  return (
    <main
      dir={isRtl ? "rtl" : "ltr"}
      className="relative flex min-h-svh flex-col overflow-x-clip bg-background text-foreground"
    >
      {/* Subtle background details */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute inset-x-0 top-0 h-px bg-border" />
        <div className="absolute -top-32 start-1/2 size-80 -translate-x-1/2 rounded-full border border-border/50 sm:size-[28rem]" />
        <div className="absolute -top-20 start-1/2 size-64 -translate-x-1/2 rounded-full border border-border/40 sm:size-96" />
      </div>

      {/* Header */}
      <header className="relative z-10 flex min-h-16 items-center justify-between gap-3 border-b border-border/70 px-4 sm:px-8">
        <Link
          href={`/${locale}`}
          aria-label="Optic Learn"
          className="group inline-flex min-w-0 items-center gap-2.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span className="relative flex size-9 shrink-0 items-center justify-center rounded-full border border-foreground/30 transition-colors group-hover:border-primary">
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

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <LanguageSwitcher />
          <ModeToggle />
        </div>
      </header>

      {/* Main content */}
      <section className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-10 sm:px-6 sm:py-14">
        <div className="w-full max-w-[420px]">
          <Link
            href={`/${locale}`}
            className="mb-6 inline-flex min-h-9 items-center gap-2 rounded-md text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <BackIcon className="size-4" aria-hidden="true" />
            <span>{t("backToHome")}</span>
          </Link>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-8">
            {children}
          </div>

          <p className="mt-6 text-center text-xs leading-6 text-muted-foreground">
            © {new Date().getFullYear()} Optic Learn
          </p>
        </div>
      </section>
    </main>
  );
}
