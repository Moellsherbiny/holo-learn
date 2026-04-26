"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard, BookOpen, Layers, FileText, ClipboardList,
  Users, TrendingUp, Settings, LogOut, Menu, Globe,
  Cpu, Sparkles, ChevronRight, X,
} from "lucide-react";
import type { UserRole } from "@/lib/mock-data";

interface NavItem {
  key: string;
  href: string;
  icon: React.ReactNode;
  teacherOnly?: boolean;
  studentOnly?: boolean;
  badge?: string;
  badgeVariant?: "cyan" | "violet";
}

const NAV_ITEMS: NavItem[] = [
  { key: "nav.dashboard", href: "",            icon: <LayoutDashboard size={17} /> },
  { key: "nav.courses",   href: "/courses",    icon: <BookOpen size={17} /> },
  { key: "nav.modules",   href: "/modules",    icon: <Layers size={17} />,   teacherOnly: true },
  { key: "nav.lessons",   href: "/lessons",    icon: <FileText size={17} />, teacherOnly: true },
  { key: "nav.quizzes",   href: "/quizzes",    icon: <ClipboardList size={17} /> },
  { key: "nav.students",  href: "/students",   icon: <Users size={17} />,    teacherOnly: true },
  { key: "nav.progress",  href: "/progress",   icon: <TrendingUp size={17} />, studentOnly: true },
  {
    key: "nav.hologram", href: "/hologram", icon: <Cpu size={17} />,
    teacherOnly: true, badge: "HOL", badgeVariant: "cyan",
  },
  {
    key: "nav.ar_session", href: "/ar", icon: <Sparkles size={17} />,
    studentOnly: true, badge: "AR", badgeVariant: "violet",
  },
  { key: "nav.settings",  href: "/settings",   icon: <Settings size={17} /> },
];

export function DashboardLayout({
  children,
  role,
}: {
  children: React.ReactNode;
  role: UserRole;
}) {
  const t = useTranslations();
  const locale = useLocale();
  const pathname = usePathname();
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const isRtl = locale === "ar";

  const base = `/${locale}/dashboard/${role.toLowerCase()}`;
  const user = session?.user;
  const initials = (user?.name ?? "??").split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  const filteredNav = NAV_ITEMS.filter((item) => {
    if (item.teacherOnly && role !== "TEACHER") return false;
    if (item.studentOnly && role !== "STUDENT") return false;
    return true;
  });

  const Sidebar = () => (
    <div className="flex flex-col h-full bg-card">
      {/* Brand */}
      <div className="flex items-center gap-3 px-5 py-[18px] border-b border-border shrink-0">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shrink-0">
          <Cpu size={16} className="text-white" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground truncate leading-tight">HoloLearn</p>
          <p className="text-[10px] text-muted-foreground truncate leading-tight mt-0.5">
            {role === "TEACHER" ? t("dashboard.teacher_title") : t("dashboard.student_title")}
          </p>
        </div>
        <button
          className="ms-auto lg:hidden text-muted-foreground hover:text-foreground"
          onClick={() => setOpen(false)}
        >
          <X size={18} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
        {filteredNav.map((item) => {
          const href = `${base}${item.href}`;
          const active =
            item.href === ""
              ? pathname === base || pathname === base + "/"
              : pathname.startsWith(href);

          return (
            <Link
              key={item.key}
              href={href}
              onClick={() => setOpen(false)}
              className={cn(
                "group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all",
                isRtl && "flex-row-reverse",
                active
                  ? "bg-primary text-primary-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              <span className="shrink-0">{item.icon}</span>
              <span className={cn("flex-1 truncate", isRtl && "text-right")}>{t(item.key)}</span>
              {item.badge && (
                <Badge
                  className={cn(
                    "text-[9px] px-1.5 py-0 h-4 font-semibold border-0",
                    active
                      ? "bg-white/20 text-white"
                      : item.badgeVariant === "cyan"
                      ? "bg-cyan-500/15 text-cyan-600 dark:text-cyan-400"
                      : "bg-violet-500/15 text-violet-600 dark:text-violet-400"
                  )}
                >
                  {item.badge}
                </Badge>
              )}
              {active && (
                <ChevronRight
                  size={13}
                  className={cn("shrink-0 opacity-60", isRtl && "rotate-180")}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User footer */}
      <div className="shrink-0 px-3 pb-3 pt-2 border-t border-border space-y-1">
        {/* Language toggle */}
        <div className="flex items-center gap-2 px-3 py-2">
          <Globe size={13} className="text-muted-foreground shrink-0" />
          <div className="flex gap-1">
            {["en", "ar"].map((l) => (
              <Link
                key={l}
                href={pathname.replace(`/${locale}`, `/${l}`)}
                className={cn(
                  "text-[11px] px-2 py-0.5 rounded-md font-medium transition-colors",
                  locale === l
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent"
                )}
              >
                {l.toUpperCase()}
              </Link>
            ))}
          </div>
        </div>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className={cn(
                "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-accent transition-colors text-left",
                isRtl && "flex-row-reverse text-right"
              )}
            >
              <Avatar className="w-7 h-7 shrink-0">
                <AvatarImage src={user?.image ?? undefined} />
                <AvatarFallback className="text-[11px] bg-primary/10 text-primary font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground truncate">{user?.name ?? "User"}</p>
                <p className="text-[10px] text-muted-foreground truncate">{user?.email}</p>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align={isRtl ? "end" : "start"} className="w-44 mb-1">
            <DropdownMenuItem asChild>
              <Link href={`${base}/settings`}>
                <Settings size={13} className="me-2" />
                {t("nav.settings")}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => signOut({ callbackUrl: `/${locale}/login` })}
            >
              <LogOut size={13} className="me-2" />
              {t("nav.logout")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );

  return (
    <div
      className="min-h-screen bg-background flex"
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 border-e border-border fixed inset-y-0 start-0 z-30 shrink-0">
        <Sidebar />
      </aside>

      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 z-50 w-64 flex flex-col border-e border-border lg:hidden transition-transform duration-200 ease-out",
          isRtl ? "right-0 border-e-0 border-s" : "left-0",
          open ? "translate-x-0" : isRtl ? "translate-x-full" : "-translate-x-full"
        )}
      >
        <Sidebar />
      </aside>

      {/* Content */}
      <div className="flex-1 flex flex-col min-h-screen lg:ms-60">
        {/* Topbar */}
        <header className="sticky top-0 z-20 h-14 border-b border-border bg-background/80 backdrop-blur-md flex items-center px-4 gap-3 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden h-8 w-8"
            onClick={() => setOpen(true)}
          >
            <Menu size={18} />
          </Button>

          {/* Page title from breadcrumb could go here */}
          <div className="flex-1" />

          {/* Status pill */}
          {role === "TEACHER" ? (
            <div className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 font-medium">
              <Cpu size={12} />
              <span>{t("teacher.hologram_inactive")}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-600 dark:text-violet-400 font-medium">
              <Sparkles size={12} />
              <span>{t("student.ar_available")}</span>
            </div>
          )}
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}