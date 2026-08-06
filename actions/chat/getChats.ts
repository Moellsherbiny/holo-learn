"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/lib/generated/prisma/client";

export async function getChats() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return {
        success: false,
        message: "Unauthorized.",
      };
    }

    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        id: true,
        role: true,
      },
    });

    if (!user) {
      return {
        success: false,
        message: "User not found.",
      };
    }

    const chats = await prisma.chat.findMany({
      where:
        user.role === UserRole.TEACHER
          ? {
              teacherId: user.id,
            }
          : {
              studentId: user.id,
            },

      include: {
        teacher: {
          select: {
            id: true,
            name: true,
            image: true,
            email: true,
          },
        },
        student: {
          select: {
            id: true,
            name: true,
            image: true,
            email: true,
          },
        },
        messages: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
          include: {
            sender: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },

      orderBy: {
        lastMessageAt: "desc",
      },
    });

    const formattedChats = chats.map((chat) => ({
      id: chat.id,
      lastMessageAt: chat.lastMessageAt,
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt,
      messages: chat.messages,

      participant:
        user.role === UserRole.TEACHER
          ? chat.student
          : chat.teacher,
    }));

    return {
      success: true,
      data: formattedChats,
    };
  } catch (error) {
    console.error("Get Chats Error:", error);

    return {
      success: false,
      message: "Failed to get chats.",
    };
  }
}