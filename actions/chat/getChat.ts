"use server";

import {prisma} from "@/lib/prisma";

interface GetChatProps {
  teacherId: string;
  studentId: string;
}

export async function getChat({
  teacherId,
  studentId,
}: GetChatProps) {
  try {
    const chat = await prisma.chat.findUnique({
      where: {
        teacherId_studentId: {
          teacherId,
          studentId,
        },
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

    return {
      success: true,
      chat,
    };
  } catch (error) {
    console.error("Get Chat Error:", error);

    return {
      success: false,
      message: "Failed to get chat.",
    };
  }
}