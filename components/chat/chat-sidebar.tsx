"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";
import { cn } from "@/lib/utils";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import { ScrollArea } from "@/components/ui/scroll-area";

interface ChatSidebarProps {
  chats: {
    id: string;
    participant: {
      id: string;
      name: string | null;
      image: string | null;
      email: string;
    };
    messages: {
      id: string;
      content: string;
      createdAt: Date;
    }[];
    lastMessageAt: Date;
  }[];
}

export default function ChatSidebar({
  chats,
}: ChatSidebarProps) {
  const params = useParams();

  const activeChatId =
    typeof params.chatId === "string"
      ? params.chatId
      : undefined;

  return (
    <div className="flex h-full flex-col" dir="rtl">
      {/* Header */}
      <div className="shrink-0 border-b px-4 py-4">
        <h2 className="font-semibold">
          المحادثات
        </h2>

        <p className="mt-1 text-xs text-muted-foreground">
          {chats.length === 0
            ? "لا توجد محادثات"
            : `${chats.length} محادثة`}
        </p>
      </div>

      {/* Chats */}
      <ScrollArea className="flex-1">
        {chats.length === 0 ? (
          <div className="flex h-full min-h-[300px] items-center justify-center px-6 text-center">
            <div>
              <p className="text-sm font-medium">
                لا توجد محادثات حتى الآن
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                ابدأ محادثة جديدة للظهور هنا.
              </p>
            </div>
          </div>
        ) : (
          <div>
            {chats.map((chat) => {
              const lastMessage = chat.messages[0];

              return (
                <Link
                  key={chat.id}
                  href={`/chat/${chat.id}`}
                  className={cn(
                    "flex items-center gap-3 border-b p-4 transition-colors",
                    "hover:bg-muted/60",
                    activeChatId === chat.id &&
                      "bg-muted"
                  )}
                >
                  {/* Avatar */}
                  <Avatar className="h-11 w-11 shrink-0">
                    <AvatarImage
                      src={
                        chat.participant.image ??
                        undefined
                      }
                      alt={
                        chat.participant.name ??
                        "المستخدم"
                      }
                    />

                    <AvatarFallback>
                      {chat.participant.name
                        ?.charAt(0)
                        .toUpperCase() ?? "U"}
                    </AvatarFallback>
                  </Avatar>

                  {/* Chat Info */}
                  <div className="min-w-0 flex-1">
                    {/* Name + Time */}
                    <div className="flex items-center justify-between gap-2">
                      <h3
                        className={cn(
                          "truncate text-sm font-semibold",
                          activeChatId === chat.id &&
                            "text-primary"
                        )}
                      >
                        {chat.participant.name ??
                          "مستخدم"}
                      </h3>

                      <span className="shrink-0 text-[11px] text-muted-foreground">
                        {formatDistanceToNow(
                          new Date(
                            chat.lastMessageAt
                          ),
                          {
                            addSuffix: true,
                            locale: ar,
                          }
                        )}
                      </span>
                    </div>

                    {/* Last Message */}
                    <p className="mt-1 truncate text-xs text-muted-foreground">
                      {lastMessage?.content ??
                        "لا توجد رسائل بعد"}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}