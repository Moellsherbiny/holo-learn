
import AuthLayoutClient from "@/components/auth/auth-layout";
import { ReactNode } from "react";
import { getLocale } from "next-intl/server";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  const locale = await getLocale()
  const session = await auth();

  if (session?.user?.id) redirect("/");
  return (
      <AuthLayoutClient locale={locale}>
        {children}
      </AuthLayoutClient>
  );
}