"use client"

import { useTransition } from "react";
import { toggleLessonProgress } from "@/actions/progress";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useTranslations } from "next-intl";

export default function LessonContent({ lesson, userId, isCompleted }: any) {
  const [isPending, startTransition] = useTransition();
  const t = useTranslations("Course");

  const handleToggle = () => {
    startTransition(async () => {
      await toggleLessonProgress(lesson.id, userId, !isCompleted);
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {lesson.videoUrl && (
        <div className="aspect-video w-full bg-black rounded-xl overflow-hidden shadow-lg">
          <iframe 
            src={lesson.videoUrl} 
            className="w-full h-full" 
            allowFullScreen 
          />
        </div>
      )}

      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold">{lesson.title}</h2>
          <p className="text-muted-foreground mt-2">{lesson.content}</p>
        </div>
        
        <Button 
          variant={isCompleted ? "outline" : "default"}
          onClick={handleToggle}
          disabled={isPending}
          className="gap-2"
        >
          <CheckCircle className={isCompleted ? "text-green-500" : ""} size={20} />
          {isCompleted ? t('completed') : t('markComplete')}
        </Button>
      </div>

      {lesson.materialUrl && (
        <div className="p-4 border rounded-lg bg-muted/50">
          <h4 className="font-medium mb-2">Resources</h4>
          <a href={lesson.materialUrl} className="text-primary underline">Download Lesson Materials</a>
        </div>
      )}
    </div>
  );
}