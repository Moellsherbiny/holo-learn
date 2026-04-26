"use client";
import { LoginForm } from "@/components/auth/login-form";
import { useTranslations } from "next-intl";
import Link from "next/link";
export default function LoginPage() {
  const t = useTranslations("auth");
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-semibold tracking-tight">{t("loginTitle")}</h1>
        <p className="text-sm text-muted-foreground">{t("login.subtitle")}</p>
      </div>
      
      <LoginForm />

      <p className="px-8 text-center text-sm text-muted-foreground">
        {t("login.noAccount")}{" "}
        <Link href="/auth/register" className="underline underline-offset-4 hover:text-primary">
          {t("login.signUp")}
        </Link>
      </p>
    </div>
  );
}