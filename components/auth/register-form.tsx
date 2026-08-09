
"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { Loader2 } from "lucide-react";

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

const registerSchema = z.object({
  name: z
    .string()
    .min(2, "Name is too short"),

  email: z.email("Invalid email address"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),

  role: z.enum(["student", "teacher"], {
    message: "Please select a role",
  }),
});

type RegisterValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const t = useTranslations("auth");
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),

    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "student",
    },
  });

  const onSubmit = async (
    values: RegisterValues
  ) => {
    setIsLoading(true);

    try {
      const response = await fetch(
        "/api/auth/register",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(values),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Something went wrong"
        );
      }

      toast.success(
        t("register.successToast")
      );

      router.push("/auth/login");
    } catch (error) {
      console.error(error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="w-full"
      dir="rtl"
    >
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid gap-5"
      >
        {/* Name */}
        <div className="grid gap-2">
          <Label htmlFor="name">
            {t("name")}
          </Label>

          <Input
            {...form.register("name")}
            id="name"
            type="text"
            placeholder={t("name")}
            autoComplete="name"
            disabled={isLoading}
            aria-invalid={
              !!form.formState.errors.name
            }
          />

          {form.formState.errors.name && (
            <p className="text-xs text-destructive">
              {
                form.formState.errors.name
                  .message
              }
            </p>
          )}
        </div>

        {/* Email */}
        <div className="grid gap-2">
          <Label htmlFor="email">
            {t("email")}
          </Label>

          <Input
            {...form.register("email")}
            id="email"
            type="email"
            placeholder="name@example.com"
            autoComplete="email"
            disabled={isLoading}
            dir="ltr"
            aria-invalid={
              !!form.formState.errors.email
            }
          />

          {form.formState.errors.email && (
            <p className="text-xs text-destructive">
              {
                form.formState.errors.email
                  .message
              }
            </p>
          )}
        </div>

        {/* Password */}
        <div className="grid gap-2">
          <Label htmlFor="password">
            {t("password")}
          </Label>

          <Input
            {...form.register("password")}
            id="password"
            type="password"
            autoComplete="new-password"
            placeholder={t("password")}
            disabled={isLoading}
            dir="ltr"
            aria-invalid={
              !!form.formState.errors.password
            }
          />

          {form.formState.errors.password && (
            <p className="text-xs text-destructive">
              {
                form.formState.errors.password
                  .message
              }
            </p>
          )}
        </div>

        {/* Role */}
        <div className="grid gap-2">
          <Label htmlFor="role">
            {t("role")}
          </Label>

          <Select
            value={form.watch("role")}
            onValueChange={(
              value
            ) => {
              form.setValue(
                "role",
                value as
                  | "student"
                  | "teacher",
                {
                  shouldValidate: true,
                  shouldDirty: true,
                }
              );
            }}
            disabled={isLoading}
          >
            <SelectTrigger
              id="role"
              className="w-full"
            >
              <SelectValue
                placeholder={t(
                  "selectRole"
                )}
              />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="student">
                {t("student")}
              </SelectItem>

              <SelectItem value="teacher">
                {t("teacher")}
              </SelectItem>
            </SelectContent>
          </Select>

          {form.formState.errors.role && (
            <p className="text-xs text-destructive">
              {
                form.formState.errors.role
                  .message
              }
            </p>
          )}
        </div>

        {/* Submit */}
        <Button
          type="submit"
          className="mt-1 h-11 w-full cursor-pointer"
          disabled={isLoading}
        >
          {isLoading && (
            <Loader2 className="h-4 w-4 animate-spin" />
          )}

          {isLoading
            ? t("loading")
            : t("createAccount")}
        </Button>
      </form>

      {/* Login */}
      <p className="mt-6 text-center text-sm text-muted-foreground">
        {t("hasAccount")}{" "}

        <Link
          href="/auth/login"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          {t("login.title")}
        </Link>
      </p>
    </div>
  );
}
