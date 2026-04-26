"use client";
import { useTranslations } from "next-intl";

export default function AboutResearch() {
  const t = useTranslations("about");
  const tags = [t("tag1"), t("tag2"), t("tag3"), t("tag4")];

  return (
    <section id="about" className="py-28 px-6 bg-muted/30">
      <div className="max-w-3xl mx-auto text-center">
        <span className="text-xs font-semibold tracking-widest uppercase text-primary">{t("badge")}</span>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mt-3 mb-6">{t("title")}</h2>
        <p className="text-muted-foreground text-lg leading-relaxed mb-10">{t("body")}</p>
        <div className="flex flex-wrap justify-center gap-3">
          {tags.map((tag, i) => (
            <span key={i} className="px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary text-sm font-medium">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}