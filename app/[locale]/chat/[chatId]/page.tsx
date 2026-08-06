import { notFound, redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

import { ChatView } from "@/components/chat/chat-view";

interface Props {
  params: Promise<{
    chatId: string;
  }>;
}

export default async function ChatPage({ params }: Props) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const { chatId } = await params;

  const chat = await prisma.chat.findUnique({
    where: {
      id: chatId,
    },
    include: {
      teacher: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },

      student: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },

      messages: {
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  if (!chat) {
    notFound();
  }

  const currentUserId = session.user.id;

  const isTeacher = chat.teacherId === currentUserId;
  const isStudent = chat.studentId === currentUserId;

  if (!isTeacher && !isStudent) {
    redirect("/dashboard");
  }

  const otherUser = isTeacher ? chat.student : chat.teacher;

  return (
    <ChatView
      chatId={chat.id}
      currentUserId={currentUserId}
      otherUser={otherUser}
      initialMessages={chat.messages}
    />
  );
}