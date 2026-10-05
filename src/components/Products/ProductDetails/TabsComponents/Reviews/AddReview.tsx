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
  FormLabel,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Rating } from "@/components/ui/rating";
import { UploadCloud, XIcon, Loader2 } from "lucide-react";
import { useState, useRef, useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "@/hooks/useTranslation";
import { useQueryClient } from "@tanstack/react-query";
import { useMutate } from "@/hooks/useMutate";
import { ReviewSubmissionData } from "@/lib/api";
import { toast } from "sonner";
import { isAuthenticated } from "@/hooks/useAuth";
import { signIn } from "next-auth/react";
import { postLoginRedirect } from "@/lib/postLoginRedirect";
import { dataUrlToFile, reviewDraft } from "@/lib/reviewDraft";
import Image from "next/image";
import { FaFacebook } from "react-icons/fa";

interface AddReviewProps {
  productId: number;
  onReviewSubmitted?: () => void;
}

export function AddReview({ productId, onReviewSubmitted }: AddReviewProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isLoggingInRef = useRef(false);
  const { t } = useTranslation("shop");
  const { t: authT } = useTranslation();
  const queryClient = useQueryClient();
  const isAuth = isAuthenticated();

  const formSchema = useMemo(
    () =>
      z.object({
        rating: z.number().min(1, { message: t("validation_rating_min") }),
        review: z.string().min(10, { message: t("validation_review_min") }),
        name: z.string().min(2, { message: t("validation_name_min") }),
        email: z.string().email({ message: t("validation_email_invalid") }),
        image: z.any().optional(),
      }),
    [t]
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rating: 0,
      review: "",
      name: "",
      email: "",
      image: undefined,
    },
  });

  const saveDraft = (reopenDialog = false) => {
    const values = form.getValues();
    reviewDraft.save({
      productId,
      rating: values.rating,
      review: values.review,
      name: values.name,
      email: values.email,
      imagePreview,
      reopenDialog,
    });
  };

  const restoreDraft = (draft: NonNullable<ReturnType<typeof reviewDraft.consume>>) => {
    form.reset({
      rating: draft.rating,
      review: draft.review,
      name: draft.name,
      email: draft.email,
      image: undefined,
    });

    if (draft.imagePreview) {
      setImagePreview(draft.imagePreview);
      try {
        form.setValue("image", dataUrlToFile(draft.imagePreview, "review-image.jpg"));
      } catch {
        form.setValue("image", undefined);
      }
    }
  };

  useEffect(() => {
    const draft = reviewDraft.consume(productId);
    if (!draft?.reopenDialog) return;

    restoreDraft(draft);
    setIsOpen(true);
  }, [productId]);

  // Use custom useMutate hook for review submission
  const submitReviewMutation = useMutate({
    endpoint: "/review",
    method: "POST",
    successMessage: t("review_submitted_successfully"),
    errorMessage: t("error_submitting_review"),
    showSuccessToast: true,
    showErrorToast: true,
    onSuccess: () => {
      reviewDraft.clear();
      // Reset form and close dialog on success
      resetForm();
      setIsOpen(false);

      // Invalidate and refetch product data to show new review
      queryClient.invalidateQueries({
        queryKey: ["singleProduct", productId],
      });

      // Call callback if provided
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
    },
  });

  const resetForm = () => {
    form.reset();
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDialogChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      if (!isLoggingInRef.current) {
        resetForm();
        reviewDraft.clear();
      }
      isLoggingInRef.current = false;
    }
  };

  const handleSocialLogin = (provider: "google" | "facebook") => {
    isLoggingInRef.current = true;
    saveDraft(true);
    postLoginRedirect.capture();
    signIn(provider);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      form.setValue("image", files[0]); // Set single image
      // Show preview of the image
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    form.setValue("image", undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!isAuthenticated()) {
      saveDraft(true);
      toast.info(t("please_login_to_add_review"));
      return;
    }

    const reviewData: ReviewSubmissionData = {
      rate: values.rating.toString(),
      review: values.review,
      name: values.name,
      email: values.email,
      product_id: productId.toString(),
      image: values.image || undefined,
    };

    // Use the mutation to submit the review
    submitReviewMutation.mutate(reviewData);
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogChange}>
      <DialogTrigger asChild>
        <div className="flex justify-center">
          <Button className="hover:bg-black hover:text-white w-[250px] lg:w-full h-11 rounded-sm">
            {t("add_review")}
          </Button>
        </div>
      </DialogTrigger>

      <DialogContent className="h-[80vh] max-w-xl md:max-w-4xl lg:max-w-5xl overflow-visible p-0 [&>button]:top-0 [&>button]:left-1/2 [&>button]:right-auto [&>button]:start-auto [&>button]:end-auto [&>button]:-translate-x-1/2 [&>button]:-translate-y-1/2 [&>button]:z-[1001] [&>button]:rounded-full [&>button]:border-2 [&>button]:border-border [&>button]:bg-background [&>button]:p-2 [&>button]:shadow-md md:[&>button]:opacity-100">
        <div className="h-full overflow-x-hidden overflow-y-auto md:overflow-y-hidden">
        <div className="lg:p-10 p-5 pt-10 relative w-full min-h-full">
          <div className="absolute top-0 left-0 w-full h-full bg-primary/[0.04] z-[-1]"></div>
          <div className="head flex items-center justify-center mb-6 md:mb-10">
            <div className="title">
              <h2 className="md:text-5xl text-3xl font-[800]">
                {t("write_review")}
              </h2>
            </div>
          </div>

          {!isAuth && (
            <div className="mb-8 flex w-full flex-col items-center gap-3 border-b border-border pb-6">
              <p className="text-center text-sm font-medium text-foreground">
                {t("login_to_submit_review")}
              </p>
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => handleSocialLogin("google")}
                className="h-12 w-full max-w-md rounded-sm text-muted-foreground shadow-none hover:bg-black hover:text-white"
              >
                <Image
                  src="/Auth/google.png"
                  alt="google"
                  width={20}
                  height={20}
                />
                {authT("auth.continue_with_google")}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => handleSocialLogin("facebook")}
                className="h-12 w-full max-w-md rounded-sm text-muted-foreground shadow-none hover:bg-[#1877F2] hover:text-white"
              >
                <FaFacebook className="h-5 w-5 text-[#1877F2]" />
                {authT("auth.continue_with_facebook")}
              </Button>
            </div>
          )}

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid grid-cols-1 md:grid-cols-2 gap-10"
            >
                <div className="left space-y-10">
                  <div className="rating">
                    <FormField
                      control={form.control}
                      name="rating"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xl font-bold">
                            {t("rating")}
                          </FormLabel>
                          <div className="stars flex items-center gap-5 mt-2">
                            <div className="flex flex-col gap-1">
                              <Rating
                                value={field.value}
                                onValueChange={(value) => field.onChange(value)}
                                size={40}
                                allowFraction={true}
                              />
                            </div>

                            {field.value > 0 && (
                              <div className="clear">
                                <Button
                                  type="button"
                                  variant="outline"
                                  className="text-red-500 hover:text-red-500 p-0 border-none shadow-none hover:bg-transparent"
                                  onClick={() => field.onChange(0)}
                                >
                                  <XIcon className="w-4 h-4" />
                                  <span className="text-xs">
                                    {t("clear_rating")}
                                  </span>
                                </Button>
                              </div>
                            )}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="review">
                    <FormField
                      control={form.control}
                      name="review"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xl font-bold mb-2">
                            {t("review")}
                          </FormLabel>
                          <FormControl>
                            <textarea
                              placeholder={t("enter_your_review")}
                              rows={5}
                              className="flex min-h-[80px] w-full rounded-md border-none bg-[#EDE7E0] px-3 py-2 text-sm focus:outline-none focus:ring-0 focus:border-none resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="picture">
                    <FormItem>
                      <FormLabel className="text-xl font-bold mb-2">
                        {t("upload_picture")} ({t("optional")})
                      </FormLabel>
                      <div className="flex items-center gap-5">
                        <div className="flex">
                          <Label
                            htmlFor="picture"
                            className="icon p-6 bg-[#EDE7E0] cursor-pointer hover:bg-accent transition-colors rounded-md"
                          >
                            <UploadCloud className="w-8 h-8" />
                          </Label>
                        </div>
                        {imagePreview && (
                          <div className="picture-preview relative">
                            <img
                              src={imagePreview}
                              alt="picture"
                              className="w-20 h-20 object-cover rounded"
                              width={100}
                              height={100}
                            />
                            <button
                              type="button"
                              onClick={handleRemoveImage}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                            >
                              <XIcon className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                      <Input
                        ref={fileInputRef}
                        type="file"
                        className="w-full bg-[#EDE7E0] rounded-none h-12 hidden"
                        accept="image/*"
                        id="picture"
                        onChange={handleFileChange}
                        multiple
                      />
                    </FormItem>
                  </div>
                </div>

                <div className="right space-y-10">
                  <div className="fields space-y-8">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xl font-bold mb-2">
                            {t("name")}
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder={t("enter_your_name")}
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
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xl font-bold mb-2">
                            {t("email")}
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder={t("enter_your_email")}
                              type="email"
                              className="w-full bg-[#EDE7E0] rounded-none h-12 border-none focus:outline-none focus:ring-0 focus:border-none focus:ring-offset-0 focus-visible:ring-0"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="description lg:px-0">
                    <p className="text-sm text-foreground text-center">
                      {t("how_we_use_your_data")}
                      <br /> {t("review_guidelines")}
                    </p>
                  </div>

                  <div className="submit-btn flex flex-col justify-center gap-5">
                    <div className="flex justify-center gap-5">
                    <Button
                      type="submit"
                      className="bg-black text-white py-3 px-6 rounded-none hover:bg-primary transition-colors h-11"
                      disabled={submitReviewMutation.isPending}
                    >
                      {submitReviewMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          {t("submitting")}
                        </>
                      ) : (
                        t("submit_review")
                      )}
                    </Button>
                    <div className="close">
                      <DialogClose asChild>
                        <Button
                          variant="outline"
                          className="h-11 hover:bg-accent rounded-none hover:text-foreground py-3 px-6 border-black"
                          disabled={submitReviewMutation.isPending}
                        >
                          {t("close_review")}
                        </Button>
                      </DialogClose>
                    </div>
                    </div>
                  </div>
                </div>
              </form>
            </Form>
        </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
