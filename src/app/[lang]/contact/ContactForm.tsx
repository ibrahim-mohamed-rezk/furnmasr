"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useTranslation } from "@/hooks/useTranslation";
import { useContact } from "@/hooks/useContact";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  phone: z.string().min(11, {
    message: "Phone must be at least 11 characters.",
  }),
  content: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
});

export default function ContactForm() {
  const { t } = useTranslation("contact");
  const { mutate: submitContact, isPending, } = useContact();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      content: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    submitContact(values, {
      onSuccess: () => {
        form.reset();
      },
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder={t("enter_your_name")}
                    className="w-full bg-[#EDE7E0] rounded-none h-12"
                    disabled={isPending}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder={t("enter_your_phone")}
                    type="tel"
                    className="w-full bg-[#EDE7E0] rounded-none h-12"
                    disabled={isPending}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <textarea
                  placeholder={t("enter_your_message")}
                  rows={5}
                  className="flex min-h-[80px] w-full rounded-none border border-input bg-[#EDE7E0] px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={isPending}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="submit-btn flex justify-center">
          <button
            type="submit"
            disabled={isPending}
            className="bg-black text-white py-3 px-6 rounded-none hover:bg-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {t("sending")}
              </>
            ) : (
              t("send_message")
            )}
          </button>
        </div>
      </form>
    </Form>
  );
}
