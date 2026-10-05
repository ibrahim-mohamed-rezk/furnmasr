"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ArrowRightIcon } from "lucide-react";
import Image from "next/image";
import { LocalizedLink as Link } from "@/components/Shared/LocalizedLink";
import { useTranslation } from "@/hooks/useTranslation";

export function SuccessPayment({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const { t } = useTranslation("checkout");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="h-[80vh] max-w-xl md:max-w-4xl lg:max-w-5xl overflow-hidden overflow-y-auto md:overflow-y-hidden p-0">
        <div className="p-5 md:px-10 lg:px-40 relative w-full h-full flex flex-col justify-center items-center">
          <div className="absolute top-0 left-0 w-full h-full bg-primary/[0.04] z-[-1]"></div>
          <div className="head flex items-center justify-center mb-10">
            <div className="title">
              <h2 className="md:text-5xl text-3xl font-[800]">
                {t("payment_successfully")}
              </h2>
            </div>
          </div>
          <section className="flex flex-col items-center justify-center ">
            <div className="flex mb-10">
              <Image
                src="/success.png"
                alt="success"
                width={270}
                height={270}
                quality={100}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="text-center flex flex-col items-center justify-center gap-6">
              <p className="text-foreground text-lg px-4 md:px-16">
                {t("payment_success_message")}
              </p>
              <Link href="/">
                <Button
                  size="lg"
                  className="bg-black font-[600] text-white rounded-sm transition-all duration-300 capitalize"
                >
                  {t("go_to_order_tracking")}{" "}
                  <ArrowRightIcon className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
