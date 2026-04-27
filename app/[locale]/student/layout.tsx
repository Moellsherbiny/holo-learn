import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import LanguageSwitcher from "@/components/layout/language-switcher";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { cn } from "@/lib/utils";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isRtl = locale === "ar";
  const session = await auth();

  if (!session?.user?.id) redirect("/auth/login");
  if (session?.user?.role !== "STUDENT") redirect("/");

  return (
    <SidebarProvider>
      <div
        className={cn(
          "flex h-screen w-full overflow-hidden bg-zinc-50/50 dark:bg-zinc-950",
          isRtl ? "font-arabic" : "font-sans",
        )}
        dir={isRtl ? "rtl" : "ltr"}
      >
        <AppSidebar />

        {/* SidebarInset must fill remaining height and not scroll itself */}
        <SidebarInset className="flex flex-col min-h-0 flex-1 bg-transparent overflow-hidden">

          {/* Sticky Header — fixed 64px, set as CSS var for children to use */}
          <header
            style={{ "--header-height": "64px" } as React.CSSProperties}
            className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between px-6
                       border-b border-zinc-200/50 dark:border-zinc-800/50
                       bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md"
          >
            <div className="flex items-center gap-4">
              <SidebarTrigger className="-ms-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors" />
              <Separator orientation="vertical" className="h-6 bg-zinc-200 dark:bg-zinc-800" />
              <div className="flex flex-col">
                <h1 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 leading-none mb-1">
                  Platform
                </h1>
                <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  Overview
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-6">
              <div className="hidden sm:block">
                <LanguageSwitcher />
              </div>
              <Link href="/profile" className="group relative">
                <div className="absolute -inset-0.5 rounded-full bg-linear-to-tr from-primary to-purple-500 opacity-0 group-hover:opacity-100 transition duration-300 blur" />
                <Avatar className="relative h-9 w-9 border-2 border-white dark:border-zinc-950 shadow-sm">
                  <AvatarImage src={session?.user?.image as string} alt="User" />
                  <AvatarFallback className="bg-zinc-100 dark:bg-zinc-800 text-[10px] font-black">
                    {session?.user?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
              </Link>
            </div>
          </header>

          {/*
            Main content area:
            - flex-1 + min-h-0 → takes remaining height after the header
            - overflow-hidden → lets each page control its own scroll
            Pages that need full-height (like the course page) render edge-to-edge.
            Pages that need a padded container wrap themselves in their own div.
          */}
          <main 
            className="flex-1 overflow-y-auto"
            dir={isRtl ? "rtl" : "ltr"}
          >
            <div className="mx-auto w-full max-w-7xl p-6 md:p-10 lg:p-12 animate-in fade-in slide-in-from-bottom-2 duration-500">
              {children}
            </div>
          </main>

        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}