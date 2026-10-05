import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import FormPasswordInput from "@/components/ui/form-password-input";
import LoadingSpinner from "@/components/ui/loading-spinner";
import Image from "next/image";
import { useState } from "react";
import { FaApple, FaFacebook } from "react-icons/fa";
import { useTranslation } from "@/hooks/useTranslation";
import { useRegister } from "@/hooks/useAuth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { postLoginRedirect } from "@/lib/postLoginRedirect";

// Register form schema
const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    password_confirmation: z
      .string()
      .min(6, "Password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords don't match",
    path: ["password_confirmation"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export function Signup({
  setCurrentForm,
}: {
  setCurrentForm: (form: string) => void;
}) {
  const { t } = useTranslation();
  const registerMutation = useRegister(
    t("auth.registration_successful"),
    t("auth.registration_failed")
  );

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    registerMutation.mutate(data, {
      onSuccess: () => {
        // Reset form
        form.reset();

        // Switch to login form
        setCurrentForm("login");
      },
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center h-full">
      <div className="flex flex-col gap-4 items-center justify-center hidden md:block">
        <div className="px-10 flex flex-col gap-4">
          <div className="title">
            <h3 className="text-3xl font-bold capitalize">
              {t("auth.are_you_joining_our_family")}
            </h3>
          </div>
          <div className="decs">
            <p className="text-foreground text-lg">
              {t("auth.you_are_a_customer_and_a_member_of_our_family")}
            </p>
          </div>
          <div className="button">
            <Button
              size="lg"
              onClick={() => setCurrentForm("login")}
              className="text-foreground text-lg bg-black text-white rounded-sm transition-all duration-300 h-12"
            >
              {t("auth.login_now")}
            </Button>
          </div>
        </div>
      </div>
      <div className="left flex flex-col gap-2 md:gap-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="">
            <div className="grid gap-4">
              <div className="flex items-center justify-center mb-10">
                <Image
                  src="/logo.webp"
                  alt="logo"
                  width={150}
                  height={150}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium transition-all duration-200">
                        {t("auth.name")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder={t("auth.enter_your_name")}
                          className="bg-[#EDE7E0] rounded-sm transition-all duration-300 h-12 placeholder:text-foreground/70 outline-none focus:bg-background"
                          disabled={registerMutation.isPending}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium transition-all duration-200">
                        {t("auth.email")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder={t("auth.enter_your_email")}
                          className="bg-[#EDE7E0] rounded-sm transition-all duration-300 h-12 placeholder:text-foreground/70 outline-none focus:bg-background"
                          disabled={registerMutation.isPending}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-foreground transition-all duration-200">
                        {t("auth.password")}
                      </FormLabel>
                      <FormControl>
                        <FormPasswordInput
                          placeholder={t("auth.enter_your_password")}
                          className="bg-[#EDE7E0] rounded-sm transition-all duration-300 h-12 placeholder:text-foreground/70 outline-none focus:bg-background"
                          disabled={registerMutation.isPending}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password_confirmation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-foreground transition-all duration-200">
                        {t("auth.confirm_password")}
                      </FormLabel>
                      <FormControl>
                        <FormPasswordInput
                          placeholder={t("auth.confirm_your_password")}
                          className="bg-[#EDE7E0] rounded-sm transition-all duration-300 h-12 placeholder:text-foreground/70 outline-none focus:bg-background"
                          disabled={registerMutation.isPending}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex items-center justify-center mt-4">
                <Button
                  type="submit"
                  size="lg"
                  disabled={registerMutation.isPending}
                  className="bg-black text-white rounded-sm transition-all duration-300 h-12 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {registerMutation.isPending ? (
                    <LoadingSpinner
                      text={t("auth.creating_account")}
                      color="white"
                      size="sm"
                      className="text-white"
                    />
                  ) : (
                    t("auth.sign_up")
                  )}
                </Button>
              </div>
            </div>
          </form>
        </Form>

        <div className="flex items-center gap-2 my-6">
          <div className="w-full h-[1px] bg-gray-300"></div>
          <span className="text-foreground text-md font-bold">
            {t("auth.or")}
          </span>
          <div className="w-full h-[1px] bg-gray-300"></div>
        </div>

        <div className="social-login flex flex-col md:flex-row justify-center gap-4">
          <div className="google flex items-center justify-center w-full md:w-1/2">
            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                postLoginRedirect.capture();
                signIn("google");
              }}
              className="rounded-sm transition-all duration-300 capitalize hover:text-white shadow-none text-muted-foreground hover:bg-black hover:text-white w-full h-12"
            >
              <Image
                src="/Auth/google.png"
                alt="google"
                width={20}
                height={20}
              />
              {t("auth.continue_with_google")}
            </Button>
          </div>

          <div className="facebook flex items-center justify-center w-full md:w-1/2">
            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                postLoginRedirect.capture();
                signIn("facebook");
              }}
              className="rounded-sm transition-all duration-300 capitalize hover:text-white shadow-none text-muted-foreground hover:bg-[#1877F2] hover:text-white w-full h-12"
            >
              <FaFacebook className="w-5 h-5" color="#1877F2" />
              {t("auth.continue_with_facebook")}
            </Button>
          </div>

          {/* <div className="apple">
            <Button
              size="lg"
              className="rounded-sm transition-all duration-300 capitalize bg-black text-white w-full h-12"
            >
              <FaApple className="w-4 h-4" />
              {t("auth.continue_with_apple")}
            </Button>
          </div> */}
        </div>

        <div className="flex items-center justify-center md:hidden">
          <div className="px-10 flex flex-col gap-4">
            <Button
              size="lg"
              variant="link"
              onClick={() => setCurrentForm("login")}
            >
              {t("auth.already_have_an_account")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
