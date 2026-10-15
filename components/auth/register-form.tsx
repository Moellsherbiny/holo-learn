
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  GraduationCap,
  LoaderCircle,
  LockKeyhole,
  Mail,
  UserRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type RegisterValues = {
  name: string;
  email: string;
  password: string;
  role: "student" | "teacher";
};

export function RegisterForm() {
  const t = useTranslations("auth");
  const locale = useLocale();
  const router = useRouter();

  const isArabic = locale.startsWith("ar");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const registerSchema = z.object({
    name: z
      .string()
      .trim()
      .min(2, t("validation.nameMin")),

    email: z
      .email(t("validation.emailInvalid"))
      .trim(),

    password: z
      .string()
      .min(6, t("validation.passwordMin")),

    role: z.enum(["student", "teacher"], {
      message: t("validation.roleRequired"),
    }),
  });

  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "student",
    },
    mode: "onTouched",
  });

  const onSubmit = async (values: RegisterValues) => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          name: values.name.trim(),
          email: values.email.trim().toLowerCase(),
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.message || t("validation.registerError")
        );
      }

      toast.success(t("register.successToast"));

      router.push(`/${locale}/auth/login`);
      router.refresh();
    } catch (error) {
      console.error("Registration failed:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : t("validation.registerError")
      );
    } finally {
      setIsLoading(false);
    }
  };

  const errors = form.formState.errors;

  const DirectionArrow = isArabic ? ArrowLeft : ArrowRight;

  return (
    <div className="w-full" dir={isArabic ? "rtl" : "ltr"}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid gap-5"
        noValidate
      >
        {/* Full name */}
        <div className="grid gap-2">
          <Label htmlFor="name">{t("name")}</Label>

          <div className="relative">
            <UserRound
              aria-hidden="true"
              className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            />

            <Input
              {...form.register("name")}
              id="name"
              type="text"
              autoComplete="name"
              placeholder={t("name")}
              disabled={isLoading}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
              className="h-11 ps-10"
            />
          </div>

          {errors.name && (
            <p id="name-error" role="alert" className="text-sm text-destructive">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="grid gap-2">
          <Label htmlFor="email">{t("email")}</Label>

          <div className="relative">
            <Mail
              aria-hidden="true"
              className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            />

            <Input
              {...form.register("email")}
              id="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              placeholder="name@example.com"
              disabled={isLoading}
              dir="ltr"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              className="h-11 ps-10 text-start"
            />
          </div>

          {errors.email && (
            <p id="email-error" role="alert" className="text-sm text-destructive">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="grid gap-2">
          <Label htmlFor="password">{t("password")}</Label>

          <div className="relative">
            <LockKeyhole
              aria-hidden="true"
              className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            />

            <Input
              {...form.register("password")}
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder={t("password")}
              disabled={isLoading}
              dir="ltr"
              aria-invalid={!!errors.password}
              aria-describedby={
                errors.password ? "password-error" : undefined
              }
              className="h-11 ps-10 pe-11 text-start"
            />

            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              disabled={isLoading}
              aria-label={
                showPassword
                  ? isArabic
                    ? "إخفاء كلمة المرور"
                    : "Hide password"
                  : isArabic
                    ? "إظهار كلمة المرور"
                    : "Show password"
              }
              aria-pressed={showPassword}
              className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
            >
              {showPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>

          {errors.password && (
            <p
              id="password-error"
              role="alert"
              className="text-sm text-destructive"
            >
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Account role */}
        <div className="grid gap-2">
          <Label htmlFor="role">{t("role")}</Label>

          <div className="relative">
            <GraduationCap
              aria-hidden="true"
              className="pointer-events-none absolute start-3 top-1/2 z-10 size-4 -translate-y-1/2 text-muted-foreground"
            />

            <Select
              value={form.watch("role")}
              onValueChange={(value) => {
                if (value !== "student" && value !== "teacher") return;

                form.setValue("role", value, {
                  shouldValidate: true,
                  shouldDirty: true,
                  shouldTouch: true,
                });
              }}
              disabled={isLoading}
            >
              <SelectTrigger
                id="role"
                aria-invalid={!!errors.role}
                aria-describedby={errors.role ? "role-error" : undefined}
                className="h-11 w-full ps-10"
              >
                <SelectValue placeholder={t("selectRole")} />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="student">{t("student")}</SelectItem>
                <SelectItem value="teacher">{t("teacher")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {errors.role && (
            <p id="role-error" role="alert" className="text-sm text-destructive">
              {errors.role.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <Button
          type="submit"
          disabled={isLoading}
          className="mt-1 h-11 w-full"
        >
          {isLoading ? (
            <>
              <LoaderCircle className="size-4 animate-spin" />
              {t("loading")}
            </>
          ) : (
            <>
              {t("createAccount")}
              <DirectionArrow className="size-4" />
            </>
          )}
        </Button>
      </form>

      {/* Login link */}
      <div className="mt-6 border-t border-border pt-5">
        <p className="flex flex-wrap items-center justify-center gap-1.5 text-center text-sm text-muted-foreground">
          <span>{t("hasAccount")}</span>

          <Link
            href={`/${locale}/auth/login`}
            className="inline-flex items-center gap-1 font-medium text-primary underline-offset-4 hover:underline"
          >
            {t("login.title")}
          </Link>
        </p>
      </div>
    </div>
  );
}
