"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
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
            {t("loginTitle")}
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            {t("login.subtitle")}
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
          <LoginForm />
        </div>

        {/* Register */}
        <p className="mt-6 px-4 text-center text-sm text-muted-foreground">
          {t("login.noAccount")}{" "}
          <Link
            href="/auth/register"
            className="font-medium text-primary underline underline-offset-4 transition-colors hover:text-primary/80"
          >
            {t("login.signUp")}
          </Link>
        </p>
      </div>
    </main>
  );
}