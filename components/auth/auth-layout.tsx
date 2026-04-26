"use client";

import { ReactNode } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { ModeToggle } from "@/components/layout/theme-toggle"; // تأكد من وجود مكون التبديل لديك
import  LanguageSwitcher  from "@/components/layout/language-switcher"; // مكون بسيط للتبديل بين ar/en
import Logo from "../layout/logo";

export default function AuthShell({ children, locale }: { children: ReactNode; locale: string }) {
  const t = useTranslations("auth");
  const isRtl = locale === "ar";

  return (
    <div className="min-h-screen flex flex-col justify-center" dir={isRtl ? "rtl" : "ltr"}>

      {/* الجانب الأيمن: النماذج وخدمات الإعدادات */}
      <div className="relative flex flex-col p-8 bg-background">
        {/* أدوات التحكم (أعلى الصفحة) */}
        <div className="absolute right-4 left-4 top-4 flex justify-between items-center">
          <Link href="/" className="text-sm font-medium hover:underline text-muted-foreground">
            {t("backToHome")}
          </Link>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <ModeToggle />
          </div>
        </div>

        {/* محتوى الصفحة (Login / Register) */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}