"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { Plus, Search, FileText, Users, Trash2, Eye } from "lucide-react";
import { createQuiz, deleteQuiz } from "@/actions/teacher/quiz/quiz";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

export function QuizClient({
  quizzes,
  courses,
  stats,
}: any) {
  const [title, setTitle] = useState("");
  const [courseId, setCourseId] = useState("");
  const [search, setSearch] = useState("");

  const [pending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    return quizzes.filter((quiz: any) =>
      quiz.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [quizzes, search]);

  const handleCreate = () => {
    startTransition(async () => {
      await createQuiz({
        title,
        courseId,
      });

      setTitle("");
      setCourseId("");
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="rounded-3xl bg-linear-to-r from-primary to-purple-600 text-white p-8 shadow-xl">
        <h1 className="text-4xl font-bold">
          Quiz Management
        </h1>

        <p className="mt-2 text-white/80">
          Create, manage and track student quizzes.
        </p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="rounded-2xl">
          <CardContent className="p-6 flex items-center gap-4">
            <FileText className="w-8 h-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">
                Total Quizzes
              </p>
              <h3 className="text-2xl font-bold">
                {stats.totalQuizzes}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardContent className="p-6 flex items-center gap-4">
            <Plus className="w-8 h-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">
                Questions
              </p>
              <h3 className="text-2xl font-bold">
                {stats.totalQuestions}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardContent className="p-6 flex items-center gap-4">
            <Users className="w-8 h-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">
                Attempts
              </p>
              <h3 className="text-2xl font-bold">
                {stats.totalAttempts}
              </h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create Form */}
      <Card className="rounded-3xl border-none shadow-lg">
        <CardContent className="p-6 grid md:grid-cols-3 gap-4">
          <Input
            placeholder="Quiz title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

            <Select
            value={courseId}
            onValueChange={setCourseId}
          >
            <SelectTrigger className="rounded-xl">
              <SelectValue placeholder="Select course" />
            </SelectTrigger>

            <SelectContent>
              {courses.map((course: any) => (
                <SelectItem
                  key={course.id}
                  value={course.id}
                >
                  {course.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            disabled={pending}
            onClick={handleCreate}
            className="rounded-xl"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Quiz
          </Button>
        </CardContent>
      </Card>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />

        <Input
          className="pl-10 rounded-xl"
          placeholder="Search quizzes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Quiz Grid */}
      <div className="grid lg:grid-cols-2 gap-5">
        {filtered.map((quiz: any) => (
          <Card
            key={quiz.id}
            className="rounded-3xl border-none shadow-md hover:shadow-xl transition-all"
          >
            <CardContent className="p-6 space-y-5">
              <div>
                <h2 className="text-xl font-bold">
                  {quiz.title}
                </h2>

                <p className="text-sm text-muted-foreground mt-1">
                  {quiz.course.title}
                </p>
              </div>

              <div className="flex gap-6 text-sm">
                <span>
                  {quiz.questions.length} Questions
                </span>

                <span>
                  {quiz.quizAttempts.length} Attempts
                </span>
              </div>

              <div className="flex gap-2 flex-wrap">
                <Link href={`/teacher/quizzes/${quiz.id}`}>
                  <Button
                    variant="outline"
                    className="rounded-xl"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Manage
                  </Button>
                </Link>

                <Link
                  href={`/teacher/quizzes/${quiz.id}/results`}
                >
                  <Button
                    variant="outline"
                    className="rounded-xl"
                  >
                    Results
                  </Button>
                </Link>

                <Button
                  variant="destructive"
                  className="rounded-xl"
                  onClick={() =>
                    startTransition(() =>
                      deleteQuiz(quiz.id)
                    )
                  }
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {!filtered.length && (
        <div className="text-center py-16 text-muted-foreground">
          No quizzes found.
        </div>
      )}
    </div>
  );
}