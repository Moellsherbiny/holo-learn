
"use client";

import { useTranslations } from "next-intl";

import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  const t = useTranslations("auth");

  return (
    <main
      className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-8"
      dir="rtl"
    >
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            {t("createAccount")}
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            {t("register.subtitle")}
          </p>
        </div>

        {/* Register Card */}
        <div className="rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
          <RegisterForm />
        </div>

       
      </div>
    </main>
  );
}
