"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Lock } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useResetPassword } from "@/hooks/useAuth";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { useTranslation } from "@/hooks/useTranslation";

const newPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters." }),
    confirmPassword: z
      .string()
      .min(1, { message: "Please confirm your password." }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

interface NewPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  email: string;
}

export function NewPasswordDialog({
  open,
  onOpenChange,
  email,
}: NewPasswordDialogProps) {
  const { t } = useTranslation("common");
  const form = useForm<z.infer<typeof newPasswordSchema>>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });
  const resetPassword = useResetPassword();

  const handleSubmit = (values: z.infer<typeof newPasswordSchema>) => {
    resetPassword.mutate(
      {
        email,
        password: values.newPassword,
        password_confirmation: values.confirmPassword,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          form.reset();
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-[80vh] max-w-xl md:max-w-2xl lg:max-w-3xl overflow-hidden overflow-y-auto md:overflow-y-hidden p-0">
        <div className="p-5 md:px-10 lg:px-20 relative w-full h-full flex flex-col justify-center items-center">
          <div className="absolute top-0 left-0 w-full h-full bg-primary/[0.04] z-[-1]"></div>
          <div className="head flex items-center justify-center mb-10">
            <div className="title text-center">
              <div className="icon flex justify-center mb-4">
                <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center text-white">
                  <Lock className="w-8 h-8" />
                </div>
              </div>
              <h2 className="md:text-4xl text-2xl font-[900]">
                {t("setNewPassword")}
              </h2>
              <p className="text-muted-foreground mt-2">
                {t("createANewPasswordForYourAccount")}
              </p>
            </div>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-8 w-full"
            >
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder={t("enterNewPassword")}
                          className="w-full bg-[#EDE7E0] rounded-none h-12 border-none focus:outline-none focus:ring-0 focus:border-none focus:ring-offset-0 focus-visible:ring-0"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder={t("confirmNewPassword")}
                          className="w-full bg-[#EDE7E0] rounded-none h-12 border-none focus:outline-none focus:ring-0 focus:border-none focus:ring-offset-0 focus-visible:ring-0"
                          {...field}
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
                  disabled={resetPassword.isPending}
                >
                  {resetPassword.isPending ? (
                    <LoadingSpinner
                      text={t("saving")}
                      color="white"
                      size="sm"
                      className="text-white"
                    />
                  ) : (
                    t("savePassword")
                  )}
                </Button>

                <DialogClose asChild>
                  <Button
                    variant="outline"
                    className="h-11 rounded-none py-3 px-6"
                  >
                    {t("cancel")}
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
