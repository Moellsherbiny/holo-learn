"use client";

import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const t = useTranslations("auth");

  const loginSchema = z.object({
    email: z.email(t("validation.emailRequired")),
    password: z.string().min(6, t("validation.passwordMin")),
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});

  const [loading, setLoading] = useState(false);

  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const result = loginSchema.safeParse({
      email: email.trim(),
      password,
    });

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;

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
        email: email.trim(),
        password,
        callbackUrl: "/",
        redirect: false,
      });

      if (result?.error) {
        setErrors({
          general: t("validation.invalidCredentials"),
        });

        setLoading(false);
        return;
      }

      if (result?.url) {
        window.location.href = result.url;
      }
    } catch (error) {
      console.error(error);

      setErrors({
        general: t("validation.loginError"),
      });

      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);

    await signIn("google", {
      callbackUrl: "/",
    });
  };

  return (
    <div className="w-full" dir="rtl">
      <div className="mb-6">
        <h2 className="text-xl font-semibold">
          {t("login.title")}
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          {t("login.subtitle")}
        </p>
      </div>

      <form
        onSubmit={handleLogin}
        className="grid gap-5"
      >
        {/* General Error */}
        {errors.general && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {errors.general}
          </div>
        )}

        {/* Email */}
        <div className="grid gap-2">
          <Label htmlFor="email">
            {t("email")}
          </Label>

          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder={t("email")}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);

              if (errors.email || errors.general) {
                setErrors((prev) => ({
                  ...prev,
                  email: undefined,
                  general: undefined,
                }));
              }
            }}
            disabled={loading}
            aria-invalid={!!errors.email}
          />

          {errors.email && (
            <p className="text-sm text-destructive">
              {errors.email}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">
              {t("password")}
            </Label>
          </div>

          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder={t("password")}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);

              if (errors.password || errors.general) {
                setErrors((prev) => ({
                  ...prev,
                  password: undefined,
                  general: undefined,
                }));
              }
            }}
            disabled={loading}
            aria-invalid={!!errors.password}
          />

          {errors.password && (
            <p className="text-sm text-destructive">
              {errors.password}
            </p>
          )}
        </div>

        {/* Login Button */}
        <Button
          type="submit"
          disabled={loading}
          className="h-11 w-full cursor-pointer"
        >
          {loading
            ? t("loading")
            : t("loginButton")}
        </Button>

        {/* Divider */}
        <div className="relative my-1">
          <div className="absolute inset-0 flex items-center">
            <Separator />
          </div>

          <div className="relative flex justify-center">
            <span className="bg-card px-3 text-xs text-muted-foreground">
              {t("orContinueWith")}
            </span>
          </div>
        </div>

        {/* Google */}
        <Button
          variant="outline"
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="h-11 w-full cursor-pointer gap-2 transition-colors hover:bg-primary/10 hover:text-primary"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            className="h-5 w-5"
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

          <span>Google</span>
        </Button>
      </form>
    </div>
  );
}
