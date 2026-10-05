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
import { Shield, Timer } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForgetPassword, useValidateOtp } from "@/hooks/useAuth";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { useTranslation } from "@/hooks/useTranslation";

const otpSchema = z.object({
  otp1: z.string().length(1, { message: "Required" }),
  otp2: z.string().length(1, { message: "Required" }),
  otp3: z.string().length(1, { message: "Required" }),
  otp4: z.string().length(1, { message: "Required" }),
  otp5: z.string().length(1, { message: "Required" }),
  otp6: z.string().length(1, { message: "Required" }),
});

interface OtpVerificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOtpVerified: () => void;
  email: string;
}

export function OtpVerificationDialog({
  open,
  onOpenChange,
  onOtpVerified,
  email,
}: OtpVerificationDialogProps) {
  const { t } = useTranslation("common");
  const [resendTimer, setResendTimer] = useState(60);
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const form = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp1: "",
      otp2: "",
      otp3: "",
      otp4: "",
      otp5: "",
      otp6: "",
    },
  });
  const validateOtp = useValidateOtp();
  const resendOtp = useForgetPassword();

  // Timer for resend OTP
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0 && open) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer, open]);

  // Reset timer when dialog opens
  useEffect(() => {
    if (open) {
      setResendTimer(60);
    }
  }, [open]);

  const handleInputChange = (index: number, value: string) => {
    // Only allow single digit
    if (value.length > 1) {
      value = value.slice(-1);
    }

    // Update form value
    const fieldName = `otp${index + 1}` as keyof z.infer<typeof otpSchema>;
    form.setValue(fieldName, value);

    // Move to next input if value is entered
    if (value && index < 5) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    // Move to previous input on backspace if current input is empty
    if (
      e.key === "Backspace" &&
      !form.getValues(`otp${index + 1}` as keyof z.infer<typeof otpSchema>) &&
      index > 0
    ) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleSubmit = (values: z.infer<typeof otpSchema>) => {
    const otp = values.otp1 + values.otp2 + values.otp3 + values.otp4 + values.otp5 + values.otp6;
    validateOtp.mutate(
      { email, otp },
      {
        onSuccess: () => {
          onOpenChange(false);
          form.reset();
          onOtpVerified();
        },
      }
    );
  };

  const handleResendOtp = () => {
    resendOtp.mutate(
      { email },
      {
        onSuccess: () => setResendTimer(60),
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
                  <Shield className="w-8 h-8" />
                </div>
              </div>
              <h2 className="md:text-4xl text-2xl font-[900]">
                {t("verifyOtp")}
              </h2>
              <div className="text-center mt-4">
                <p className="text-muted-foreground mb-2">
                  {t("weveSentA4DigitOtpTo")}
                </p>
                <p className="font-semibold text-foreground">{email}</p>
              </div>
            </div>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-8 w-full"
            >
              <div className="space-y-6">
                <div className="flex justify-center gap-4">
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <FormField
                      key={index}
                      control={form.control}
                      name={
                        `otp${index + 1}` as keyof z.infer<typeof otpSchema>
                      }
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              ref={inputRefs[index]}
                              type="text"
                              maxLength={1}
                              className="w-12 h-12 bg-[#EDE7E0] rounded-none border-none focus:outline-none focus:ring-0 focus:border-none focus:ring-offset-0 focus-visible:ring-0 text-center text-2xl font-bold"
                              value={field.value}
                              onChange={(e) =>
                                handleInputChange(index, e.target.value)
                              }
                              onKeyDown={(e) => handleKeyDown(index, e)}
                              onFocus={(e) => e.target.select()}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
              </div>

              <div className="flex justify-center">
                {resendTimer > 0 ? (
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <Timer className="w-4 h-4" />
                    <span>
                      {t("resendOtpIn")} {resendTimer}s
                    </span>
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="link"
                    onClick={handleResendOtp}
                    className="text-blue-600 hover:text-blue-800 underline p-0 h-auto"
                  >
                    {resendOtp.isPending ? (
                      <LoadingSpinner text="Sending" color="black" size="sm" />
                    ) : (
                      t("resendOtp")
                    )}
                  </Button>
                )}
              </div>

              <div className="flex gap-4 justify-center items-center">
                <Button
                  type="submit"
                  className="bg-black text-white py-3 px-6 rounded-none hover:bg-primary transition-colors h-11"
                  disabled={validateOtp.isPending}
                >
                  {validateOtp.isPending ? (
                    <LoadingSpinner
                      text={t("verifying")}
                      color="white"
                      size="sm"
                      className="text-white"
                    />
                  ) : (
                    t("verifyOtp")
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
