import { redirect } from "next/navigation";
import { MessageCircleMore, Plus } from "lucide-react";

import { auth } from "@/auth";
import { getChats } from "@/actions/chat/getChats";
import { getChatUsers } from "@/actions/chat/getChatUsers";
import CreateChatDialog from "@/components/chat/create-chat-dialog";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";

export default async function ChatPage() {
  const result = await getChats();
  const session = await auth();
  const usersResult = await getChatUsers();
  if (!session?.user) {
    redirect("/login");
  }
  if (!usersResult.success) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-destructive">{usersResult.message}</p>
      </div>
    );
  }
  if (!result.success) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-destructive">
          {result.message ?? "حدث خطأ أثناء تحميل المحادثات."}
        </p>
      </div>
    );
  }

  const chats = result.data ?? [];

  if (chats.length > 0) {
    redirect(`/chat/${chats[0].id}`);
  }

  return (
    <div className="flex h-full items-center justify-center p-6">
      <Empty>
        <EmptyHeader>
          <MessageCircleMore className="size-12 text-primary" />
          <EmptyTitle>لا توجد محادثات حتى الآن</EmptyTitle>
          <EmptyDescription>
            ابدأ محادثة جديدة مع أحد{" "}
            {session.user.role === "TEACHER" ? "الطلاب" : "المعلمين"}.
          </EmptyDescription>
        </EmptyHeader>

        <EmptyContent>
          <CreateChatDialog users={usersResult.data ?? []} />
        </EmptyContent>
      </Empty>
    </div>
  );
}
