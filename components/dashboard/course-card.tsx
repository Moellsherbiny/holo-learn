import { useTranslations } from "next-intl";
import Link from "next/link";
import { BookOpen, Users, Layers, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { Course, Enrollment } from "@/lib/mock-data";

const PALETTE = [
  { gradient: "from-cyan-500/20 to-sky-500/10",    icon: "text-cyan-600 dark:text-cyan-400",    ring: "border-cyan-500/20"    },
  { gradient: "from-violet-500/20 to-purple-500/10", icon: "text-violet-600 dark:text-violet-400", ring: "border-violet-500/20" },
  { gradient: "from-emerald-500/20 to-teal-500/10",  icon: "text-emerald-600 dark:text-emerald-400", ring: "border-emerald-500/20" },
  { gradient: "from-amber-500/20 to-orange-500/10",  icon: "text-amber-600 dark:text-amber-400",   ring: "border-amber-500/20"   },
];

// ─── Teacher card ─────────────────────────────────────────────────────────────
export function TeacherCourseCard({ course, locale, index = 0 }: { course: Course; locale: string; index?: number }) {
  const t = useTranslations();
  const p = PALETTE[index % PALETTE.length];

  return (
    <div className={cn("rounded-xl border bg-card overflow-hidden flex flex-col hover:shadow-md transition-shadow duration-200", p.ring)}>
      {/* Thumb */}
      <div className={cn("h-[88px] bg-gradient-to-br flex items-center justify-center relative shrink-0", p.gradient)}>
        {course.thumbnail
          ? <img src={course.thumbnail} alt="" className="w-full h-full object-cover" />
          : <BookOpen size={30} className={cn("opacity-30", p.icon)} />}
      </div>

      <div className="p-4 flex flex-col gap-3 flex-1">
        <div>
          <h3 className="font-semibold text-sm text-foreground leading-snug line-clamp-2">{course.title}</h3>
          {course.description && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{course.description}</p>
          )}
        </div>

        <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1"><Users size={11} />{course.enrollmentCount} {t("common.students")}</span>
          <span className="flex items-center gap-1"><Layers size={11} />{course.moduleCount} {t("common.modules")}</span>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] text-muted-foreground">{t("teacher.completion_rate")}</span>
            <span className="text-[11px] font-semibold text-foreground">{course.completionRate}%</span>
          </div>
          <Progress value={course.completionRate} className="h-1.5" />
        </div>

        <div className="flex items-center gap-2 mt-auto pt-1">
          <Button size="sm" variant="outline" className="flex-1 h-8 text-xs" asChild>
            <Link href={`/${locale}/dashboard/teacher/courses/${course.id}`}>{t("teacher.manage_course")}</Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost" className="h-8 w-8 shrink-0">
                <MoreHorizontal size={14} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/${locale}/dashboard/teacher/courses/${course.id}/edit`}>{t("common.edit")}</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/${locale}/dashboard/teacher/courses/${course.id}/quizzes`}>{t("nav.quizzes")}</Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive focus:text-destructive">
                {t("common.delete")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}

// ─── Student card ─────────────────────────────────────────────────────────────
export function StudentCourseCard({ enrollment, locale, index = 0 }: { enrollment: Enrollment; locale: string; index?: number }) {
  const t = useTranslations();
  const p = PALETTE[index % PALETTE.length];
  const { course } = enrollment;

  return (
    <div className={cn("rounded-xl border bg-card overflow-hidden flex flex-col hover:shadow-md transition-shadow duration-200", p.ring)}>
      <div className={cn("h-[72px] bg-gradient-to-br flex items-center justify-center relative shrink-0", p.gradient)}>
        {course.thumbnail
          ? <img src={course.thumbnail} alt="" className="w-full h-full object-cover" />
          : <BookOpen size={26} className={cn("opacity-30", p.icon)} />}
        {enrollment.progress === 100 && (
          <Badge className="absolute top-2 end-2 text-[10px] bg-emerald-500 text-white border-0 px-1.5 py-0 h-4">
            ✓ {t("common.completed")}
          </Badge>
        )}
      </div>

      <div className="p-4 flex flex-col gap-3 flex-1">
        <h3 className="font-semibold text-sm text-foreground leading-snug line-clamp-2">{course.title}</h3>

        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] text-muted-foreground">
              {enrollment.completedLessons}/{enrollment.totalLessons} {t("common.lessons")}
            </span>
            <span className="text-[11px] font-semibold text-foreground">{enrollment.progress}%</span>
          </div>
          <Progress value={enrollment.progress} className="h-1.5" />
        </div>

        <Button size="sm" className="h-8 text-xs w-full mt-auto" asChild>
          <Link href={`/${locale}/dashboard/student/courses/${course.id}`}>
            {t("student.continue_learning")}
          </Link>
        </Button>
      </div>
    </div>
  );
}