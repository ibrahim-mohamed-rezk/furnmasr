import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';
import { ArrowLeft, ArrowRight, Stars } from 'lucide-react'
import React from 'react'
import { useLanguage } from '@/contexts/LanguageContext';
import { LocalizedLink as Link } from "@/components/Shared/LocalizedLink";

function EmptyOrders() {
  const { t } = useTranslation();
  const { direction } = useLanguage();
  return (
    <section>
      <div className="orders-empty space-y-5">
        <div className="head">
          <div className="title">
            <h2 className="text-2xl font-[600]">
              {t("account.order_history")}
            </h2>
          </div>
        </div>
        <div className="content space-y-6">
          <div className="desc space-y-2">
            <p className="text-xl font-[600]">
              {t("account.you_haven_t_placed_any_orders_yet")}
            </p>
            <p className="flex items-center gap-3">
              <Stars className="w-6 h-6 text-[#C28D2A]" />
              <span className="text-lg text-muted-foreground">
                {t("account.make_your_first_order")}
              </span>
              <Stars className="w-6 h-6 text-[#C28D2A]" />
            </p>
          </div>

          <div className="go-to-shop">
            <Link href={"/shop"}>
              <Button className="h-11 rounded-sm py-3 px-6 bg-black text-white">
                {t("account.go_to_shop")}
                {direction === "ltr" ? (
                  <ArrowRight className="w-4 h-4" />
                ) : (
                  <ArrowLeft className="w-4 h-4" />
                )}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default EmptyOrders