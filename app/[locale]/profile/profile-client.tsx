"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { useTranslations, useLocale } from "next-intl";
import {
  User,
  Mail,
  Lock,
  ShieldCheck,
  Camera,
  RefreshCcw,
  Save,
  Loader2,
  LogOut,
  Settings,
  ChevronRight,
} from "lucide-react";

import { updateUser } from "@/actions/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import Navbar from "@/components/layout/navbar";
import { BecomeTeacherDialog } from "@/components/profile/becomeTeacherDialog";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { uploadToCloudinary } from "@/actions/cloudinary";

export default function ProfileClient({ user: initialUser }: any) {
  const t = useTranslations("Profile");
  const locale = useLocale();
  const isRtl = locale === "ar";

  // Logic remains identical
  const [user, setUser] = useState(initialUser);
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleSave() {
    setLoading(true);
    try {
      await updateUser({
        name: user.name,
        email: user.email,
        image: user.image,
        level: user.level,
        role: user.role,
      });
      toast.success(t("updated"));
    } catch (error) {
      toast.error("Something went wrong while saving.");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    signOut();
  }

  async function handleImageClick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      return toast.error("Image too large. Max 2MB.");
    }

    setIsUploading(true);
    try {
      const result = await uploadToCloudinary(file);
      if (result) {
        setUser((prev: any) => ({ ...prev, image: result }));
        toast.success("Photo uploaded! Click save to keep changes.");
      }
    } catch (error) {
      toast.error("Something went wrong with the upload.");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className={cn(
        "min-h-screen bg-[#f8fafc] dark:bg-zinc-950",
        isRtl ? "font-arabic" : ""
      )}
    >
      <Navbar />

      <main className="container max-w-6xl mx-auto pt-24 pb-20 px-4">
        {/* Top Action Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-10 border-b pb-8">
          <div className="space-y-1">
            <h1 className="text-4xl font-black tracking-tight text-zinc-900 dark:text-white">
              {t("title")}
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400">
              Manage your personal identity and security settings.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <Button
              variant="outline"
              onClick={handleLogout}
              className="rounded-xl gap-2 border-zinc-200 dark:border-zinc-800"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">{t("logout")}</span>
            </Button>
            <Button
              onClick={handleSave}
              disabled={loading}
              className="rounded-xl px-6 bg-zinc-900 dark:bg-white dark:text-black hover:opacity-90 gap-2 shadow-sm flex-1 md:flex-none"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {loading ? t("saving") : t("saveChanges")}
            </Button>
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-[280px_1fr]">
          {/* Sidebar Navigation Style */}
          <aside className="space-y-8">
            <div className="flex flex-col items-center lg:items-start text-center lg:text-start">
              <div className="relative group mb-4">
                <Avatar className="w-32 h-32 ring-4 ring-white dark:ring-zinc-900 shadow-2xl">
                  <AvatarImage src={user.image || ""} className="object-cover" />
                  <AvatarFallback className="text-3xl font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
                    {user.name?.[0]}
                  </AvatarFallback>
                </Avatar>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageClick}
                />
                <button
                  type="button"
                  disabled={isUploading}
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-1 right-1 p-2.5 bg-zinc-900 dark:bg-white dark:text-black text-white rounded-full shadow-xl hover:scale-105 transition-all disabled:opacity-50"
                >
                  {isUploading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Camera size={18} />
                  )}
                </button>
              </div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                {user.name}
              </h2>
              <div className="flex flex-wrap gap-2 mt-2 justify-center lg:justify-start">
                <Badge variant="outline" className="rounded-md font-medium px-2 py-0.5 border-zinc-200 dark:border-zinc-800">
                  {user.level}
                </Badge>
                <Badge className="rounded-md font-medium px-2 py-0.5 bg-primary/10 text-primary border-none">
                  {user.role}
                </Badge>
              </div>
            </div>

            <nav className="flex flex-col gap-1">
              <Button variant="ghost" className="justify-start gap-3 rounded-lg bg-zinc-100 dark:bg-zinc-800">
                <Settings size={18} className="text-primary" />
                {t("accountInfo")}
              </Button>
              <Button variant="ghost" className="justify-start gap-3 rounded-lg text-zinc-500 hover:text-zinc-900" asChild>
                <Link href="/placement-test">
                  <RefreshCcw size={18} />
                  {t("checkLevel")}
                </Link>
              </Button>
              {user.role === "STUDENT" && (
                <div className="pt-2">
                   <BecomeTeacherDialog userId={user.id} />
                </div>
              )}
            </nav>
          </aside>

          {/* Form Content Area */}
          <div className="space-y-8">
            <section>
              <div className="mb-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <User className="h-5 w-5 text-zinc-400" />
                  {t("accountInfo")}
                </h3>
                <Separator className="mt-2" />
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-zinc-600 dark:text-zinc-400 text-xs uppercase tracking-wider font-bold">
                    {t("name")}
                  </Label>
                  <div className="relative">
                    <User className="absolute inset-s-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                    <Input
                      id="name"
                      className="ps-10 h-12 rounded-xl bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus-visible:ring-primary/20"
                      value={user.name || ""}
                      onChange={(e) => setUser({ ...user, name: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-zinc-600 dark:text-zinc-400 text-xs uppercase tracking-wider font-bold">
                    {t("email")}
                  </Label>
                  <div className="relative">
                    <Mail className="absolute inset-s-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                    <Input
                      id="email"
                      type="email"
                      className="ps-10 h-12 rounded-xl bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus-visible:ring-primary/20"
                      value={user.email || ""}
                      onChange={(e) => setUser({ ...user, email: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </section>

            <section className="pt-4">
              <div className="mb-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-zinc-400" />
                  {t("security")}
                </h3>
                <Separator className="mt-2" />
              </div>

              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
                <div className="grid sm:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-2">
                    <Label htmlFor="new-password">{t("newPassword")}</Label>
                    <div className="relative">
                      <Lock className="absolute inset-s-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                      <Input
                        id="new-password"
                        type="password"
                        className="ps-10 h-11 rounded-xl"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">{t("confirmPassword")}</Label>
                    <div className="relative">
                      <Lock className="absolute inset-s-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                      <Input
                        id="confirm-password"
                        type="password"
                        className="ps-10 h-11 rounded-xl"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                </div>
                <Button variant="secondary" className="rounded-xl px-6 border border-zinc-200 dark:border-zinc-700">
                  {t("updatePassword")}
                </Button>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}