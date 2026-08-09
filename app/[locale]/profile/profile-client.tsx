"use client";

import { useRef, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { toast } from "sonner";
import Link from "next/link";
import { signOut } from "next-auth/react";

import {
  User,
  Mail,
  Lock,
  ShieldCheck,
  Camera,
  Save,
  Loader2,
  LogOut,
  Settings,
} from "lucide-react";
import ChangePasswordDialog from "@/components/auth/change-password-dialog";
import { updateUser } from "@/actions/profile";
import { uploadToCloudinary } from "@/actions/cloudinary";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import Navbar from "@/components/layout/navbar";
import { BecomeTeacherDialog } from "@/components/profile/becomeTeacherDialog";
type UserRole = "STUDENT" | "TEACHER" | "ADMIN";
interface ProfileUser {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  level: string;
  role: UserRole;
}

interface ProfileClientProps {
  user: ProfileUser;
}

export default function ProfileClient({
  user: initialUser,
}: ProfileClientProps) {
  const t = useTranslations("Profile");
  const locale = useLocale();

  const isRtl = locale === "ar";

  const [user, setUser] = useState<ProfileUser>(initialUser);

  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  /* -----------------------------
     Save Profile
  ----------------------------- */

  async function handleSave() {
    if (!user.name?.trim()) {
      toast.error(isRtl ? "الاسم مطلوب." : "Name is required.");

      return;
    }

    if (!user.email?.trim()) {
      toast.error(isRtl ? "البريد الإلكتروني مطلوب." : "Email is required.");

      return;
    }

    setLoading(true);

    try {
      await updateUser({
        name: user.name.trim(),
        email: user.email.trim(),
        image: user.image ?? "",
        level: user.level,
        role: user.role,
      });

      toast.success(t("updated"));
    } catch (error) {
      console.error(error);

      toast.error(
        isRtl
          ? "حدث خطأ أثناء حفظ التغييرات."
          : "Something went wrong while saving.",
      );
    } finally {
      setLoading(false);
    }
  }

  /* -----------------------------
     Logout
  ----------------------------- */

  async function handleLogout() {
    await signOut({
      callbackUrl: "/auth/login",
    });
  }

  /* -----------------------------
     Upload Avatar
  ----------------------------- */

  async function handleImageClick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error(
        isRtl
          ? "حجم الصورة يجب ألا يتجاوز 2 ميجابايت."
          : "Image too large. Max 2MB.",
      );

      e.target.value = "";
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error(
        isRtl ? "يرجى اختيار صورة صحيحة." : "Please select a valid image.",
      );

      e.target.value = "";
      return;
    }

    setIsUploading(true);

    try {
      const result = await uploadToCloudinary(file);

      if (result) {
        setUser((prev) => ({
          ...prev,
          image: result,
        }));

        toast.success(
          isRtl
            ? "تم رفع الصورة. اضغط حفظ لتأكيد التغيير."
            : "Photo uploaded. Click save to keep changes.",
        );
      }
    } catch (error) {
      console.error(error);

      toast.error(
        isRtl
          ? "حدث خطأ أثناء رفع الصورة."
          : "Something went wrong with the upload.",
      );
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  }

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="min-h-screen bg-muted/30">
      <Navbar />

      <main className="container mx-auto max-w-6xl px-4 py-8 md:py-12">
        {/* Page Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            {t("title")}
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            {isRtl
              ? "إدارة معلومات حسابك وإعدادات الأمان."
              : "Manage your personal information and security settings."}
          </p>
        </div>

        {/* Main Grid */}
        <div className="mx-auto max-w-4xl space-y-6">
          {/* Profile Header */}
          <Card>
            <CardContent className="p-6 md:p-8">
              <div className="flex flex-col items-center gap-6 sm:flex-row">
                {/* Avatar */}
                <div className="relative shrink-0">
                  <Avatar className="h-28 w-28 border-4 border-background shadow-md">
                    <AvatarImage
                      src={user.image ?? undefined}
                      alt={user.name ?? "User"}
                      className="object-cover"
                    />

                    <AvatarFallback className="text-3xl font-bold">
                      {user.name?.charAt(0).toUpperCase() ?? "U"}
                    </AvatarFallback>
                  </Avatar>

                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageClick}
                  />

                  <Button
                    type="button"
                    size="icon"
                    disabled={isUploading}
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 inset-e-0 h-9 w-9 rounded-full"
                  >
                    {isUploading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Camera className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                {/* User Info */}
                <div className="min-w-0 flex-1 text-center sm:text-start">
                  <h2 className="text-2xl font-bold">{user.name || "User"}</h2>

                  <p className="mt-1 truncate text-sm text-muted-foreground">
                    {user.email}
                  </p>

                  <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
                    {user.role === "STUDENT" && (
                      <Badge variant="secondary">{user.level}</Badge>
                    )}

                    <Badge>{user.role}</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                {t("accountInfo")}
              </CardTitle>

              <CardDescription>
                {isRtl
                  ? "تعديل معلومات حسابك الأساسية."
                  : "Update your basic account information."}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">{t("name")}</Label>

                  <div className="relative">
                    <User className="absolute inset-s-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                    <Input
                      id="name"
                      value={user.name ?? ""}
                      onChange={(e) =>
                        setUser({
                          ...user,
                          name: e.target.value,
                        })
                      }
                      className="h-11 ps-10"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">{t("email")}</Label>

                  <div className="relative">
                    <Mail className="absolute inset-s-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                    <Input
                      id="email"
                      type="email"
                      dir="ltr"
                      value={user.email}
                      onChange={(e) =>
                        setUser({
                          ...user,
                          email: e.target.value,
                        })
                      }
                      className="h-11 ps-10"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleSave}
                  disabled={loading || isUploading}
                  className="gap-2"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}

                  {loading ? t("saving") : t("saveChanges")}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                {t("security")}
              </CardTitle>

              <CardDescription>
                {isRtl ? "إدارة أمان حسابك." : "Manage your account security."}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="flex flex-col gap-4 rounded-xl border bg-muted/30 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Lock className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="font-medium">{t("newPassword")}</p>

                    <p className="text-sm text-muted-foreground">
                      {isRtl
                        ? "قم بتغيير كلمة المرور الخاصة بحسابك."
                        : "Change your account password."}
                    </p>
                  </div>
                </div>

                <ChangePasswordDialog />
              </div>
            </CardContent>
          </Card>

          {/* Student Action */}
          {user.role === "STUDENT" && <BecomeTeacherDialog userId={user.id} />}

          {/* Logout */}
          <div className="flex justify-center pt-2">
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut className="h-4 w-4" />
              {t("logout")}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
