import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { Circle } from "lucide-react";

export async function Footer() {
  const locale = await getLocale();
  const t = await getTranslations("LandingPage");

  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-5 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
        <Link href={`/${locale}`} className="flex w-fit items-center gap-2" aria-label="Optic Learn">
          <span className="flex size-7 items-center justify-center rounded-full border border-foreground/30">
            <Circle className="size-4 text-primary" strokeWidth={2} aria-hidden="true" />
          </span>
          <span className="text-sm font-semibold tracking-tight">optic learn</span>
        </Link>

        <p className="max-w-2xl text-xs leading-6 text-muted-foreground">
          {t("footer.description")}
        </p>

        <p className="shrink-0 text-xs text-muted-foreground">
          © {new Date().getFullYear()} Optic Learn
        </p>
      </div>
    </footer>
  );
}
