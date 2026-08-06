"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";

import Image from "next/image";
import { sendMessage } from "@/actions/chat/sendMessage";
import {
  ArrowLeft,
  SendHorizonal,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import { cn } from "@/lib/utils";

type ChatUser = {
  id: string;
  name: string | null;
  image: string | null;
};

type Message = {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  createdAt: Date;
  readAt: Date | null;

  sender: ChatUser;
};

interface ChatViewProps {
  chatId: string;

  currentUserId: string;

  otherUser: ChatUser;

  initialMessages: Message[];
}

export function ChatView({
  chatId,
  currentUserId,
  otherUser,
  initialMessages,
}: ChatViewProps) {
  const [messages, setMessages] = useState(initialMessages);

  const [message, setMessage] = useState("");

  const [isPending, startTransition] = useTransition();

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const sortedMessages = useMemo(() => {
    return [...messages].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() -
        new Date(b.createdAt).getTime()
    );
  }, [messages]);

  async function handleSend() {
  const content = message.trim();

  if (!content) return;

  setMessage("");

  const optimisticMessage: Message = {
    id: crypto.randomUUID(),
    chatId,
    senderId: currentUserId,
    content,
    createdAt: new Date(),
    readAt: null,
    sender: {
      id: currentUserId,
      name: "You",
      image: null,
    },
  };

  setMessages((prev) => [...prev, optimisticMessage]);

  startTransition(async () => {
  try {
    const savedMessage = await sendMessage({
      chatId,
      content,
    });

    setMessages((prev) =>
      prev.map((m) =>
        m.id === optimisticMessage.id ? savedMessage : m
      )
    );
  } catch (error) {
    setMessages((prev) =>
      prev.filter((m) => m.id !== optimisticMessage.id)
    );

    console.error(error);
  }


  });
}

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col rounded-xl border bg-background">

      {/* Header */}

      <div className="flex items-center gap-4 px-6 py-4">

        <Button
          size="icon"
          variant="ghost"
          onClick={() => history.back()}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <Avatar className="h-11 w-11">
          <AvatarImage src={otherUser.image ?? ""} />
          <AvatarFallback>
            {otherUser.name?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="space-y-1">

          <h2 className="font-semibold">
            {otherUser.name}
          </h2>

          <p className="text-sm text-muted-foreground">
            Conversation
          </p>

        </div>

      </div>

      <Separator />

      {/* Messages */}

      <ScrollArea className="flex-1">

        <div className="space-y-5 p-6">

          {sortedMessages.map((msg) => {

            const isMine =
              msg.senderId === currentUserId;

            return (
              <div
                key={msg.id}
                className={cn(
                  "flex w-full",
                  isMine
                    ? "justify-end"
                    : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[70%] rounded-2xl px-4 py-3 shadow-sm",

                    isMine
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-muted rounded-bl-sm"
                  )}
                >
                  {!isMine && (
                    <p className="mb-1 text-xs font-medium text-muted-foreground">
                      {msg.sender.name}
                    </p>
                  )}

                  <p className="whitespace-pre-wrap wrap-break-word text-sm leading-6">
                    {msg.content}
                  </p>

                  <p
                    className={cn(
                      "mt-2 text-[11px]",

                      isMine
                        ? "text-primary-foreground/70"
                        : "text-muted-foreground"
                    )}
                  >
                    {new Date(
                      msg.createdAt
                    ).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>

                </div>
              </div>
            );
          })}

          <div ref={bottomRef} />

        </div>

      </ScrollArea>
            {/* Input */}

      <Separator />

      <div className="border-t bg-background p-4">

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-3"
        >

          <Input
            value={message}
            disabled={isPending}
            placeholder="Type a message..."
            onChange={(e) =>
              setMessage(e.target.value)
            }
            className="flex-1"
          />

          <Button
            size="icon"
            type="submit"
            disabled={
              isPending ||
              message.trim().length === 0
            }
          >
            <SendHorizonal className="h-5 w-5" />
          </Button>

        </form>

      </div>

    </div>
  );

}