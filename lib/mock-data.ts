// Types matching Prisma schema
export type StudentLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
export type LessonType = "VIDEO" | "TEXT" | "MATERIAL";
export type QuizType = "POSTQUIZ" | "PREQUIZ" | "NORMAL";
export type QuestionType = "MULTIPLE_CHOICE" | "TRUE_FALSE";
export type UserRole = "TEACHER" | "STUDENT";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  image?: string;
}

export interface Course {
  id: string;
  title: string;
  description?: string;
  teacherId: string;
  teacher?: User;
  thumbnail?: string;
  enrollmentCount: number;
  moduleCount: number;
  lessonCount: number;
  completionRate: number;
  createdAt: string;
}

export interface Module {
  id: string;
  title: string;
  description?: string;
  courseId: string;
  level: StudentLevel;
  order: number;
  lessonCount: number;
}

export interface Lesson {
  id: string;
  title: string;
  type: LessonType;
  moduleId: string;
  order: number;
  completed?: boolean;
}

export interface Quiz {
  id: string;
  title: string;
  description?: string;
  quizType: QuizType;
  courseId: string;
  questionCount: number;
  avgScore?: number;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  quizTitle: string;
  studentId: string;
  score: number;
  createdAt: string;
}

export interface Enrollment {
  id: string;
  courseId: string;
  course: Course;
  studentId: string;
  progress: number;
  completedLessons: number;
  totalLessons: number;
}

export interface Progress {
  id: string;
  studentId: string;
  lessonId: string;
  completed: boolean;
}

// Mock data
export const mockTeacher: User = {
  id: "t1",
  name: "Dr. Ahmed Hassan",
  email: "ahmed.hassan@edu.eg",
  role: "TEACHER",
};

export const mockStudent: User = {
  id: "s1",
  name: "Sara Mohamed",
  email: "sara.mohamed@student.edu.eg",
  role: "STUDENT",
};

export const mockCourses: Course[] = [
  {
    id: "c1",
    title: "Introduction to Computer Science",
    description: "Fundamentals of programming and algorithms",
    teacherId: "t1",
    thumbnail: undefined,
    enrollmentCount: 34,
    moduleCount: 6,
    lessonCount: 24,
    completionRate: 72,
    createdAt: "2024-09-01",
  },
  {
    id: "c2",
    title: "Data Structures & Algorithms",
    description: "Advanced data structures using C++",
    teacherId: "t1",
    thumbnail: undefined,
    enrollmentCount: 28,
    moduleCount: 8,
    lessonCount: 32,
    completionRate: 58,
    createdAt: "2024-09-15",
  },
  {
    id: "c3",
    title: "Database Systems",
    description: "SQL, NoSQL and database design principles",
    teacherId: "t1",
    thumbnail: undefined,
    enrollmentCount: 41,
    moduleCount: 5,
    lessonCount: 20,
    completionRate: 85,
    createdAt: "2024-10-01",
  },
];

export const mockQuizzes: Quiz[] = [
  {
    id: "q1",
    title: "Variables & Data Types",
    quizType: "PREQUIZ",
    courseId: "c1",
    questionCount: 10,
    avgScore: 78.5,
  },
  {
    id: "q2",
    title: "Loops & Conditions",
    quizType: "POSTQUIZ",
    courseId: "c1",
    questionCount: 15,
    avgScore: 82.3,
  },
  {
    id: "q3",
    title: "Array Operations",
    quizType: "NORMAL",
    courseId: "c2",
    questionCount: 12,
    avgScore: 69.1,
  },
];

export const mockEnrollments: Enrollment[] = [
  {
    id: "e1",
    courseId: "c1",
    course: mockCourses[0],
    studentId: "s1",
    progress: 65,
    completedLessons: 15,
    totalLessons: 24,
  },
  {
    id: "e2",
    courseId: "c2",
    course: mockCourses[1],
    studentId: "s1",
    progress: 30,
    completedLessons: 9,
    totalLessons: 32,
  },
  {
    id: "e3",
    courseId: "c3",
    course: mockCourses[2],
    studentId: "s1",
    progress: 90,
    completedLessons: 18,
    totalLessons: 20,
  },
];

export const mockQuizAttempts: QuizAttempt[] = [
  {
    id: "qa1",
    quizId: "q1",
    quizTitle: "Variables & Data Types",
    studentId: "s1",
    score: 80,
    createdAt: "2024-11-10",
  },
  {
    id: "qa2",
    quizId: "q2",
    quizTitle: "Loops & Conditions",
    studentId: "s1",
    score: 90,
    createdAt: "2024-11-15",
  },
  {
    id: "qa3",
    quizId: "q3",
    quizTitle: "Array Operations",
    studentId: "s1",
    score: 65,
    createdAt: "2024-11-20",
  },
];

export const mockModules: Module[] = [
  {
    id: "m1",
    title: "Getting Started with Programming",
    courseId: "c1",
    level: "BEGINNER",
    order: 1,
    lessonCount: 4,
  },
  {
    id: "m2",
    title: "Variables & Data Types",
    courseId: "c1",
    level: "BEGINNER",
    order: 2,
    lessonCount: 4,
  },
  {
    id: "m3",
    title: "Control Flow",
    courseId: "c1",
    level: "INTERMEDIATE",
    order: 3,
    lessonCount: 4,
  },
];

export const mockLessons: Lesson[] = [
  {
    id: "l1",
    title: "What is Programming?",
    type: "VIDEO",
    moduleId: "m1",
    order: 1,
    completed: true,
  },
  {
    id: "l2",
    title: "Setting Up Your Environment",
    type: "TEXT",
    moduleId: "m1",
    order: 2,
    completed: true,
  },
  {
    id: "l3",
    title: "Your First Program",
    type: "VIDEO",
    moduleId: "m1",
    order: 3,
    completed: false,
  },
  {
    id: "l4",
    title: "Practice Materials",
    type: "MATERIAL",
    moduleId: "m1",
    order: 4,
    completed: false,
  },
];

// ─── Models ───────────────────────────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  image?: string;
}

export interface Course {
  id: string;
  title: string;
  description?: string;
  teacherId: string;
  thumbnail?: string;
  enrollmentCount: number;
  moduleCount: number;
  lessonCount: number;
  completionRate: number;
  createdAt: string;
}

export interface Module {
  id: string;
  title: string;
  courseId: string;
  level: StudentLevel;
  order: number;
  lessonCount: number;
}

export interface Lesson {
  id: string;
  title: string;
  type: LessonType;
  moduleId: string;
  order: number;
  completed?: boolean;
}

export interface Quiz {
  id: string;
  title: string;
  quizType: QuizType;
  courseId: string;
  questionCount: number;
  avgScore?: number;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  quizTitle: string;
  studentId: string;
  score: number;
  createdAt: string;
}

export interface Enrollment {
  id: string;
  courseId: string;
  course: Course;
  studentId: string;
  progress: number;
  completedLessons: number;
  totalLessons: number;
}

// ─── Mock data ────────────────────────────────────────────────────────────────
export const MOCK_TEACHER: User = {
  id: "t1", name: "Dr. Ahmed Hassan",
  email: "ahmed.hassan@edu.eg", role: "TEACHER",
};

export const MOCK_STUDENT: User = {
  id: "s1", name: "Sara Mohamed",
  email: "sara.mohamed@student.edu.eg", role: "STUDENT",
};

export const MOCK_COURSES: Course[] = [
  {
    id: "c1", title: "Introduction to Computer Science",
    description: "Fundamentals of programming and algorithms",
    teacherId: "t1", enrollmentCount: 34,
    moduleCount: 6, lessonCount: 24, completionRate: 72, createdAt: "2024-09-01",
  },
  {
    id: "c2", title: "Data Structures & Algorithms",
    description: "Advanced data structures using C++",
    teacherId: "t1", enrollmentCount: 28,
    moduleCount: 8, lessonCount: 32, completionRate: 58, createdAt: "2024-09-15",
  },
  {
    id: "c3", title: "Database Systems",
    description: "SQL, NoSQL and database design principles",
    teacherId: "t1", enrollmentCount: 41,
    moduleCount: 5, lessonCount: 20, completionRate: 85, createdAt: "2024-10-01",
  },
  {
    id: "c4", title: "Web Development Fundamentals",
    description: "HTML, CSS, JavaScript and modern frameworks",
    teacherId: "t1", enrollmentCount: 37,
    moduleCount: 7, lessonCount: 28, completionRate: 64, createdAt: "2024-10-10",
  },
];

export const MOCK_QUIZZES: Quiz[] = [
  { id: "q1", title: "Variables & Data Types", quizType: "PREQUIZ",  courseId: "c1", questionCount: 10, avgScore: 78.5 },
  { id: "q2", title: "Loops & Conditions",     quizType: "POSTQUIZ", courseId: "c1", questionCount: 15, avgScore: 82.3 },
  { id: "q3", title: "Array Operations",        quizType: "NORMAL",   courseId: "c2", questionCount: 12, avgScore: 69.1 },
  { id: "q4", title: "Tree Traversal",          quizType: "POSTQUIZ", courseId: "c2", questionCount: 8,  avgScore: 74.0 },
];

export const MOCK_ENROLLMENTS: Enrollment[] = [
  { id: "e1", courseId: "c1", course: MOCK_COURSES[0], studentId: "s1", progress: 65, completedLessons: 15, totalLessons: 24 },
  { id: "e2", courseId: "c2", course: MOCK_COURSES[1], studentId: "s1", progress: 30, completedLessons: 9,  totalLessons: 32 },
  { id: "e3", courseId: "c3", course: MOCK_COURSES[2], studentId: "s1", progress: 90, completedLessons: 18, totalLessons: 20 },
];

export const MOCK_QUIZ_ATTEMPTS: QuizAttempt[] = [
  { id: "qa1", quizId: "q1", quizTitle: "Variables & Data Types", studentId: "s1", score: 80, createdAt: "2024-11-10" },
  { id: "qa2", quizId: "q2", quizTitle: "Loops & Conditions",     studentId: "s1", score: 90, createdAt: "2024-11-15" },
  { id: "qa3", quizId: "q3", quizTitle: "Array Operations",        studentId: "s1", score: 65, createdAt: "2024-11-20" },
];

export const MOCK_LESSONS: Lesson[] = [
  { id: "l1", title: "What is Programming?",        type: "VIDEO",    moduleId: "m1", order: 1, completed: true  },
  { id: "l2", title: "Setting Up Your Environment", type: "TEXT",     moduleId: "m1", order: 2, completed: true  },
  { id: "l3", title: "Your First Program",           type: "VIDEO",    moduleId: "m1", order: 3, completed: false },
  { id: "l4", title: "Practice Materials",           type: "MATERIAL", moduleId: "m1", order: 4, completed: false },
  { id: "l5", title: "Variables in Depth",           type: "TEXT",     moduleId: "m2", order: 1, completed: false },
];

export const MOCK_MODULES: Module[] = [
  { id: "m1", title: "Getting Started",       courseId: "c1", level: "BEGINNER",     order: 1, lessonCount: 4 },
  { id: "m2", title: "Variables & Types",     courseId: "c1", level: "BEGINNER",     order: 2, lessonCount: 4 },
  { id: "m3", title: "Control Flow",          courseId: "c1", level: "INTERMEDIATE", order: 3, lessonCount: 5 },
  { id: "m4", title: "Functions & Scope",     courseId: "c1", level: "INTERMEDIATE", order: 4, lessonCount: 4 },
  { id: "m5", title: "OOP Fundamentals",      courseId: "c1", level: "ADVANCED",     order: 5, lessonCount: 4 },
  { id: "m6", title: "Final Project",         courseId: "c1", level: "ADVANCED",     order: 6, lessonCount: 3 },
];