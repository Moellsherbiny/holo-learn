
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";

import ProfileClient from "./profile-client";
import { Navbar } from "@/components/landing/navbar";

export default async function ProfilePage() {
  const locale = await getLocale();
  const session = await auth();

  if (!session?.user?.id) {
    redirect(`/${locale}/auth/login`);
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      level: true,
      role: true,
    },
  });

  if (!user) {
    redirect(`/${locale}/auth/login`);
  }

  return (
    <>
      <Navbar />

      <ProfileClient
        user={{
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          level: String(user.level),
          role: user.role,
        }}
      />
    </>
  );
}
