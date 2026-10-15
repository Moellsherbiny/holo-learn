
"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { ArrowLeft, ArrowRight, BookOpen, ShieldCheck } from "lucide-react";

import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  const t = useTranslations("auth");
  const locale = useLocale();
  const isArabic = locale.startsWith("ar");

  const DirectionArrow = isArabic ? ArrowLeft : ArrowRight;

  return (
    <div dir={isArabic ? "rtl" : "ltr"} className="w-full">
      {/* Intro */}
      <div className="mb-7">
        <div className="mb-5 flex size-12 items-center justify-center rounded-xl border border-border bg-muted/60">
          <BookOpen className="size-5 text-primary" aria-hidden="true" />
        </div>

        <p className="mb-2 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
          Optic Learn
        </p>

        <h1 className="text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">
          {t("loginTitle")}
        </h1>

        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          {t("login.subtitle")}
        </p>
      </div>

      {/* Login form */}
      <LoginForm />

      {/* Register link */}
      <div className="mt-6 border-t border-border pt-5">
        <p className="text-center text-sm leading-7 text-muted-foreground">
          {t("login.noAccount")}{" "}
          <Link
            href={`/${locale}/auth/register`}
            className="inline-flex items-center gap-1 font-medium text-primary underline-offset-4 transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {t("login.signUp")}
            <DirectionArrow className="size-3.5" aria-hidden="true" />
          </Link>
        </p>
      </div>

      {/* Security note */}
      <div className="mt-5 flex items-start justify-center gap-2 text-center text-xs leading-5 text-muted-foreground">
        <ShieldCheck
          className="mt-0.5 size-4 shrink-0 text-primary"
          aria-hidden="true"
        />
        <p>
          {isArabic
            ? "تجربة تسجيل دخول بسيطة وآمنة للوصول إلى حسابك التعليمي."
            : "A simple and secure way to access your learning account."}
        </p>
      </div>
    </div>
  );
}
