import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { useLanguage } from "@/contexts/LanguageContext";
import Steps from "@/components/ui/steps";
import { PlaceholderImage } from "@/components/ui/placeholder-image";

function TrackOrder({
  selectedOrder,
  orderTrackHead,
}: {
  selectedOrder: any;
  orderTrackHead: () => React.ReactNode;
}) {
  const { t } = useTranslation();

  return (
    <section>
      {orderTrackHead()}

      <div className="order-info border border-border rounded-sm p-4 md:p-8">
        <ul className="space-y-3">
          <li className="grid grid-cols-2 gap-5">
            <p className="text-md font-semibold">{t("account.order_id")}</p>
            <p className="text-md font-semibold text-muted-foreground">
              {selectedOrder.orderId}
            </p>
          </li>
          <li className="grid grid-cols-2 gap-5">
            <p className="text-md font-semibold">{t("account.date_time")}</p>
            <p className="text-md font-semibold text-muted-foreground">
              {selectedOrder.date}
            </p>
          </li>
        </ul>
      </div>

      <div className="order-timeline p-4 md:p-8 border border-border rounded-sm mt-5">
        <Steps
          steps={[
            {
              title: t("account.order_confirmed"),
              dateText: selectedOrder.date,
              active: true,
            },
            {
              title: t("account.shipped"),
              dateText: selectedOrder.shipped_at || t("common.pending"),
              active: !!selectedOrder.shipped_at,
            },
            {
              title: t("account.delivered"),
              dateText: selectedOrder.delivered_at || t("common.pending"),
              active: !!selectedOrder.delivered_at,
            },
          ]}
        />

        <ul className="space-y-3">
          <li className="grid grid-cols-2 gap-5">
            <p className="text-md font-semibold">{t("account.order_status")}</p>
            <p className="text-md font-semibold text-muted-foreground">
              {selectedOrder.status}
            </p>
          </li>
          <li className="grid grid-cols-2 gap-5">
            <p className="text-md font-semibold">{t("account.last_update")}</p>
            <p className="text-md font-semibold text-muted-foreground">
              {selectedOrder.date}
            </p>
          </li>
        </ul>
      </div>

      <section className="p-4 md:p-8 border border-border rounded-sm mt-5">
        <div className="title mb-5 md:mb-10">
          <h2 className="text-xl font-[800] text-center border-b border-primary pb-5">
            {t("account.order_summary")}
          </h2>
        </div>

        <div className="products space-y-10">
          {selectedOrder.items.map((product: any) => (
            <div
              className="product flex items-center flex-wrap justify-between gap-4 border-b border-border pb-10 last:border-b-0"
              key={product.id}
            >
              <div className="info flex items-center flex-wrap gap-5">
                <div className="image relative border border-border rounded-lg">
                  <div className="img w-20 h-20 overflow-hidden">
                    <PlaceholderImage
                      src={product.image?.[0] || ""}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="quantity absolute top-[-10px] right-[-10px]">
                    <p className="text-xs bg-primary text-white px-2 py-1 rounded-full">
                      {product.quantity}
                    </p>
                  </div>
                </div>

                <div className="title">
                  <h3 className="lg:text-lg text-sm font-[600]">
                    {product.name}
                  </h3>
                </div>
              </div>

              <div className="price">
                <p className="lg:text-lg text-sm font-[600]">
                  {product.price} {t("common.egp")}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="total py-10">
          <ul className="space-y-5 w-full">
            <li className="flex items-center justify-between border-b border-border pb-5">
              <h3 className="text-lg font-[600]">
                {selectedOrder.quantity} {t("account.items")}
              </h3>
            </li>
            <li className="flex items-center justify-between">
              <h3 className="text-lg font-[600]">{t("account.subtotal")}</h3>
              <p className="text-lg font-[600]">
                {selectedOrder.summary.subtotal} {t("common.egp")}
              </p>
            </li>
            <li className="flex items-center justify-between">
              <h3 className="text-lg font-[600]">{t("account.discount")}</h3>
              <p className="text-lg font-[600] text-red-500">
                {selectedOrder.summary.discount} {t("common.egp")}
              </p>
            </li>
            <li className="flex items-center justify-between">
              <h3 className="text-lg font-[600]">{t("account.shipping")}</h3>
              <p className="text-lg font-[600]">
                {selectedOrder.summary.shipping} {t("common.egp")}
              </p>
            </li>
            <li className="flex items-center justify-between border-t border-border pt-5">
              <h3 className="text-lg font-[600]">{t("account.total")}</h3>
              <p className="text-lg font-[600]">
                {selectedOrder.summary.total} {t("common.egp")}
              </p>
            </li>

            {/* Payment Method */}
            <li className="flex items-center justify-between border-t border-border pt-5">
              <h2 className="text-sm md:text-lg font-[600]">
                {t("account.payment_method")}
              </h2>

              <div className="payment-info text-sm md:text-md font-[600]">
                {selectedOrder.summary.payment_status}
              </div>
            </li>
          </ul>
        </div>
      </section>
    </section>
  );
}

export default TrackOrder;
