
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import { z } from "zod";
import { Eye, EyeOff, LoaderCircle, LockKeyhole, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const t = useTranslations("auth");
  const locale = useLocale();
  const isArabic = locale.startsWith("ar");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});

  const loginSchema = z.object({
    email: z.email(t("validation.emailRequired")),
    password: z.string().min(6, t("validation.passwordMin")),
  });

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loading) return;

    const normalizedEmail = email.trim();

    const validation = loginSchema.safeParse({
      email: normalizedEmail,
      password,
    });

    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors;

      setErrors({
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
      });

      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email: normalizedEmail,
        password,
        redirect: false,
        redirectTo: `/${locale}`,
      });

      if (result?.error) {
        setErrors({
          general: t("validation.invalidCredentials"),
        });
        return;
      }

      if (result?.url) {
        window.location.assign(result.url);
        return;
      }

      setErrors({
        general: t("validation.loginError"),
      });
    } catch (error) {
      console.error("Login failed:", error);

      setErrors({
        general: t("validation.loginError"),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (loading) return;

    setErrors({});
    setLoading(true);

    try {
      await signIn("google", {
        redirectTo: `/${locale}`,
      });
    } catch (error) {
      console.error("Google sign-in failed:", error);

      setErrors({
        general: t("validation.loginError"),
      });

      setLoading(false);
    }
  };

  const clearFieldError = (field: "email" | "password") => {
    setErrors((previous) => ({
      ...previous,
      [field]: undefined,
      general: undefined,
    }));
  };

  return (
    <div className="w-full" dir={isArabic ? "rtl" : "ltr"}>
      <form onSubmit={handleLogin} className="grid gap-5" noValidate>
        {/* General error */}
        {errors.general && (
          <div
            role="alert"
            className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm leading-6 text-destructive"
          >
            {errors.general}
          </div>
        )}

        {/* Email */}
        <div className="grid gap-2">
          <Label htmlFor="login-email" className="text-sm font-medium">
            {t("email")}
          </Label>

          <div className="relative">
            <Mail
              aria-hidden="true"
              className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            />

            <Input
              id="login-email"
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              autoCapitalize="none"
              spellCheck={false}
              placeholder={t("email")}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                clearFieldError("email");
              }}
              disabled={loading}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "login-email-error" : undefined}
              className="h-11 rounded-lg ps-10"
            />
          </div>

          {errors.email && (
            <p id="login-email-error" className="text-sm text-destructive">
              {errors.email}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="grid gap-2">
          <Label htmlFor="login-password" className="text-sm font-medium">
            {t("password")}
          </Label>

          <div className="relative">
            <LockKeyhole
              aria-hidden="true"
              className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            />

            <Input
              id="login-password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder={t("password")}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                clearFieldError("password");
              }}
              disabled={loading}
              aria-invalid={Boolean(errors.password)}
              aria-describedby={
                errors.password ? "login-password-error" : undefined
              }
              className="h-11 rounded-lg ps-10 pe-11"
            />

            <button
              type="button"
              onClick={() => setShowPassword((previous) => !previous)}
              disabled={loading}
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
              className="absolute inset-y-0 end-0 flex w-10 items-center justify-center rounded-e-lg text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring disabled:opacity-50"
            >
              {showPassword ? (
                <EyeOff className="size-4" aria-hidden="true" />
              ) : (
                <Eye className="size-4" aria-hidden="true" />
              )}
            </button>
          </div>

          {errors.password && (
            <p id="login-password-error" className="text-sm text-destructive">
              {errors.password}
            </p>
          )}
        </div>

        {/* Submit */}
        <Button
          type="submit"
          disabled={loading}
          className="mt-1 h-11 w-full rounded-lg font-medium"
        >
          {loading ? (
            <>
              <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
              <span>{t("loading")}</span>
            </>
          ) : (
            t("loginButton")
          )}
        </Button>

        {/* Divider */}
        <div className="relative flex items-center">
          <Separator />
          <span className="absolute start-1/2 -translate-x-1/2 bg-card px-3 text-xs text-muted-foreground">
            {t("orContinueWith")}
          </span>
        </div>

        {/* Google */}
        <Button
          variant="outline"
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="h-11 w-full rounded-lg border-border bg-background font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          {loading ? (
            <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
          ) : (
            <svg
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
              className="size-5"
            >
              <path
                fill="#FFC107"
                d="M43.611 20.083H42V20H24v8h11.303C33.654 32.657 29.223 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917Z"
              />
              <path
                fill="#FF3D00"
                d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4c-7.682 0-14.344 4.337-17.694 10.691Z"
              />
              <path
                fill="#4CAF50"
                d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44Z"
              />
              <path
                fill="#1976D2"
                d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917Z"
              />
            </svg>
          )}

          <span>Google</span>
        </Button>
      </form>
    </div>
  );
}
