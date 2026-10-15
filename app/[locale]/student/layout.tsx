
import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowUpRight,
  MessageCircleMore,
} from "lucide-react";

import { auth } from "@/auth";
import { AppSidebar } from "@/components/app-sidebar";
import LanguageSwitcher from "@/components/layout/language-switcher";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { getUnreadMessagesCount } from "@/actions/chat/messagesNotRead";
import { UserNav } from "@/components/dashboard/user-nav";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isArabic = locale.startsWith("ar");
  const isRtl = isArabic;

  const session = await auth();

  if (!session?.user?.id) {
    redirect(`/${locale}/auth/login`);
  }

  if (session.user.role !== "STUDENT") {
    redirect(`/${locale}`);
  }

  const unreadMessagesCount = await getUnreadMessagesCount();
  const userName = session.user.name?.trim() || "User";
  const userInitial = userName.charAt(0).toUpperCase();

  const messagesHref = `/${locale}/chat`;
  const profileHref = `/${locale}/profile`;

  return (
    <SidebarProvider>
      <div
        dir={isRtl ? "rtl" : "ltr"}
        className={cn(
          "flex h-svh w-full overflow-hidden bg-background text-foreground",
          isArabic ? "font-arabic" : "font-sans",
        )}
      >
        <AppSidebar
          unreadMessagesCount={unreadMessagesCount.count}
        />

        <SidebarInset className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-transparent">
          {/* Dashboard header */}
          <header
            style={
              { "--header-height": "4rem" } as CSSProperties
            }
            className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-3 border-b border-border/70 bg-background/90 px-3 backdrop-blur-xl sm:px-5 lg:px-7"
          >
            {/* Sidebar control and page context */}
            <div className="flex min-w-0 items-center gap-3">
              <SidebarTrigger className="size-9 shrink-0 rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground" />

              <Separator
                orientation="vertical"
                className="h-7! bg-border"
              />

              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Optic Learn
                </p>

                <p className="truncate text-sm font-semibold tracking-tight">
                  {isArabic ? "مساحة التعلم" : "Learning Space"}
                </p>
              </div>
            </div>

            {/* Header actions */}
            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              <div className="hidden sm:flex">
                <LanguageSwitcher />
              </div>

              {/* Messages */}
              <Link
                href={messagesHref}
                aria-label={
                  isArabic ? "الرسائل" : "Messages"
                }
                className="group relative inline-flex size-9 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <MessageCircleMore
                  className="size-[18px]"
                  strokeWidth={1.8}
                />

                {unreadMessagesCount.success &&
                  unreadMessagesCount.count > 0 && (
                    <span className="absolute -end-1.5 -top-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full border-2 border-background bg-destructive px-1 text-[9px] font-bold leading-none text-destructive-foreground">
                      {unreadMessagesCount.count > 99
                        ? "99+"
                        : unreadMessagesCount.count}
                    </span>
                  )}
              </Link>

              <UserNav />
            </div>
          </header>

          {/* Main scrollable area */}
          <main
            dir={isRtl ? "rtl" : "ltr"}
            className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-y-contain"
          >
            <div className="mx-auto w-full max-w-7xl animate-in fade-in slide-in-from-bottom-1 duration-300">
              {children}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
