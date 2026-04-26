"use client";
import { useTranslations } from "next-intl";
import Logo from "./logo";

export default function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="border-t border-border py-10 px-6">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <Logo size="sm" />
        <div className="text-center text-sm text-muted-foreground">
          <p>{t("rights")}</p>
          <p>{t("dept")}</p>
        </div>
      </div>
    </footer>
  );
}