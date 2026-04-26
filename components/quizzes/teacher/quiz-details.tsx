"use client"

import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Trash2, Plus, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { updateQuizAction } from "@/actions/teacher/quiz/quiz"; // أكشن جديد للتحديث
import { useRouter } from "next/navigation";

// نفس الـ Schema مع التأكد من توافقها
const quizSchema = z.object({
  title: z.string().min(1),
  questions: z.array(z.object({
    text: z.string().min(1),
    options: z.array(z.object({
      text: z.string().min(1),
      isCorrect: z.boolean()
    })).min(2)
  }))
});

export default function QuizManager({ quizId, initialData }: any) {
  const router = useRouter();
  
  const { register, control, handleSubmit } = useForm({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      title: initialData?.title || "",
      questions: initialData?.questions || [
        { text: "", options: [{ text: "", isCorrect: false }, { text: "", isCorrect: false }] }
      ]
    }
  });

  const { fields: qFields, append: qAppend, remove: qRemove } = useFieldArray({
    control,
    name: "questions"
  });

  const onSubmit = async (data: any) => {
    try {
      await updateQuizAction(quizId, data);
      alert("تم تحديث الاختبار بنجاح");
      router.refresh();
    } catch (err) {
      alert("حدث خطأ أثناء الحفظ");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card className="shadow-sm border-2 border-primary/10">
        <CardContent className="pt-6">
          <label className="text-sm font-bold mb-2 block">عنوان الاختبار</label>
          <Input {...register("title")} placeholder="عنوان الاختبار" className="text-xl" />
        </CardContent>
      </Card>

      {qFields.map((qField, qIndex) => (
        <Card key={qField.id} className="border-l-4 border-l-blue-600 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between bg-slate-50/50 py-3">
            <CardTitle className="text-md">السؤال {qIndex + 1}</CardTitle>
            <Button type="button" variant="ghost" size="sm" onClick={() => qRemove(qIndex)}>
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <Input {...register(`questions.${qIndex}.text`)} placeholder="نص السؤال" />
            
            {/* عرض الخيارات */}
            <OptionsSection qIndex={qIndex} control={control} register={register} />
          </CardContent>
        </Card>
      ))}

      <div className="flex gap-4 sticky bottom-4 bg-white p-4 border rounded-2xl shadow-lg">
        <Button 
          type="button" 
          variant="outline" 
          className="flex-1 py-6 border-dashed"
          onClick={() => qAppend({ text: "", options: [{ text: "", isCorrect: false }, { text: "", isCorrect: false }] })}
        >
          <Plus className="ml-2 h-4 w-4" /> إضافة سؤال
        </Button>
        <Button type="submit" className="flex-1 py-6 bg-green-600 hover:bg-green-700">
          <Save className="ml-2 h-4 w-4" /> حفظ التعديلات
        </Button>
      </div>
    </form>
  );
}

// مكون الخيارات (كما في الرد السابق)
function OptionsSection({ qIndex, control, register }: any) {
  const { fields, append, remove } = useFieldArray({ control, name: `questions.${qIndex}.options` });
  return (
    <div className="space-y-2 mr-4 border-r-2 pr-4">
      {fields.map((field, oIndex) => (
        <div key={field.id} className="flex items-center gap-2">
          <Controller
            control={control}
            name={`questions.${qIndex}.options.${oIndex}.isCorrect`}
            render={({ field }) => (
              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
            )}
          />
          <Input {...register(`questions.${qIndex}.options.${oIndex}.text`)} placeholder="الخيار..." />
          <Button type="button" variant="ghost" size="icon" onClick={() => remove(oIndex)} disabled={fields.length <= 2}>
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      ))}
      <Button type="button" variant="link" onClick={() => append({ text: "", isCorrect: false })}>+ إضافة خيار</Button>
    </div>
  );
}