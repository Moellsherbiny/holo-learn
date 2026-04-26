"use client";
import { useTranslations } from "next-intl";
import { Monitor, Smartphone } from "lucide-react";

export default function HologramAR() {
  const t = useTranslations("hologram");

  return (
    <section id="hologram" className="py-28 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs font-semibold tracking-widest uppercase text-primary">{t("badge")}</span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mt-3 mb-4">{t("title")}</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{t("sub")}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Teacher side */}
          <div className="relative p-8 rounded-2xl border-2 border-primary/40 bg-primary/5 flex flex-col items-center text-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-primary/15 flex items-center justify-center">
              <Monitor size={28} className="text-primary" />
            </div>
            <div>
              <div className="text-xs font-semibold tracking-widest uppercase text-primary mb-2">{t("teacherLabel")}</div>
              <div className="relative mx-auto w-28 h-28 flex items-center justify-center">
                <div className="absolute w-28 h-28 rounded-full border border-primary/40 animate-spin" style={{ animationDuration: "6s" }} />
                <div className="absolute w-16 h-16 rounded-full border border-primary/60 animate-spin" style={{ animationDuration: "3s", animationDirection: "reverse" }} />
                <div className="w-8 h-8 rounded-full bg-primary/50 blur-sm" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">1 device per classroom</p>
          </div>

          {/* Student side */}
          <div className="p-8 rounded-2xl border border-border bg-card flex flex-col items-center text-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-accent/15 flex items-center justify-center">
              <Smartphone size={28} className="text-accent-foreground" />
            </div>
            <div>
              <div className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-2">{t("studentLabel")}</div>
              <div className="grid grid-cols-3 gap-2 mt-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="w-10 h-10 rounded-xl border border-border bg-muted/50 flex items-center justify-center">
                    <Smartphone size={14} className="text-muted-foreground" />
                  </div>
                ))}
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Any device, any browser</p>
          </div>
        </div>
      </div>
    </section>
  );
}