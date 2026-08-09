"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Trash } from "lucide-react";
import { toast } from "sonner";

import { deleteChat } from "@/actions/chat/deleteChat";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

interface Props {
  chatId: string;
}

export default function DeleteChatDialog({
  chatId,
}: Props) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDeleteChat = () => {
    startTransition(async () => {
      try {
        await deleteChat(chatId);

        toast.success("تم حذف المحادثة بنجاح.");

        setOpen(false);

        router.refresh();
      } catch (error) {
        console.error(error);

        toast.error("حدث خطأ أثناء حذف المحادثة.");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0 cursor-pointer text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash className="h-4 w-4" />

          <span className="sr-only">
            حذف المحادثة
          </span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            حذف المحادثة
          </DialogTitle>

          <DialogDescription>
            هل أنت متأكد من رغبتك في حذف هذه المحادثة؟
            <br />
            سيتم حذف المحادثة ولا يمكن التراجع عن هذا الإجراء.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:justify-start">
          <Button
            variant="destructive"
            onClick={handleDeleteChat}
            disabled={isPending}
            className="cursor-pointer"
          >
            {isPending ? (
              "جاري الحذف..."
            ) : (
              <>
                <Trash className="h-4 w-4" />
                حذف المحادثة
              </>
            )}
          </Button>

          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isPending}
            className="cursor-pointer"
          >
            إلغاء
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}