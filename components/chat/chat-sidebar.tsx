"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
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

  const activeChatId = params.chatId as string | undefined;

  return (
    <ScrollArea className="h-full">
      <div className="flex flex-col">
        {chats.length === 0 && (
          <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
            No conversations yet.
          </div>
        )}

        {chats.map((chat) => {
          const lastMessage = chat.messages[0];

          return (
            <Link
              key={chat.id}
              href={`/dashboard/chat/${chat.id}`}
              className={cn(
                "flex items-center gap-3 border-b p-4 transition-colors hover:bg-muted/60",
                activeChatId === chat.id && "bg-muted"
              )}
            >
              <Avatar className="h-11 w-11">
                <AvatarImage
                  src={chat.participant.image ?? ""}
                  alt={chat.participant.name ?? ""}
                />
                <AvatarFallback>
                  {chat.participant.name?.charAt(0).toUpperCase() ?? "S"}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="truncate font-medium">
                    {chat.participant.name}
                  </h3>

                  <span className="shrink-0 text-xs text-muted-foreground">
                    {formatDistanceToNow(
                      new Date(chat.lastMessageAt),
                      {
                        addSuffix: true,
                      }
                    )}
                  </span>
                </div>

                <p className="truncate text-sm text-muted-foreground">
                  {lastMessage?.content ??
                    "Start a conversation"}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </ScrollArea>
  );
}