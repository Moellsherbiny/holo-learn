import { redirect } from "next/navigation";
import { MessageCircleMore } from "lucide-react";
import Link from "next/link";

import { auth } from "@/auth";
import { getChats } from "@/actions/chat/getChats";
import { getChatUsers } from "@/actions/chat/getChatUsers";

import CreateChatDialog from "@/components/chat/create-chat-dialog";
import DeleteChatDialog from "@/components/chat/delete-chat-dialog";

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

export default async function ChatPage() {
  const result = await getChats();
  const session = await auth();
  const usersResult = await getChatUsers();

  if (!session?.user) {
    redirect("/login");
  }

  if (!usersResult.success) {
    return <div>{usersResult.message}</div>;
  }

  if (!result.success) {
    return (
      <div>
        {result.message ?? "حدث خطأ أثناء تحميل المحادثات."}
      </div>
    );
  }

  const chats = result.data ?? [];

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            المحادثات
          </h1>

          <p className="text-sm text-muted-foreground">
            جميع محادثاتك
          </p>
        </div>

        <CreateChatDialog
          users={usersResult.data ?? []}
        />
      </div>

      {/* Empty State */}
      {chats.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyTitle>
              لا توجد محادثات حتى الآن
            </EmptyTitle>

            <EmptyDescription>
              ابدأ محادثة جديدة مع أحد{" "}
              {session.user.role === "TEACHER"
                ? "الطلاب"
                : "المعلمين"}.
            </EmptyDescription>
          </EmptyHeader>

          <EmptyContent>
            <CreateChatDialog
              users={usersResult.data ?? []}
            />
          </EmptyContent>
        </Empty>
      ) : (
        /* Chats */
        <div className="space-y-2">
          {chats.map((chat) => {
            const lastMessage =
              chat.messages[chat.messages.length - 1];

            return (
              <div
                key={chat.id}
                className="flex items-center gap-4 rounded-xl border bg-card p-4 transition-colors hover:bg-muted"
              >
                {/* Avatar */}
                <Avatar className="h-12 w-12 shrink-0">
                  <AvatarImage
                    src={
                      chat.participant.image ?? undefined
                    }
                    alt={
                      chat.participant.name ?? "User"
                    }
                  />

                  <AvatarFallback>
                    {chat.participant.name
                      ?.charAt(0)
                      .toUpperCase() ?? "U"}
                  </AvatarFallback>
                </Avatar>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    {/* Chat Name Link */}
                    <Link
                      href={`/chat/${chat.id}`}
                      className="truncate font-semibold hover:underline"
                    >
                      {chat.participant.name ?? "مستخدم"}
                    </Link>

                    {/* Date */}
                    {chat.lastMessageAt && (
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {new Date(
                          chat.lastMessageAt
                        ).toLocaleDateString("ar-EG", {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                    )}
                  </div>

                  {/* Last Message */}
                  <p className="mt-1 truncate text-sm text-muted-foreground">
                    {lastMessage?.content ??
                      "لا توجد رسائل بعد"}
                  </p>
                </div>

                {/* Chat Icon */}
                <MessageCircleMore className="h-5 w-5 shrink-0 text-muted-foreground" />

                {/* Delete */}
                {session.user.id === chat.participant.id && (
                  <DeleteChatDialog chatId={chat.id} />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}