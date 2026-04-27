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
import { Card, CardContent } from "@/components/ui/card";

// تعريف Schema التحقق باستخدام Zod
const registerSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
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

  const onSubmit = async (values: RegisterValues) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      toast.success(t("register.successToast") || "Account created successfully!");
      router.push("/auth/login");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-none shadow-lg dark:bg-slate-900/50">
      <CardContent className="grid gap-4 pt-6">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">{t("name")}</Label>
            <Input
              {...form.register("name")}
              id="name"
              placeholder="Full Name"
              disabled={isLoading}
            />
            {form.formState.errors.name && (
              <p className="text-xs text-destructive">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">{t("email")}</Label>
            <Input
              {...form.register("email")}
              id="email"
              type="email"
              placeholder="name@example.com"
              disabled={isLoading}
            />
            {form.formState.errors.email && (
              <p className="text-xs text-destructive">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">{t("password")}</Label>
            <Input
              {...form.register("password")}
              id="password"
              type="password"
              disabled={isLoading}
            />
            {form.formState.errors.password && (
              <p className="text-xs text-destructive">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>

          <div className="grid gap-2 w-full">
            <Label htmlFor="role">{t("role")}</Label>
            <Select
              onValueChange={(value) =>
                form.setValue("role", value as "student" | "teacher")
              }
              defaultValue={form.getValues("role")}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("selectRole")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student">{t("student")}</SelectItem>
                <SelectItem value="teacher">{t("teacher")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full mt-2" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t("createAccount")}
          </Button>
        </form>

        <p className="text-sm text-center text-muted-foreground">
          {t("hasAccount")}{" "}
          <Link href="/auth/login" className="text-primary hover:underline">
            {t("login.title")}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
