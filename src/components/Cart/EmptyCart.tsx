import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";
import Image from "next/image";
import { LocalizedLink as Link } from "@/components/Shared/LocalizedLink";
import React from "react";
import { useTranslation } from "@/hooks/useTranslation";

function EmptyCart({ setOpen }: { setOpen: (open: boolean) => void }) {
  const { t } = useTranslation("cart");
  return (
    <section className="flex flex-col items-center justify-center h-[calc(100vh-75px)] px-8">
      <div className="flex mb-10">
        <Image
          src="/empty-cart.png"
          alt="empty-cart"
          width={270}
          height={270}
          quality={100}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="text-center flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold">{t("empty_cart")}</h2>
        <p className="text-foreground text-lg">{t("empty_cart_description")}</p>
        <Link href="/shop">
          <Button
            size="lg"
            className="bg-black text-white rounded-sm transition-all duration-300 capitalize"
            onClick={() => setOpen(false)}
          >
            {t("go_to_shop")}
            <ArrowRightIcon className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </section>
  );
}

export default EmptyCart;
