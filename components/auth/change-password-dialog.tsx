
"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Loader2, Lock } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ChangePasswordDialog() {
  const t = useTranslations("Profile");

  const [open, setOpen] = useState(false);

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [isLoading, setIsLoading] =
    useState(false);

  const handleSubmit = async () => {
    if (!newPassword) {
      toast.error(
        "يرجى إدخال كلمة المرور الجديدة."
      );
      return;
    }

    if (newPassword.length < 6) {
      toast.error(
        "كلمة المرور يجب أن تكون 6 أحرف على الأقل."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error(
        "كلمتا المرور غير متطابقتين."
      );
      return;
    }

    setIsLoading(true);

    try {
      /*
       * هنا هنربط Action تغيير كلمة المرور
       *
       * مثال:
       *
       * await changePassword({
       *   password: newPassword,
       * });
       */

      toast.success(
        "تم تغيير كلمة المرور بنجاح."
      );

      setNewPassword("");
      setConfirmPassword("");
      setOpen(false);
    } catch (error) {
      console.error(error);

      toast.error(
        "حدث خطأ أثناء تغيير كلمة المرور."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!isLoading) {
          setOpen(value);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="gap-2"
        >
          <Lock className="h-4 w-4" />

          {t("updatePassword")}
        </Button>
      </DialogTrigger>

      <DialogContent
        className="sm:max-w-md"
        dir="rtl"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary" />

            تغيير كلمة المرور
          </DialogTitle>

          <DialogDescription>
            أدخل كلمة المرور الجديدة ثم أكدها
            لإتمام عملية التغيير.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-5 py-4">
          {/* New Password */}
          <div className="grid gap-2">
            <Label htmlFor="new-password">
              كلمة المرور الجديدة
            </Label>

            <Input
              id="new-password"
              type="password"
              dir="ltr"
              value={newPassword}
              onChange={(e) =>
                setNewPassword(e.target.value)
              }
              placeholder="••••••••"
              disabled={isLoading}
            />
          </div>

          {/* Confirm Password */}
          <div className="grid gap-2">
            <Label htmlFor="confirm-password">
              تأكيد كلمة المرور
            </Label>

            <Input
              id="confirm-password"
              type="password"
              dir="ltr"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(
                  e.target.value
                )
              }
              placeholder="••••••••"
              disabled={isLoading}
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isLoading}
          >
            إلغاء
          </Button>

          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}

            {isLoading
              ? "جاري التغيير..."
              : "تغيير كلمة المرور"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
