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
import { FaApple, FaFacebook } from "react-icons/fa";
import { useTranslation } from "@/hooks/useTranslation";
import { useLogin } from "@/hooks/useAuth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn, useSession } from "next-auth/react";
import { postLoginRedirect } from "@/lib/postLoginRedirect";

// Login form schema
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function Login({
  setCurrentForm,
  setForgotPasswordOpen,
  setShowAuthOpen,
}: {
  setCurrentForm: (form: string) => void;
  setForgotPasswordOpen: (open: boolean) => void;
  setShowAuthOpen: (open: boolean) => void;
}) {
  const { t } = useTranslation();
  const loginMutation = useLogin(
    t("auth.login_successful"),
    t("auth.login_failed")
  );

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center h-full">
      <div className="left flex flex-col gap-4 md:gap-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="">
            <div className="grid gap-8">
              <div className="flex items-center justify-center">
                <Image
                  src="/logo.webp"
                  alt="logo"
                  width={100}
                  height={100}
                />
              </div>

              <div className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-bold transition-all duration-200 text-foreground">
                        {t("auth.email")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder={t("auth.enter_your_email")}
                          className="bg-[#EDE7E0] rounded-sm transition-all duration-300 h-12 placeholder:text-foreground/70 outline-none focus:bg-background"
                          disabled={loginMutation.isPending}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-bold text-foreground transition-all duration-200">
                        {t("auth.password")}
                      </FormLabel>
                      <FormControl>
                        <FormPasswordInput
                          placeholder={t("auth.enter_your_password")}
                          className="bg-[#EDE7E0] rounded-sm transition-all duration-300 h-12 placeholder:text-foreground/70 outline-none focus:bg-background"
                          disabled={loginMutation.isPending}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />

                      <div className="forgot-password flex items-center justify-end mt-1">
                        <Button
                          variant="link"
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            setForgotPasswordOpen(true);
                            setShowAuthOpen(false);
                          }}
                          className="text-sm text-foreground p-0 h-0 mt-3 text-foreground underline"
                        >
                          {t("auth.forgot_password")}
                        </Button>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex items-center justify-center">
                <Button
                  type="submit"
                  size="lg"
                  disabled={loginMutation.isPending}
                  className="bg-black text-white rounded-sm transition-all duration-300 capitalize h-12 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loginMutation.isPending ? (
                    <LoadingSpinner
                      text={t("auth.logging_in")}
                      color="white"
                      size="sm"
                      className="text-white"
                    />
                  ) : (
                    t("auth.login")
                  )}
                </Button>
              </div>
            </div>
          </form>
        </Form>

        <div className="flex items-center gap-2 my-6 px-16">
          <div className="w-full h-[2px] bg-black dark:bg-border"></div>
          <span className="text-foreground text-md font-bold">
            {t("auth.or")}
          </span>
          <div className="w-full h-[2px] bg-black dark:bg-border"></div>
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

          {/* <div className="apple flex items-center justify-center w-full">
            <Button
              size="lg"
              className="rounded-sm transition-all duration-300 capitalize bg-black text-white w-full h-11"
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
              onClick={() => setCurrentForm("signup")}
            >
              {t("auth.dont_have_an_account")}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 items-center justify-center hidden md:flex">
        <div className="px-10 flex flex-col gap-4">
          <div className="title">
            <h3 className="text-3xl font-bold capitalize">
              {t("auth.new_customer")}
            </h3>
          </div>
          <div className="decs">
            <p className="text-foreground text-lg">
              {t("auth.not_a_customer_yet")}
            </p>
          </div>
          <div className="button">
            <Button
              size="lg"
              onClick={() => setCurrentForm("signup")}
              className="text-foreground text-lg bg-black text-white rounded-sm transition-all duration-300 capitalize h-12"
            >
              {t("auth.sign_up_now")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
