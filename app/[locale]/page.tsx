import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import {
  ArrowDownLeft,
  ArrowDownRight,
  ArrowUpLeft,
  ArrowUpRight,
  BookOpen,
  Brain,
  Check,
  Compass,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";

export default async function HomePage() {
  const t = await getTranslations("LandingPage");
  const locale = await getLocale();
  const isArabic = locale.startsWith("ar");

  const features = [
    {
      number: "01",
      icon: BookOpen,
      title: t("features.lessons.title"),
      description: t("features.lessons.description"),
    },
    {
      number: "02",
      icon: Brain,
      title: t("features.practice.title"),
      description: t("features.practice.description"),
    },
    {
      number: "03",
      icon: Compass,
      title: t("features.progress.title"),
      description: t("features.progress.description"),
    },
  ];

  const UpArrow = isArabic ? ArrowUpLeft : ArrowUpRight;
  const DownArrow = isArabic ? ArrowDownLeft : ArrowDownRight;

  return (
    <main dir={isArabic ? "rtl" : "ltr"} className="min-h-screen overflow-x-clip bg-background text-foreground">
      <Navbar />

      <section
        id="about"
        className="mx-auto grid w-full max-w-7xl items-center gap-10 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-2 lg:gap-16 lg:px-12 lg:py-20"
      >
        <div className="min-w-0">
          <div className="mb-6 inline-flex max-w-full items-center gap-2 rounded-full border border-border px-3 py-2 text-xs font-medium text-muted-foreground">
            <Sparkles className="size-3.5 shrink-0 text-primary" aria-hidden="true" />
            <span>{t("hero.eyebrow")}</span>
          </div>

          <h1 className="max-w-2xl text-balance text-4xl font-semibold leading-24 tracking-tight sm:text-5xl md:text-6xl xl:text-7xl">
            {t("hero.titleLine1")}
            <br />
            <span className="relative inline-block">
              {t("hero.titleLine2")}
              <span aria-hidden="true" className="absolute inset-x-0 -bottom-1 h-0.75 rounded-full bg-primary" />
            </span>
            <br />
            {t("hero.titleLine3")}
          </h1>

          <p className="mt-6 max-w-xl text-pretty text-sm leading-7 text-muted-foreground sm:mt-8 sm:text-base sm:leading-8">
            {t("hero.description")}
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3 sm:mt-9">
            <Link
              href={`/${locale}/courses`}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {t("hero.primaryCta")}
              <UpArrow className="size-4 shrink-0" aria-hidden="true" />
            </Link>
            <Link
              href="#features"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {t("hero.secondaryCta")}
              <DownArrow className="size-4 shrink-0" aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-9 flex items-center gap-3 border-t border-border pt-5 sm:mt-12 sm:pt-6">
            <div className="flex shrink-0 -space-x-2 rtl:space-x-reverse" aria-hidden="true">
              <span className="flex size-9 items-center justify-center rounded-full border-2 border-background bg-muted">
                <BookOpen className="size-4" />
              </span>
              <span className="flex size-9 items-center justify-center rounded-full border-2 border-background bg-secondary">
                <Brain className="size-4" />
              </span>
              <span className="flex size-9 items-center justify-center rounded-full border-2 border-background bg-muted">
                <GraduationCap className="size-4" />
              </span>
            </div>
            <p className="max-w-sm text-xs leading-5 text-muted-foreground sm:text-sm">
              {t("hero.supportingText")}
            </p>
          </div>
        </div>

        <div className="mx-auto w-full min-w-0 max-w-135 lg:ms-auto">
          <div className="relative isolate aspect-square overflow-hidden rounded-[1.5rem] border border-border bg-card sm:rounded-[2rem]">
            <div className="absolute inset-3 rounded-[1.1rem] border border-border sm:inset-5 sm:rounded-[1.5rem]" />
            <div className="absolute inset-0 grid place-items-center">
              <div className="relative aspect-square w-[76%] max-w-97.5 rounded-full border border-foreground/20">
                <span className="absolute inset-[12%] rounded-full border border-foreground/20" />
                <span className="absolute inset-[24%] rounded-full border border-foreground/25" />
                <span className="absolute inset-[36%] rounded-full border border-primary/60" />
                <span className="absolute inset-[43%] rounded-full bg-primary" />
                <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-border" />
                <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-border" />
                <span className="absolute left-1/2 top-1/2 h-[140%] w-px -translate-x-1/2 -translate-y-1/2 rotate-45 bg-border/80" />
                <span className="absolute left-1/2 top-1/2 h-[140%] w-px -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-border/80" />
              </div>
            </div>

            <div className="absolute inset-x-5 top-5 flex items-center justify-between gap-3 sm:inset-x-8 sm:top-8">
              <span className="text-[9px] font-medium uppercase tracking-[0.18em] text-muted-foreground sm:text-[10px] sm:tracking-[0.22em]">
                OPTIC LEARN / 001
              </span>
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-background/90 sm:size-9">
                <Sparkles className="size-4" aria-hidden="true" />
              </span>
            </div>

            <span className="absolute left-[14%] top-[20%] size-2 rounded-full bg-primary sm:size-3" />
            <span className="absolute right-[15%] top-[29%] size-4 rotate-45 border border-foreground/60 sm:size-5" />
            <span className="absolute bottom-[20%] left-[18%] size-5 rounded-full border border-primary sm:size-6" />
            <span className="absolute bottom-[28%] right-[17%] size-2 rounded-full bg-foreground/60" />

            <div className="absolute inset-x-4 bottom-4 rounded-xl border border-border bg-background p-4 shadow-sm sm:inset-x-8 sm:bottom-8 sm:rounded-2xl sm:p-6">
              <div className="flex items-start justify-between gap-3 sm:gap-4">
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">{t("visual.cardEyebrow")}</p>
                  <h2 className="mt-2 text-lg font-semibold leading-snug tracking-tight sm:text-2xl">
                    {t("visual.cardTitle")}
                  </h2>
                </div>
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground sm:size-11">
                  <BookOpen className="size-5" aria-hidden="true" />
                </span>
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3 sm:mt-6 sm:pt-4">
                <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                  <Check className="size-4 shrink-0 text-primary" aria-hidden="true" />
                  {t("visual.cardFooter")}
                </span>
                <span className="font-mono text-xs text-muted-foreground">01 / 03</span>
              </div>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between gap-3 px-1">
            <span className="text-xs leading-5 text-muted-foreground">{t("visual.caption")}</span>
            <span className="shrink-0 font-mono text-[10px] text-muted-foreground sm:text-xs">OPTIC / 01</span>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="h-px bg-border" />
      </div>

      <section id="features" className="mx-auto w-full max-w-7xl px-5 py-14 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <div className="mb-8 grid gap-4 sm:mb-10 md:grid-cols-[1fr_0.8fr] md:items-end md:gap-8">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              {t("features.eyebrow")}
            </p>
            <h2 className="mt-3 max-w-2xl text-balance text-3xl font-semibold leading-tight tracking-tight sm:mt-4 sm:text-4xl lg:text-5xl">
              {t("features.heading")}
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-muted-foreground md:justify-self-end">
            {t("features.description")}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <article
                key={feature.number}
                className="group flex min-w-0 flex-col rounded-2xl border border-border bg-card p-5 transition-colors hover:bg-accent/40 sm:p-6 lg:p-7"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-border bg-background transition-colors group-hover:bg-muted">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">/ {feature.number}</span>
                </div>
                <h3 className="mt-6 text-lg font-semibold tracking-tight sm:mt-8 sm:text-xl">
                  {feature.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-7 text-muted-foreground">
                  {feature.description}
                </p>
                <div className="mt-6 flex items-center justify-between gap-3 border-t border-border pt-4">
                  <span className="text-xs text-muted-foreground">{t("features.learnMore")}</span>
                  <UpArrow className="size-4 shrink-0 transition-transform group-hover:-translate-y-0.5" aria-hidden="true" />
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section id="journey" className="border-y border-border bg-muted/30">
        <div className="mx-auto grid w-full max-w-7xl gap-7 px-5 py-12 sm:px-8 sm:py-16 md:grid-cols-[1fr_auto] md:items-center lg:px-12 lg:py-20">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              <span className="size-2 shrink-0 rounded-full bg-primary" />
              {t("journey.eyebrow")}
            </div>
            <h2 className="mt-4 max-w-3xl text-balance text-3xl font-semibold leading-tight tracking-tight sm:mt-5 sm:text-4xl lg:text-5xl">
              {t("journey.heading")}
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:mt-5 sm:text-base">
              {t("journey.description")}
            </p>
          </div>

          <Link
            href={`/${locale}/courses`}
            className="inline-flex min-h-11 w-fit items-center justify-center gap-3 rounded-full border border-foreground px-5 py-3 text-sm font-medium transition-colors hover:bg-foreground hover:text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:px-6"
          >
            {t("journey.cta")}
            <UpArrow className="size-4 shrink-0" aria-hidden="true" />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
