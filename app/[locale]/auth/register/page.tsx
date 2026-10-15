
"use client";

import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  GraduationCap,
  ShieldCheck,
  UserRoundPlus,
} from "lucide-react";

import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  const t = useTranslations("auth");
  const locale = useLocale();
  const isArabic = locale.startsWith("ar");
  const DirectionArrow = isArabic ? ArrowLeft : ArrowRight;

  return (
    <div className="w-full" dir={isArabic ? "rtl" : "ltr"}>
      {/* Page heading */}
      <header className="mb-7">
        <div className="mb-5 flex size-12 items-center justify-center rounded-xl border border-border bg-muted/60 text-foreground">
          <UserRoundPlus className="size-6" strokeWidth={1.8} />
        </div>

        <p className="mb-2 text-sm font-medium text-primary">
          Optic Learn
        </p>

        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {t("createAccount")}
        </h1>

        <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
          {t("register.subtitle")}
        </p>
      </header>

      {/* Registration form */}
      <RegisterForm />

      {/* Supporting information */}
      <div className="mt-6 flex items-start gap-3 rounded-xl border border-border/70 bg-muted/30 p-3.5">
        <ShieldCheck className="mt-0.5 size-5 shrink-0 text-muted-foreground" />

        <p className="text-xs leading-5 text-muted-foreground">
          {isArabic
            ? "بياناتك تُستخدم لإنشاء حسابك والوصول إلى تجربة التعلم المناسبة لك."
            : "Your information helps create your account and personalize your learning experience."}
        </p>
      </div>

      {/* Account role hint */}
      <div className="mt-5 flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <GraduationCap className="size-4 shrink-0" />
        <span>
          {isArabic
            ? "اختر نوع الحساب المناسب لك أثناء التسجيل."
            : "Choose the account type that suits you during registration."}
        </span>
      </div>
    </div>
  );
}
