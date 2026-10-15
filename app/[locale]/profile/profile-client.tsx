
"use client";

import { useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { toast } from "sonner";
import {
  Camera,
  Check,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  LoaderCircle,
  LockKeyhole,
  LogOut,
  Mail,
  Save,
  ShieldCheck,
  UserRound,
  UserRoundCog,
} from "lucide-react";

import { updateUser } from "@/actions/profile";
import { uploadToCloudinary } from "@/actions/cloudinary";
import ChangePasswordDialog from "@/components/auth/change-password-dialog";
import { BecomeTeacherDialog } from "@/components/profile/becomeTeacherDialog";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

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
  const router = useRouter();

  const isArabic = locale.startsWith("ar");
  const DirectionIcon = isArabic ? ChevronLeft : ChevronRight;

  const [user, setUser] = useState<ProfileUser>(initialUser);
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const roleLabel = {
    STUDENT: isArabic ? "طالب" : "Student",
    TEACHER: isArabic ? "مدرّس" : "Teacher",
    ADMIN: isArabic ? "مدير النظام" : "Administrator",
  }[user.role];

  async function handleSave() {
    const name = user.name?.trim() ?? "";
    const email = user.email.trim();

    if (name.length < 2) {
      toast.error(
        isArabic
          ? "الاسم يجب أن يتكون من حرفين على الأقل."
          : "Name must contain at least 2 characters.",
      );
      return;
    }

    if (!email) {
      toast.error(
        isArabic
          ? "البريد الإلكتروني مطلوب."
          : "Email is required.",
      );
      return;
    }

    setLoading(true);

    try {
      // The server action must validate the fields and authorize the user.
      // Role and level are deliberately not accepted from the client.
      await updateUser({
        name,
        email,
        image: user.image ?? "",
      });

      setUser((current) => ({ ...current, name, email }));

      toast.success(t("updated"));
      router.refresh();
    } catch (error) {
      console.error("Profile update failed:", error);

      toast.error(
        isArabic
          ? "تعذر حفظ التغييرات. حاول مرة أخرى."
          : "Unable to save changes. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleImageChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error(
        isArabic
          ? "يرجى اختيار ملف صورة صالح."
          : "Please select a valid image file.",
      );
      event.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error(
        isArabic
          ? "حجم الصورة يجب ألا يتجاوز 2 ميجابايت."
          : "Image size must not exceed 2 MB.",
      );
      event.target.value = "";
      return;
    }

    setIsUploading(true);

    try {
      const result = await uploadToCloudinary(file);

      if (!result) {
        throw new Error("Image upload failed");
      }

      setUser((current) => ({ ...current, image: result }));

      toast.success(
        isArabic
          ? "تم رفع الصورة. اضغط حفظ التغييرات لتأكيدها."
          : "Image uploaded. Save changes to confirm it.",
      );
    } catch (error) {
      console.error("Avatar upload failed:", error);

      toast.error(
        isArabic
          ? "تعذر رفع الصورة. حاول مرة أخرى."
          : "Unable to upload image. Please try again.",
      );
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  }

  async function handleLogout() {
    await signOut({
      redirectTo: `/${locale}/auth/login`,
    });
  }

  const displayName = user.name?.trim() || (isArabic ? "مستخدم" : "User");
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div
      dir={isArabic ? "rtl" : "ltr"}
      className="mx-auto w-full max-w-5xl space-y-7 p-4 sm:p-6 lg:p-8"
    >
      {/* Page heading */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-3 flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <UserRoundCog className="size-4" />
            <span>Optic Learn</span>
            <span className="text-border">/</span>
            <span>{t("title")}</span>
          </div>

          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {t("title")}
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
            {isArabic
              ? "أدر معلوماتك الشخصية وصورة حسابك وإعدادات الأمان من مكان واحد."
              : "Manage your personal details, profile photo, and account security in one place."}
          </p>
        </div>

        <Badge
          variant="outline"
          className="w-fit gap-1.5 rounded-lg px-3 py-1.5 font-medium"
        >
          <span className="size-1.5 rounded-full bg-primary" />
          {roleLabel}
        </Badge>
      </header>

      {/* Profile overview */}
      <Card className="overflow-hidden rounded-2xl border-border/80 bg-card py-0 shadow-sm">
        <div className="h-1 bg-primary/70" />

        <CardContent className="p-5 sm:p-7">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            {/* Avatar */}
            <div className="relative mx-auto shrink-0 sm:mx-0">
              <Avatar className="size-24 rounded-2xl border border-border bg-muted shadow-sm sm:size-28">
                <AvatarImage
                  src={user.image ?? undefined}
                  alt={displayName}
                  className="object-cover"
                />
                <AvatarFallback className="rounded-2xl bg-primary/10 text-2xl font-semibold text-primary">
                  {initial}
                </AvatarFallback>
              </Avatar>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
                aria-label={isArabic ? "اختيار صورة الحساب" : "Choose profile image"}
              />

              <Button
                type="button"
                size="icon"
                variant="secondary"
                disabled={isUploading}
                onClick={() => fileInputRef.current?.click()}
                aria-label={isArabic ? "تغيير الصورة" : "Change photo"}
                className="absolute -bottom-2 -end-2 size-9 rounded-xl border border-border shadow-sm"
              >
                {isUploading ? (
                  <LoaderCircle className="size-4 animate-spin" />
                ) : (
                  <Camera className="size-4" />
                )}
              </Button>
            </div>

            {/* User summary */}
            <div className="min-w-0 flex-1 text-center sm:text-start">
              <h2 className="truncate text-xl font-semibold tracking-tight">
                {displayName}
              </h2>

              <p
                dir="ltr"
                className="mt-1 truncate text-sm text-muted-foreground sm:text-start"
              >
                {user.email}
              </p>

              <div className="mt-4 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <Badge variant="secondary" className="rounded-lg font-medium">
                  {roleLabel}
                </Badge>

                {user.role === "STUDENT" && (
                  <Badge variant="outline" className="rounded-lg font-medium">
                    <GraduationCap className="me-1 size-3.5" />
                    {isArabic ? `المستوى ${user.level}` : `Level ${user.level}`}
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground sm:self-start">
              <ShieldCheck className="size-4 text-primary" />
              <span>
                {isArabic ? "إعدادات الحساب" : "Account settings"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal information */}
      <section className="space-y-4">
        <div>
          <h2 className="text-base font-semibold tracking-tight">
            {t("accountInfo")}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {isArabic
              ? "حدّث المعلومات الأساسية المرتبطة بحسابك."
              : "Update the basic information associated with your account."}
          </p>
        </div>

        <Card className="rounded-2xl border-border/80 bg-card shadow-sm">
          <CardContent className="space-y-6 p-5 sm:p-7">
            <div className="grid gap-5 sm:grid-cols-2">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="profile-name">{t("name")}</Label>

                <div className="relative">
                  <UserRound className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    id="profile-name"
                    autoComplete="name"
                    value={user.name ?? ""}
                    onChange={(event) =>
                      setUser((current) => ({
                        ...current,
                        name: event.target.value,
                      }))
                    }
                    disabled={loading || isUploading}
                    className="h-11 rounded-xl ps-10"
                    placeholder={isArabic ? "الاسم بالكامل" : "Full name"}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="profile-email">{t("email")}</Label>

                <div className="relative">
                  <Mail className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    id="profile-email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    dir="ltr"
                    value={user.email}
                    onChange={(event) =>
                      setUser((current) => ({
                        ...current,
                        email: event.target.value,
                      }))
                    }
                    disabled={loading || isUploading}
                    className="h-11 rounded-xl ps-10 text-start"
                    placeholder="name@example.com"
                  />
                </div>

                <p className="text-xs leading-5 text-muted-foreground">
                  {isArabic
                    ? "تأكد من صحة البريد الإلكتروني قبل حفظ التغييرات."
                    : "Make sure your email address is correct before saving."}
                </p>
              </div>
            </div>

            <Separator />

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs leading-5 text-muted-foreground">
                {isArabic
                  ? "راجع بياناتك قبل تأكيد التغييرات."
                  : "Review your details before confirming your changes."}
              </p>

              <Button
                type="button"
                onClick={handleSave}
                disabled={loading || isUploading}
                className="h-10 gap-2 rounded-xl px-5"
              >
                {loading ? (
                  <LoaderCircle className="size-4 animate-spin" />
                ) : (
                  <Save className="size-4" />
                )}

                {loading ? t("saving") : t("saveChanges")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Security */}
      <section className="space-y-4">
        <div>
          <h2 className="text-base font-semibold tracking-tight">
            {t("security")}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {isArabic
              ? "حافظ على أمان حسابك من خلال تحديث كلمة المرور."
              : "Keep your account secure by managing your password."}
          </p>
        </div>

        <Card className="rounded-2xl border-border/80 bg-card shadow-sm">
          <CardContent className="p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-border bg-muted/60">
                <LockKeyhole className="size-5 text-primary" />
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-semibold">
                  {t("newPassword")}
                </h3>

                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  {isArabic
                    ? "استخدم كلمة مرور قوية للحفاظ على خصوصية حسابك."
                    : "Use a strong password to help protect your account."}
                </p>
              </div>

              <div className="shrink-0">
                <ChangePasswordDialog />
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Student upgrade */}
      {user.role === "STUDENT" && (
        <section className="space-y-3">
          <h2 className="text-base font-semibold tracking-tight">
            {isArabic ? "خيارات الحساب" : "Account options"}
          </h2>

          <Card className="rounded-2xl border-border/80 bg-card shadow-sm">
            <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:p-6">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-border bg-muted/60">
                <GraduationCap className="size-5 text-primary" />
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-semibold">
                  {isArabic ? "الانضمام إلى هيئة التدريس" : "Become a teacher"}
                </h3>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  {isArabic
                    ? "ابدأ إجراءات طلب التحول إلى حساب مدرّس."
                    : "Start the process of requesting a teacher account."}
                </p>
              </div>

              <div className="shrink-0">
                <BecomeTeacherDialog userId={user.id} />
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Logout */}
      <div className="flex justify-start border-t border-border/70 pt-5">
        <Button
          type="button"
          variant="ghost"
          onClick={handleLogout}
          className="h-10 gap-2 rounded-xl px-4 text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="size-4" />
          {t("logout")}
          <DirectionIcon className="size-3.5 opacity-70" />
        </Button>
      </div>
    </div>
  );
}
