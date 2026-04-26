// components/dashboard/sidebar.tsx
"use client";

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  BookOpen, 
  Box,
  Settings, 
  Users,
  Menu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navItems = [
  { name: 'dashboard', href: '', icon: LayoutDashboard },
  { name: 'myCourses', href: '/courses', icon: BookOpen },
  { name: 'arLessons', href: '/ar-view', icon: Box },
  { name: 'settings', href: '/settings', icon: Settings },
];

export function Sidebar({ role }: { role: 'student' | 'teacher' }) {
  const t = useTranslations('Dashboard');
  const pathname = usePathname();

  const NavContent = () => (
    <div className="flex flex-col gap-4 py-4">
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
          {role === 'teacher' ? t('teacherPanel') : t('studentPanel')}
        </h2>
        <div className="space-y-1">
          {navItems.map((item) => (
            <Button
              key={item.name}
              asChild
              variant={pathname.includes(item.href) ? "secondary" : "ghost"}
              className="w-full justify-start gap-2"
            >
              <Link href={`/${role}${item.href}`}>
                <item.icon className="h-4 w-4" />
                {t(item.name)}
              </Link>
            </Button>
          ))}
          {role === 'teacher' && (
             <Button variant="ghost" className="w-full justify-start gap-2 text-primary">
                <Users className="h-4 w-4" />
                {t('manageStudents')}
             </Button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Trigger */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden fixed top-4 left-4 z-50">
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <NavContent />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r min-h-screen bg-card">
        <NavContent />
      </aside>
    </>
  );
}