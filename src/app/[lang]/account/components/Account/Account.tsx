"use client";
import { Button } from "@/components/ui/button";
import React, { useState, useEffect } from "react";
import { ChangePasswordDialog } from "./ChangePasswordDialog";
import { ForgotPasswordDialog } from "./ForgotPasswordDialog";
import { OtpVerificationDialog } from "./OtpVerificationDialog";
import { NewPasswordDialog } from "./NewPasswordDialog";
import { useTranslation } from "@/hooks/useTranslation";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useUpdateProfile } from "@/hooks/useAuth";
import { Edit, Loader2, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { UserProfileSkeleton } from "@/components/ui/user-profile-skeleton";

interface ProfileFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
}

function Account() {
  const { t } = useTranslation();
  const { user, isLoading, error, isFromLocalStorage } = useUserProfile();
  const updateProfile = useUpdateProfile();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Dialog states
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [otpVerificationOpen, setOtpVerificationOpen] = useState(false);
  const [newPasswordOpen, setNewPasswordOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormData>();

  // Handle hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleForgotPassword = () => {
    setForgotPasswordOpen(true);
  };

  const handleOtpSent = (email: string) => {
    setResetEmail(email);
    setOtpVerificationOpen(true);
  };

  const handleOtpVerified = () => {
    setNewPasswordOpen(true);
  };

  const onSubmitProfile = (data: ProfileFormData) => {
    updateProfile.mutate(data, {
      onSuccess: () => {
        setIsEditDialogOpen(false);
        reset();
      },
    });
  };

  const handleEditProfile = () => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
      });
    }
    setIsEditDialogOpen(true);
  };

  // Show skeleton while loading or during SSR
  if (!isClient || isLoading) {
    return <UserProfileSkeleton />;
  }

  // Show error state
  if (error && !user) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <p className="text-red-500 text-lg font-medium mb-2">
          Failed to load user profile
        </p>
        <p className="text-muted-foreground">
          Please try refreshing the page or contact support.
        </p>
      </div>
    );
  }

  // Show no data state
  if (!user) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground text-lg font-medium mb-2">
          No user data available
        </p>
        <p className="text-muted-foreground">Please log in to view your profile.</p>
      </div>
    );
  }

  const userData = {
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: user.address || "N/A",
    // postal_code: user.postal_code || "N/A",
    // date_of_birth: user.date_of_birth || "N/A",
    // gender: user.gender || "N/A",
    // city: user.city?.name || "N/A",
  };

  return (
    <section>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold">{t("account.profile")}</h2>
          {isFromLocalStorage && (
            <p className="text-sm text-amber-600 mt-1">
              Showing data from local storage (offline mode)
            </p>
          )}
        </div>
        <Button onClick={handleEditProfile} variant="outline" size="sm">
          <Edit className="w-4 h-4 mr-2" />
          {t("account.edit_profile")}
        </Button>
      </div>

      <ul className="space-y-8">
        {Object.entries(userData).map(([key, value]) => (
          <li key={key} className="flex justify-between items-center">
            <div className="key">
              <p className="text-md font-[600] capitalize">
                {t(`account.${key}`)}
              </p>
            </div>
            <div className="value">
              <p className="text-md font-[500] text-foreground">
                {value || "N/A"}
              </p>
            </div>
          </li>
        ))}
        <li className="flex justify-between items-center">
          <div className="key">
            <p className="text-md font-[600] capitalize">
              {t("account.password")}
            </p>
          </div>
          <div className="value">
            <ChangePasswordDialog onForgotPassword={handleForgotPassword} />
          </div>
        </li>
      </ul>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t("account.edit_profile")}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmitProfile)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t("account.name")}</Label>
              <Input
                id="name"
                {...register("name", { required: "Name is required" })}
                placeholder={t("account.enter_name")}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t("account.email")}</Label>
              <Input
                id="email"
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                placeholder={t("account.enter_email")}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">{t("account.phone")}</Label>
              <Input
                id="phone"
                {...register("phone", { required: "Phone is required" })}
                placeholder={t("account.enter_phone")}
              />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">{t("account.address")}</Label>
              <Input
                id="address"
                {...register("address", { required: "Address is required" })}
                placeholder={t("account.enter_address")}
              />
              {errors.address && (
                <p className="text-sm text-red-500">{errors.address.message}</p>
              )}
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
                disabled={updateProfile.isPending}
              >
                {t("common.cancel")}
              </Button>
              <Button type="submit" disabled={updateProfile.isPending}>
                {updateProfile.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {t("common.updating")}
                  </>
                ) : (
                  t("common.update")
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Forgot Password Dialog */}
      <ForgotPasswordDialog
        open={forgotPasswordOpen}
        onOpenChange={setForgotPasswordOpen}
        onOtpSent={(email) => handleOtpSent(email)}
      />

      {/* OTP Verification Dialog */}
      <OtpVerificationDialog
        open={otpVerificationOpen}
        onOpenChange={setOtpVerificationOpen}
        onOtpVerified={() => handleOtpVerified()}
        email={resetEmail || user?.email || ""}
      />

      {/* New Password Dialog */}
      <NewPasswordDialog
        open={newPasswordOpen}
        onOpenChange={setNewPasswordOpen}
        email={resetEmail || user?.email || ""}
      />
    </section>
  );
}

export default Account;
