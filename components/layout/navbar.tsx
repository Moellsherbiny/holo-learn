"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { HologramLogo } from "./logo";
import { ModeToggle } from "./theme-toggle";

// ─── Types ────────────────────────────────────────────────────────────────────

type NavItem = {
  labelKey: string;
  href: string;
  icon: React.ReactNode;
};


const NAV_ITEMS: NavItem[] = [
  {
    labelKey: "nav.dashboard",
    href: "/",
    icon: <LayoutDashboard size={16} />,
  },
  {
    labelKey: "nav.courses",
    href: "/courses",
    icon: <BookOpen size={16} />,
  },
  
  {
    labelKey: "nav.about",
    href: `/#about`,
    icon: <Cpu size={16} />,
  },
];

// ─── Locale switcher ──────────────────────────────────────────────────────────

function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();

  // Strip the current locale prefix and replace with the opposite
  const switchTo = locale === "ar" ? "en" : "ar";
  // Assumes [locale] segment is first: /ar/dashboard → /en/dashboard
  const newPath = pathname.replace(`/${locale}`, `/${switchTo}`);

  return (
    <Button
      variant="ghost"
      size="sm"
      asChild
      className="gap-1.5 font-medium text-sm"
      aria-label="Switch language"
    >
      <Link href={newPath}>
        <Globe size={15} />
        {switchTo.toUpperCase()}
      </Link>
    </Button>
  );
}

// ─── User menu ────────────────────────────────────────────────────────────────

function UserMenu() {
  const { data: session } = useSession();
  const t = useTranslations();

  if (!session?.user) {
    return (
      <Button asChild size="sm" className="rounded-full px-5 font-medium">
        <Link href="/auth/login">{t("nav.signIn")}</Link>
      </Button>
    );
  }

  const initials = session.user.name
    ? session.user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 rounded-full px-2 pr-3 focus-visible:ring-2"
        >
          <Avatar className="h-7 w-7">
            <AvatarImage src={session.user.image ?? undefined} />
            <AvatarFallback className="text-xs font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <span className="hidden text-sm font-medium sm:inline-block max-w-30 truncate">
            {session.user.name}
          </span>
          <ChevronDown size={14} className="text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-52">
        <div className="px-3 py-2">
          <p className="text-sm font-medium truncate">{session.user.name}</p>
          <p className="text-xs text-muted-foreground truncate">
            {session.user.email}
          </p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile" className="cursor-pointer gap-2">
            <User size={14} />
            {t("nav.profile")}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="gap-2 text-destructive focus:text-destructive cursor-pointer"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOut size={14} />
          {t("nav.signOut")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ─── Desktop nav links ────────────────────────────────────────────────────────

function NavLinks({ className }: { className?: string }) {
  const t = useTranslations();
  const pathname = usePathname();
  const locale = useLocale();

  return (
    <nav className={cn("flex items-center gap-1", className)}>
      {NAV_ITEMS.map((item) => {
        const fullHref = `/${locale}${item.href}`;
        const isActive = pathname.startsWith(fullHref);
        return (
          <Link
            key={item.href}
            href={fullHref}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
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

// ─── Mobile drawer ────────────────────────────────────────────────────────────

function MobileDrawer() {
  const [open, setOpen] = useState(false);
  const t = useTranslations();
  const pathname = usePathname();
  const locale = useLocale();
  const { data: session } = useSession();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Open menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </SheetTrigger>

      <SheetContent
        side={locale === "ar" ? "right" : "left"}
        className="w-72 px-0 pt-0"
      >
        {/* Header */}
        <div className="flex items-center gap-3 border-b px-5 py-4">
          <HologramLogo size={28} />
          <div>
            <p className="text-sm font-semibold leading-tight">
              {t("brand.name")}
            </p>
            <Badge
              variant="secondary"
              className="mt-0.5 text-[10px] px-1.5 py-0"
            >
              CS Dept
            </Badge>
          </div>
        </div>

        {/* Links */}
        <div className="flex flex-col gap-0.5 p-3">
          {NAV_ITEMS.map((item) => {
            const fullHref = `/${locale}${item.href}`;
            const isActive = pathname.startsWith(fullHref);
            return (
              <Link
                key={item.href}
                href={fullHref}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground",
                )}
              >
                {item.icon}
                {t(item.labelKey)}
              </Link>
            );
          })}
        </div>

        {/* User + locale at bottom */}
        <div className="absolute bottom-0 left-0 right-0 border-t p-4 space-y-3">
          {session?.user ? (
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={session.user.image ?? undefined} />
                <AvatarFallback className="text-xs">
                  {session.user.name?.[0]?.toUpperCase() ?? "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {session.user.name}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {session.user.email}
                </p>
              </div>
            </div>
          ) : null}

          <div className="flex items-center justify-between">
            <LocaleSwitcher />
            {session?.user ? (
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 text-destructive hover:text-destructive"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                <LogOut size={14} />
                {t("nav.signOut")}
              </Button>
            ) : (
              <Button asChild size="sm">
                <Link href="/auth/login" onClick={() => setOpen(false)}>
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

// ─── Main Navbar ──────────────────────────────────────────────────────────────

export default function Navbar() {
  const t = useTranslations();
  const locale = useLocale();
  const [scrolled, setScrolled] = useState(false);
  const session = useSession();
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      dir={locale === "ar" ? "rtl" : "ltr"}
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-200",
        scrolled
          ? "border-b bg-background/80 backdrop-blur-md shadow-sm"
          : "border-b border-transparent bg-background",
      )}
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        
        <div className="flex items-center gap-6">
          <Link
            href={`/${locale}`}
            className="flex items-center gap-2.5 group"
            aria-label={t("brand.name")}
          >
            <span className="text-primary transition-opacity group-hover:opacity-80">
              
            </span>
            <div className="hidden sm:flex flex-col leading-tight">
              <span className="text-sm font-semibold tracking-tight">
                {t("brand.name")}
              </span>
              <span className="text-[10px] text-muted-foreground font-medium tracking-wide uppercase">
                {t("brand.dept")}
              </span>
            </div>
          </Link>

          {/* Desktop nav — hidden on small screens */}
          <NavLinks className="hidden md:flex" />
        </div>

        {/* Right: locale + user + mobile trigger */}
        <div className="flex items-center gap-1">
          <div className="hidden md:block">
            <LocaleSwitcher />
            <ModeToggle />
          </div>
          {session.data?.user && 
            <Button asChild variant="outline">
              <Link href={session.data.user.role === "TEACHER" ? "/teacher" : "student"}>{t("nav.dashboard")}</Link>
            </Button>
          }
          <UserMenu />
          <MobileDrawer />
        </div>
      </div>
    </header>
  );
}
