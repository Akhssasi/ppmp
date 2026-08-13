"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-hot-toast";
import { Camera, UserRound } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import { usersService } from "@/services/users";
import { useAuthStore } from "@/store/auth";
import { getErrorMessage, initials } from "@/lib/utils";

const profileSchema = z.object({
  fullName: z.string().min(1, "Full name is required").max(100),
  bio: z.string().max(2000).optional().or(z.literal("")),
  portfolioSlug: z.string().max(100).optional().or(z.literal("")),
  avatarUrl: z.string().max(500).optional().or(z.literal("")),
});

type ProfileValues = z.infer<typeof profileSchema>;

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "At least 8 characters")
      .regex(/^(?=.*[A-Za-z])(?=.*\d).+$/, "Must contain at least one letter and one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type PasswordValues = z.infer<typeof passwordSchema>;

export default function SettingsPage() {
  const { user, setUser } = useAuthStore();
  const [savingProfile, setSavingProfile] = React.useState(false);
  const [savingPassword, setSavingPassword] = React.useState(false);
  const [uploadingAvatar, setUploadingAvatar] = React.useState(false);
  const avatarInputRef = React.useRef<HTMLInputElement>(null);

  const profileForm = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user?.fullName ?? "",
      bio: "",
      portfolioSlug: user?.portfolioSlug ?? "",
      avatarUrl: user?.avatarUrl ?? "",
    },
  });

  const passwordForm = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  React.useEffect(() => {
    if (user) {
      profileForm.reset({
        fullName: user.fullName,
        bio: "",
        portfolioSlug: user.portfolioSlug ?? "",
        avatarUrl: user.avatarUrl ?? "",
      });
    }
    // Load full profile (bio isn't in the auth user summary)
    usersService
      .getMe()
      .then((me) => {
        profileForm.reset({
          fullName: me.fullName,
          bio: me.bio ?? "",
          portfolioSlug: me.portfolioSlug ?? "",
          avatarUrl: me.avatarUrl ?? "",
        });
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const onProfileSubmit = async (values: ProfileValues) => {
    setSavingProfile(true);
    try {
      const updated = await usersService.updateMe(values);
      setUser({
        ...(user as NonNullable<typeof user>),
        fullName: updated.fullName,
        avatarUrl: updated.avatarUrl,
        portfolioSlug: updated.portfolioSlug,
      });
      toast.success("Profile updated");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSavingProfile(false);
    }
  };

  const onPasswordSubmit = async (values: PasswordValues) => {
    setSavingPassword(true);
    try {
      await usersService.changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      passwordForm.reset();
      toast.success("Password changed");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSavingPassword(false);
    }
  };

  const onAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingAvatar(true);
    try {
      const updated = await usersService.uploadAvatar(file);
      setUser({
        ...(user as NonNullable<typeof user>),
        avatarUrl: updated.avatarUrl,
      });
      toast.success("Avatar updated");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setUploadingAvatar(false);
      e.target.value = "";
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage your profile and account security.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Your public profile information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex items-center gap-4">
            <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-violet-600 text-xl font-bold text-white">
              {user?.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.avatarUrl} alt={user.fullName} className="size-16 rounded-full object-cover" />
              ) : (
                initials(user?.fullName ?? user?.username)
              )}
            </div>
            <div>
              <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={onAvatarUpload} />
              <Button size="sm" variant="outline" onClick={() => avatarInputRef.current?.click()} disabled={uploadingAvatar}>
                {uploadingAvatar ? <Spinner className="size-4" /> : <Camera className="size-4" />}
                {uploadingAvatar ? "Uploading..." : "Change avatar"}
              </Button>
              <p className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                <UserRound className="size-3.5" />
                @{user?.username}
              </p>
            </div>
          </div>

          <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full name</Label>
                <Input id="fullName" {...profileForm.register("fullName")} />
                {profileForm.formState.errors.fullName ? (
                  <p className="text-sm text-rose-500">{profileForm.formState.errors.fullName.message}</p>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Portfolio slug</Label>
                <Input id="slug" placeholder="my-portfolio" {...profileForm.register("portfolioSlug")} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea id="bio" rows={4} placeholder="Tell people about yourself..." {...profileForm.register("bio")} />
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={savingProfile}>
                {savingProfile ? <Spinner className="size-4 text-white" /> : null}
                Save profile
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Change password</CardTitle>
          <CardDescription>Use at least 8 characters with letters and numbers.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current password</Label>
              <Input id="currentPassword" type="password" {...passwordForm.register("currentPassword")} />
              {passwordForm.formState.errors.currentPassword ? (
                <p className="text-sm text-rose-500">{passwordForm.formState.errors.currentPassword.message}</p>
              ) : null}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="newPassword">New password</Label>
                <Input id="newPassword" type="password" {...passwordForm.register("newPassword")} />
                {passwordForm.formState.errors.newPassword ? (
                  <p className="text-sm text-rose-500">{passwordForm.formState.errors.newPassword.message}</p>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm new password</Label>
                <Input id="confirmPassword" type="password" {...passwordForm.register("confirmPassword")} />
                {passwordForm.formState.errors.confirmPassword ? (
                  <p className="text-sm text-rose-500">{passwordForm.formState.errors.confirmPassword.message}</p>
                ) : null}
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit" variant="secondary" disabled={savingPassword}>
                {savingPassword ? <Spinner className="size-4" /> : null}
                Change password
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
