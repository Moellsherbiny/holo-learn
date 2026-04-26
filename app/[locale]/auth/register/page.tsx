"use client";
import { RegisterForm } from "@/components/auth/register-form";
import { useTranslations } from "next-intl";
import Link from "next/link";

export default function RegisterPage() {
  const t = useTranslations("auth");

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-semibold tracking-tight">{t("createAccount")}</h1>
        <p className="text-sm text-muted-foreground">{t("register.subtitle")}</p>
      </div>

      <RegisterForm />

      <p className="px-8 text-center text-sm text-muted-foreground">
        {t("register.hasAccount")}{" "}
        <Link href="/auth/login" className="underline underline-offset-4 hover:text-primary">
          {t("register.signIn")}
        </Link>
      </p>
    </div>
  );
}