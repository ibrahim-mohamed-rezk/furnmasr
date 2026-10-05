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
import { Mail } from "lucide-react";
import { useState } from "react";
import { useForgetPassword } from "@/hooks/useAuth";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "@/hooks/useTranslation";

const forgotPasswordEmailSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

interface ForgotPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOtpSent: (email: string) => void;
}

export function ForgotPasswordDialog({
  open,
  onOpenChange,
  onOtpSent,
}: ForgotPasswordDialogProps) {
  const {t} = useTranslation("common");
  const form = useForm<z.infer<typeof forgotPasswordEmailSchema>>({
    resolver: zodResolver(forgotPasswordEmailSchema),
    defaultValues: {
      email: "",
    },
  });
  const forgetPassword = useForgetPassword();

  const handleSubmit = async (
    values: z.infer<typeof forgotPasswordEmailSchema>
  ) => {
    forgetPassword.mutate(
      { email: values.email },
      {
        onSuccess: () => {
          onOpenChange(false);
          onOtpSent(values.email);
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
                  <Mail className="w-8 h-8" />
                </div>
              </div>
              <h2 className="md:text-4xl text-2xl font-[900]">
                {t("forgotPassword")}
              </h2>
              <p className="text-muted-foreground mt-2">
                {t("enterEmailToReceiveVerificationCode")}
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
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder={t("enterEmailAddress")}
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
                  disabled={forgetPassword.isPending}
                >
                  {forgetPassword.isPending ? (
                    <LoadingSpinner
                      text={t("sending")}
                      color="white"
                      size="sm"
                      className="text-white"
                    />
                  ) : (
                    t("sendOtp")
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
