"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Lock, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useChangePassword } from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useTranslation } from "@/hooks/useTranslation";
import FormPasswordInput from "@/components/ui/form-password-input";

interface ChangePasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ChangePasswordDialogProps {
  onForgotPassword: () => void;
}

export function ChangePasswordDialog({
  onForgotPassword,
}: ChangePasswordDialogProps) {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const { user } = useUserProfile();
  const changePassword = useChangePassword();

  const form = useForm<ChangePasswordFormData>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const handleSubmit = (values: ChangePasswordFormData) => {
    if (!user?.email) {
      console.error("User email not available");
      return;
    }

    if (values.newPassword !== values.confirmPassword) {
      form.setError("confirmPassword", {
        type: "manual",
        message: t("account.passwords_dont_match"),
      });
      return;
    }

    if (values.newPassword.length < 8) {
      form.setError("newPassword", {
        type: "manual",
        message: t("account.password_min_length"),
      });
      return;
    }

    changePassword.mutate(
      {
        email: user.email,
        current_password: values.currentPassword,
        password: values.newPassword,
        password_confirmation: values.confirmPassword,
      },
      {
        onSuccess: () => {
          setOpen(false);
          form.reset();
        },
      }
    );
  };

  const handleForgotPassword = () => {
    setOpen(false);
    onForgotPassword();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="link"
          className="p-0 h-auto hover:no-underline text-primary font-[600] text-md"
        >
          {t("account.change_password")}
        </Button>
      </DialogTrigger>

      <DialogContent className="h-[80vh] max-w-xl md:max-w-2xl lg:max-w-3xl overflow-hidden overflow-y-auto md:overflow-y-hidden p-0">
        <div className="p-5 md:px-10 lg:px-20 relative w-full h-full flex flex-col justify-center items-center">
          <div className="absolute top-0 left-0 w-full h-full bg-primary/[0.04] z-[-1]"></div>
          <div className="head flex flex-col items-center justify-center mb-10">
            <div className="icon flex justify-center mb-4">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center text-white">
                <Lock className="w-8 h-8" />
              </div>
            </div>
            <div className="title text-center">
              <h2 className="md:text-4xl text-2xl font-[900]">
                {t("account.change_password")}
              </h2>
            </div>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-8 w-full"
            >
              <div className="space-y-8">
                <div className="top space-y-3">
                  <FormField
                    control={form.control}
                    name="currentPassword"
                    rules={{
                      required: t("account.current_password_required"),
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <FormPasswordInput
                            value={field.value || ""}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            name={field.name}
                            placeholder={t("account.enter_current_password")}
                            className="w-full bg-[#EDE7E0] rounded-none h-12 border-none focus:outline-none focus:ring-0 focus:border-none focus:ring-offset-0 focus-visible:ring-0"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="forgot-password flex justify-end">
                    <Button
                      type="button"
                      variant="link"
                      onClick={handleForgotPassword}
                      className="text-primary hover:text-primary underline p-0 h-auto"
                    >
                      {t("account.forgot_password")}?
                    </Button>
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="newPassword"
                  rules={{
                    required: t("account.new_password_required"),
                    minLength: {
                      value: 8,
                      message: t("account.password_min_length"),
                    },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FormPasswordInput
                          value={field.value || ""}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          name={field.name}
                          placeholder={t("account.enter_new_password")}
                          className="w-full bg-[#EDE7E0] rounded-none h-12 border-none focus:outline-none focus:ring-0 focus:border-none focus:ring-offset-0 focus-visible:ring-0"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  rules={{
                    required: t("account.confirm_password_required"),
                    validate: (value) => {
                      const newPassword = form.getValues("newPassword");
                      return (
                        value === newPassword ||
                        t("account.passwords_dont_match")
                      );
                    },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FormPasswordInput
                          value={field.value || ""}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          name={field.name}
                          placeholder={t("account.confirm_new_password")}
                          className="w-full bg-[#EDE7E0] rounded-none h-12 border-none focus:outline-none focus:ring-0 focus:border-none focus:ring-offset-0 focus-visible:ring-0"
                        />
                      </FormControl>
                     <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex gap-4 justify-center items-center">
                <Button
                  type="submit"
                  className="bg-black text-white py-3 px-6 rounded-none hover:bg-primary transition-colors h-11"
                  disabled={changePassword.isPending}
                >
                  {changePassword.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {t("common.changing")}
                    </>
                  ) : (
                    t("account.change_password")
                  )}
                </Button>

                <DialogClose asChild>
                  <Button
                    variant="outline"
                    className="h-11 rounded-none py-3 px-6"
                    disabled={changePassword.isPending}
                  >
                    {t("common.cancel")}
                  </Button>
                </DialogClose>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
