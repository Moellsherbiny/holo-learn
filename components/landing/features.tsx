"use client";
import { useTranslations } from "next-intl";
import { Layers, Glasses, Languages, Zap, Box, BarChart3 } from "lucide-react";

const icons = [Layers, Glasses, Languages, Zap, Box, BarChart3];

export default function Features() {
  const t = useTranslations("features");
  const items = t.raw("items") as { title: string; desc: string }[];

  return (
    <section id="features" className="py-28 px-6 bg-muted/30">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs font-semibold tracking-widest uppercase text-primary">{t("badge")}</span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mt-3">{t("title")}</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, i) => {
            const Icon = icons[i];
            return (
              <div key={i} className="p-6 rounded-2xl border border-border bg-card hover:border-primary/40 hover:-translate-y-1 transition-all">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Icon size={18} className="text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}