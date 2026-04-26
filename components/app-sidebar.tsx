"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { 
  BookOpen, LayoutDashboard, Users, Settings, 
  GraduationCap, ClipboardList, Trophy, LogOut,
  Brush, Sparkles, UserCircle,
  Paperclip
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import Logo from "./layout/logo";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const t = useTranslations("Common");
  const sidebarItems = useTranslations("Sidebar");
  const isRTL = useLocale() === "ar";
  
  const isTeacher = pathname.includes("/teacher");
  
  const navItems = isTeacher ? [
    { title: t("dashboard"), url: "/teacher", icon: LayoutDashboard },
    { title: sidebarItems("myCourses"), url: "/teacher/courses", icon: BookOpen },
    { title: sidebarItems("myQuizzes"), url: "/teacher/quizzes", icon: Settings },
    { title: sidebarItems("students"), url: "/teacher/students", icon: Users },
    { title: sidebarItems("sendMessage"), url: "/teacher/messages", icon: Paperclip },
  ] : [
    { title: t("dashboard"), url: "/student", icon: LayoutDashboard },
    { title: sidebarItems("myCourses"), url: "/student/courses", icon: GraduationCap },
    { title: sidebarItems("myQuizzes"), url: "/student/quizzes", icon: ClipboardList },
    { title: sidebarItems("myResults"), url: "/student/results", icon: Trophy },
    { title: sidebarItems("messages"), url: "/student/messages", icon: Paperclip },
    
  ];

  return (
    <Sidebar 
      variant="inset" 
      {...props} 
      side={isRTL ? "right" : "left"}
      className="border-none bg-zinc-50/50 dark:bg-zinc-950/50"
    >
      <SidebarHeader className="h-20 flex justify-center px-6">
        <Logo />
      </SidebarHeader>
      
      <SidebarContent className="px-3">
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">
            {isTeacher ? t("teacherPortal") : t("studentPortal")}
          </SidebarGroupLabel>
          
          <SidebarMenu className="gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.url;
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActive}
                    tooltip={item.title}
                    className={cn(
                      "h-11 px-3 rounded-xl transition-all duration-200",
                      isActive 
                        ? "bg-white dark:bg-zinc-900 shadow-sm text-primary font-bold" 
                        : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900/50"
                    )}
                  >
                    <Link href={item.url} className="flex items-center gap-3">
                      <item.icon className={cn("size-5", isActive ? "text-primary" : "text-zinc-400")} />
                      <span className="text-[14px]">{item.title}</span>
                      {isActive && (
                         <div className={cn(
                            "absolute w-1 h-5 bg-primary rounded-full",
                            isRTL ? "left-1" : "right-1"
                         )} />
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 mt-auto">
        <div className="bg-zinc-100/50 dark:bg-zinc-900/50 rounded-2xl p-2 space-y-1">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton 
                asChild
                className="rounded-lg h-10 hover:bg-white dark:hover:bg-zinc-800 transition-colors"
              >
                <Link href="/profile" className="flex items-center gap-3 text-zinc-600 dark:text-zinc-400">
                  <UserCircle className="size-4" />
                  <span className="text-sm font-medium">{sidebarItems("settings")}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton
                className="h-10 rounded-lg text-zinc-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                onClick={() => signOut({ redirectTo: "/" })}
              >
                <LogOut className="size-4" />
                <span className="text-sm font-medium">{t("logout")}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}