"use client";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  const t = useTranslations("hero");

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-16 px-6 text-center overflow-hidden">
      {/* Background glow orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-150 h-150 rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-75 h-75 rounded-full bg-accent/10 blur-[80px] pointer-events-none" />

      {/* Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-medium mb-8 animate-fade-in">
        <Sparkles size={12} />
        {t("badge")}
      </div>

      {/* Headline */}
      <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.05] mb-6 max-w-4xl">
        {t("headline")}
        <br />
        <span className="text-primary">{t("headlineAccent")}</span>
      </h1>

      {/* Sub */}
      <p className="text-muted-foreground text-lg md:text-xl max-w-2xl leading-relaxed mb-10">
        {t("sub")}
      </p>

      {/* CTAs */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Button size="lg" className="rounded-full px-8 gap-2" asChild>
          <Link href="/auth/login">
          {t("cta")} <ArrowRight size={16} />
          </Link>

        </Button>
        <Button size="lg" variant="outline" className="rounded-full px-8" asChild>
          <Link href="#about">
          {t("ctaSecondary")}
          </Link>
        </Button>
      </div>

      {/* Floating hologram visual hint */}
      <div className="mt-20 relative w-full max-w-2xl mx-auto">
        <div className="aspect-video rounded-2xl border border-primary/20 bg-card flex items-center justify-center overflow-hidden relative">
          <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-accent/5" />
          {/* Spinning rings to suggest hologram */}
          <div className="relative w-40 h-40 flex items-center justify-center">
            <div className="absolute w-40 h-40 rounded-full border-2 border-primary/30 animate-spin" style={{ animationDuration: "8s" }} />
            <div className="absolute w-28 h-28 rounded-full border-2 border-accent/30 animate-spin" style={{ animationDuration: "5s", animationDirection: "reverse" }} />
            <div className="absolute w-16 h-16 rounded-full border-2 border-primary/50 animate-spin" style={{ animationDuration: "3s" }} />
            <div className="w-6 h-6 rounded-full bg-primary/60 blur-sm" />
          </div>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-muted-foreground tracking-widest uppercase">
            Hologram Fan · AR · Web
          </div>
        </div>
      </div>
    </section>
  );
}