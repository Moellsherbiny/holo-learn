"use client";
import { useTranslations } from "next-intl";

export default function HowItWorks() {
  const t = useTranslations("howItWorks");
  const steps = t.raw("steps") as { num: string; title: string; desc: string }[];

  return (
    <section id="how" className="py-28 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs font-semibold tracking-widest uppercase text-primary">{t("badge")}</span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mt-3 mb-4">{t("title")}</h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">{t("sub")}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <div key={i} className="relative group">
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 ltr:left-full rtl:right-full w-8 h-px bg-border z-10" />
              )}
              <div className="p-8 rounded-2xl border border-border bg-card hover:border-primary/40 transition-colors">
                <span className="text-4xl font-black text-primary/20 block mb-4">{step.num}</span>
                <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}