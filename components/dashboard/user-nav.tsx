"use client";

import { useState } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import {
  Check,
  ChevronDown,
  GraduationCap,
  LogOut,
  Settings2,
  ShieldCheck,
  UserRound,
  LoaderCircle,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function UserNav() {
  const { data: session, status } = useSession();
  const t = useTranslations("auth");
  const locale = useLocale();

  const isArabic = locale.startsWith("ar");
  const [isSigningOut, setIsSigningOut] = useState(false);

  const user = session?.user;
  const name = user?.name?.trim() || (isArabic ? "المستخدم" : "User");
  const email = user?.email || "";
  const image = user?.image || undefined;

  const initials =
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase() || "U";

  const role = (user as (typeof user & { role?: string }) | undefined)?.role;

  const roleLabel =
    role === "TEACHER" || role === "INSTRUCTOR"
      ? isArabic
        ? "مدرّس"
        : "Teacher"
      : role === "ADMIN"
        ? isArabic
          ? "مدير النظام"
          : "Administrator"
        : isArabic
          ? "طالب"
          : "Student";

  const basePath = `/${locale}`;

  async function handleSignOut() {
    if (isSigningOut) return;

    setIsSigningOut(true);

    try {
      await signOut({
        redirectTo: `${basePath}/auth/login`,
      });
    } catch (error) {
      console.error("Sign out failed:", error);
      setIsSigningOut(false);
    }
  }

  if (status === "loading") {
    return (
      <div className="flex size-10 items-center justify-center">
        <LoaderCircle className="size-4 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    return (
      <Button asChild variant="outline" size="sm" className="rounded-xl">
        <Link href={`${basePath}/auth/login`}>
          {isArabic ? "تسجيل الدخول" : "Sign in"}
        </Link>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="group h-auto gap-2 rounded-xl p-1 hover:cursor-pointer"
          aria-label={isArabic ? "قائمة المستخدم" : "User menu"}
        >
          <Avatar >
            <AvatarImage src={image} alt={name} />
            <AvatarFallback >
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="hidden min-w-0 text-start sm:block">
            <p className="max-w-32 truncate text-xs font-semibold text-foreground">
              {name}
            </p>
            <p className="mt-0.5 text-[10px] text-muted-foreground">
              {roleLabel}
            </p>
          </div>

          <ChevronDown className="hidden size-3.5 text-muted-foreground transition-transform group-data-[state=open]:rotate-180 sm:block" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-64 rounded-2xl border-border/80 bg-popover p-1.5 shadow-lg"
      >
        {/* Account identity */}
        <DropdownMenuLabel className="p-2.5 font-normal">
          <div className="flex min-w-0 items-center gap-3">
            <Avatar size="lg">
              <AvatarImage src={image} alt={name} />
              <AvatarFallback>
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-foreground">
                {name}
              </p>
              <p
                dir="ltr"
                className="mt-1 truncate text-start text-xs text-muted-foreground"
              >
                {email}
              </p>
              <span className="mt-2 inline-flex items-center gap-1 rounded-md bg-primary/10 px-1.5 py-1 text-[10px] font-medium text-primary">
                {role === "TEACHER" || role === "INSTRUCTOR" ? (
                  <GraduationCap className="size-3" />
                ) : role === "ADMIN" ? (
                  <ShieldCheck className="size-3" />
                ) : (
                  <UserRound className="size-3" />
                )}
                {roleLabel}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="mx-1 bg-border/80" />

        {/* Navigation */}
        <DropdownMenuGroup>
          <DropdownMenuItem
            asChild
            className="cursor-pointer rounded-xl px-2.5 py-2.5"
          >
            <Link
              href={`${basePath}/profile`}
              className="flex items-center gap-2.5"
            >
              <UserRound className="size-4 text-muted-foreground" />
              <span className="flex-1">{t("profile")}</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="mx-1 bg-border/80" />

        {/* Sign out */}
        <DropdownMenuItem
          disabled={isSigningOut}
          onSelect={(event) => {
            event.preventDefault();
            void handleSignOut();
          }}
          className="cursor-pointer rounded-xl px-2.5 py-2.5 text-destructive focus:bg-destructive/10 focus:text-destructive"
        >
          {isSigningOut ? (
            <LoaderCircle className="size-4 animate-spin" />
          ) : (
            <LogOut className="size-4" />
          )}

          <span className="flex-1">
            {isSigningOut
              ? isArabic
                ? "جارٍ تسجيل الخروج..."
                : "Signing out..."
              : t("logout")}
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
