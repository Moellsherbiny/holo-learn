// types/study.ts

// Re-export Prisma's enums so the rest of the app imports from ONE place.
// Never define these enums locally — two separate enum declarations are
// structurally incompatible in TypeScript even when their string values match.
export { LessonType, StudentLevel } from "@/lib/generated/prisma/enums";
import { LessonType, StudentLevel } from "@/lib/generated/prisma/enums";

export interface LessonProgress {
  id: string;
  studentId: string;
  lessonId: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Lesson {
  id: string;
  title: string;
  content: string | null;
  videoUrl: string | null;
  materialUrl: string | null;
  arModelUrl: string | null;
  transcript: string | null;
  type: LessonType;
  moduleId: string;
  order: number;
  progress: LessonProgress[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Module {
  id: string;
  title: string;
  description: string | null;
  courseId: string;
  lessons: Lesson[];
  level: StudentLevel;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Teacher {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
}

// Course without nested modules — modules are carried separately in StudyPageData
// so we never fight Prisma's wider include shape.
export interface Course {
  id: string;
  title: string;
  description: string | null;
  teacherId: string;
  teacher: Teacher;
  thumbnail: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CourseWithProgress extends Course {
  totalLessons: number;
  completedLessons: number;
  progressPercent: number;
}

export interface LessonWithProgress extends Lesson {
  isCompleted: boolean;
}

export interface ModuleWithProgress extends Omit<Module, "lessons"> {
  lessons: LessonWithProgress[];
  completedCount: number;
  totalCount: number;
}

export interface StudyPageData {
  course: CourseWithProgress;
  modules: ModuleWithProgress[];
  currentLesson: LessonWithProgress | null;
  currentModule: ModuleWithProgress | null;
  nextLesson: LessonWithProgress | null;
  prevLesson: LessonWithProgress | null;
}

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };