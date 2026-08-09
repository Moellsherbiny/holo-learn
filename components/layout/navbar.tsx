"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { signOut, useSession } from "next-auth/react";

import {
  Menu,
  X,
  Globe,
  LogOut,
  User,
  BookOpen,
  LayoutDashboard,
  Cpu,
  ChevronDown,
  Home,
} from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Badge } from "@/components/ui/badge";

import { HologramLogo } from "./logo";
import { ModeToggle } from "./theme-toggle";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

type NavItem = {
  labelKey: string;
  href: string;
  icon: React.ReactNode;
};

/* -------------------------------------------------------------------------- */
/* Navigation                                                                 */
/* -------------------------------------------------------------------------- */

const NAV_ITEMS: NavItem[] = [
  {
    labelKey: "nav.home",
    href: "/",
    icon: <Home size={16} />,
  },
  {
    labelKey: "nav.courses",
    href: "/courses",
    icon: <BookOpen size={16} />,
  },
  {
    labelKey: "nav.about",
    href: "/#about",
    icon: <Cpu size={16} />,
  },
];

/* -------------------------------------------------------------------------- */
/* Locale Switcher                                                            */
/* -------------------------------------------------------------------------- */

function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();

  const switchTo = locale === "ar" ? "en" : "ar";

  const newPath = pathname.replace(
    `/${locale}`,
    `/${switchTo}`
  );

  return (
    <Button
      variant="ghost"
      size="sm"
      asChild
      className="gap-1.5 px-2 text-sm font-medium"
      aria-label="Switch language"
    >
      <Link href={newPath}>
        <Globe size={15} />
        <span>{switchTo.toUpperCase()}</span>
      </Link>
    </Button>
  );
}

/* -------------------------------------------------------------------------- */
/* User Menu                                                                  */
/* -------------------------------------------------------------------------- */

function UserMenu() {
  const { data: session } = useSession();
  const t = useTranslations();

  if (!session?.user) {
    return (
      <Button
        asChild
        size="sm"
        className="rounded-full px-5 font-medium"
      >
        <Link href="/auth/login">
          {t("nav.signIn")}
        </Link>
      </Button>
    );
  }

  const initials =
    session.user.name
      ?.split(" ")
      .map((name) => name[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) ?? "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-9 items-center gap-2 rounded-full px-2 pe-3 focus-visible:ring-2"
        >
          <Avatar className="h-7 w-7">
            <AvatarImage
              src={
                session.user.image ??
                undefined
              }
              alt={
                session.user.name ??
                "User"
              }
            />

            <AvatarFallback className="text-xs font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>

          <span className="hidden max-w-32 truncate text-sm font-medium sm:inline-block">
            {session.user.name}
          </span>

          <ChevronDown
            size={14}
            className="text-muted-foreground"
          />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-56"
      >
        <div className="px-3 py-2">
          <p className="truncate text-sm font-medium">
            {session.user.name}
          </p>

          <p className="truncate text-xs text-muted-foreground">
            {session.user.email}
          </p>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link
            href="/profile"
            className="cursor-pointer gap-2"
          >
            <User size={14} />
            {t("nav.profile")}
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="cursor-pointer gap-2 text-destructive focus:text-destructive"
          onClick={() =>
            signOut({
              callbackUrl: "/",
            })
          }
        >
          <LogOut size={14} />
          {t("nav.signOut")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/* -------------------------------------------------------------------------- */
/* Desktop Navigation                                                         */
/* -------------------------------------------------------------------------- */

function NavLinks({
  className,
}: {
  className?: string;
}) {
  const t = useTranslations();
  const pathname = usePathname();
  const locale = useLocale();

  return (
    <nav
      className={cn(
        "flex items-center gap-1",
        className
      )}
    >
      {NAV_ITEMS.map((item) => {
        const fullHref = `/${locale}${item.href}`;

        const isActive =
          item.href === "/"
            ? pathname === `/${locale}`
            : pathname.startsWith(fullHref);

        return (
          <Link
            key={item.href}
            href={fullHref}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
          >
            {item.icon}

            {t(item.labelKey)}
          </Link>
        );
      })}
    </nav>
  );
}

/* -------------------------------------------------------------------------- */
/* Mobile Drawer                                                              */
/* -------------------------------------------------------------------------- */

function MobileDrawer() {
  const [open, setOpen] = useState(false);

  const t = useTranslations();
  const pathname = usePathname();
  const locale = useLocale();

  const { data: session } = useSession();

  const dashboardHref =
    session?.user?.role === "TEACHER"
      ? "/teacher"
      : "/student";

  return (
    <Sheet
      open={open}
      onOpenChange={setOpen}
    >
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Open menu"
        >
          {open ? (
            <X size={20} />
          ) : (
            <Menu size={20} />
          )}
        </Button>
      </SheetTrigger>

      <SheetContent
        side={
          locale === "ar"
            ? "right"
            : "left"
        }
        className="w-80 px-0 pt-0"
      >
        {/* Header */}
        <div className="flex items-center gap-3 border-b px-5 py-4">
          <HologramLogo size={30} />

          <div>
            <p className="text-sm font-semibold leading-tight">
              {t("brand.name")}
            </p>

            <Badge
              variant="secondary"
              className="mt-1 px-1.5 py-0 text-[10px]"
            >
              {t("brand.dept")}
            </Badge>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex flex-col gap-1 p-3">
          {NAV_ITEMS.map((item) => {
            const fullHref = `/${locale}${item.href}`;

            const isActive =
              item.href === "/"
                ? pathname === `/${locale}`
                : pathname.startsWith(
                    fullHref
                  );

            return (
              <Link
                key={item.href}
                href={fullHref}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                {item.icon}

                {t(item.labelKey)}
              </Link>
            );
          })}

          {/* Dashboard */}
          {session?.user && (
            <Link
              href={`/${locale}${dashboardHref}`}
              onClick={() => setOpen(false)}
              className="mt-2 flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <LayoutDashboard size={16} />

              {t("nav.dashboard")}
            </Link>
          )}
        </div>

        {/* Bottom */}
        <div className="absolute inset-x-0 bottom-0 space-y-4 border-t bg-background p-4">
          {/* User */}
          {session?.user && (
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9">
                <AvatarImage
                  src={
                    session.user.image ??
                    undefined
                  }
                />

                <AvatarFallback>
                  {session.user.name
                    ?.charAt(0)
                    .toUpperCase() ?? "U"}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">
                  {session.user.name}
                </p>

                <p className="truncate text-xs text-muted-foreground">
                  {session.user.email}
                </p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <LocaleSwitcher />
              <ModeToggle />
            </div>

            {session?.user ? (
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={() =>
                  signOut({
                    callbackUrl: "/",
                  })
                }
              >
                <LogOut size={14} />

                {t("nav.signOut")}
              </Button>
            ) : (
              <Button
                asChild
                size="sm"
              >
                <Link
                  href="/auth/login"
                  onClick={() =>
                    setOpen(false)
                  }
                >
                  {t("nav.signIn")}
                </Link>
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

/* -------------------------------------------------------------------------- */
/* Main Navbar                                                                */
/* -------------------------------------------------------------------------- */

export default function Navbar() {
  const t = useTranslations();
  const locale = useLocale();

  const [scrolled, setScrolled] =
    useState(false);

  const { data: session } =
    useSession();

  useEffect(() => {
    const handler = () => {
      setScrolled(
        window.scrollY > 8
      );
    };

    window.addEventListener(
      "scroll",
      handler,
      { passive: true }
    );

    return () =>
      window.removeEventListener(
        "scroll",
        handler
      );
  }, []);

  const dashboardHref =
    session?.user?.role === "TEACHER"
      ? "/teacher"
      : session?.user?.role ===
          "STUDENT"
        ? "/student"
        : "/admin";

  return (
    <header
      dir={
        locale === "ar"
          ? "rtl"
          : "ltr"
      }
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-200",
        scrolled
          ? "border-b bg-background/80 shadow-sm backdrop-blur-md"
          : "border-b border-transparent bg-background"
      )}
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        {/* Brand + Desktop Nav */}
        <div className="flex min-w-0 items-center gap-6">
          <Link
            href={`/${locale}`}
            className="group flex shrink-0 items-center gap-2.5"
            aria-label={t(
              "brand.name"
            )}
          >
            <span className="text-primary transition-opacity group-hover:opacity-80">
              <HologramLogo size={30} />
            </span>

            <div className="hidden flex-col leading-tight sm:flex">
              <span className="text-sm font-semibold tracking-tight">
                {t("brand.name")}
              </span>

              <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                {t("brand.dept")}
              </span>
            </div>
          </Link>

          <NavLinks className="hidden md:flex" />
        </div>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-1">
          {/* Desktop Locale + Theme */}
          <div className="hidden items-center md:flex">
            <LocaleSwitcher />
            <ModeToggle />
          </div>

          {/* Dashboard */}
          {session?.user && (
            <Button
              asChild
              size="sm"
              variant="outline"
              className="hidden gap-2 sm:flex"
            >
              <Link
                href={`/${locale}${dashboardHref}`}
              >
                <LayoutDashboard
                  size={15}
                />

                {t("nav.dashboard")}
              </Link>
            </Button>
          )}

          <UserMenu />

          <MobileDrawer />
        </div>
      </div>
    </header>
  );
}