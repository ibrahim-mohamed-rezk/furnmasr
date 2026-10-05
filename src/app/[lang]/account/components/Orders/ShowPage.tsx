import React, { useState, useEffect } from "react";
import Orders from "./Orders";
import EmptyOrders from "./EmptyOrders";
import TrackOrder from "./TrackOrder";
import { useRouter, useSearchParams } from "next/navigation";
import { useGetData } from "@/hooks/useGetData";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { localeHref } from "@/lib/locale";
import { useTranslation } from "@/hooks/useTranslation";
import Image from "next/image";
import {
  CustomPagination,
  usePagination,
} from "@/components/Shared/Pagination";

function ShowPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const router = useRouter();
  const { t } = useTranslation();
  const { direction, language } = useLanguage();
  const { currentPage } = usePagination();

  // Order filters state
  const [orderFilters, setOrderFilters] = useState({
    status: null as string | null,
    sort: null as "asc" | "desc" | null,
  });

  // Build query string with filters
  const buildQueryString = () => {
    const params = new URLSearchParams();
    params.append("page", currentPage.toString());

    if (orderFilters.status) {
      params.append("status", orderFilters.status);
    }
    if (orderFilters.sort) {
      params.append("sort", orderFilters.sort);
    }

    return params.toString();
  };

  const { data: ordersResp, isLoading } = useGetData<{
    orders: any[];
    pagination?: any;
  }>({
    endpoint: `/orders?${buildQueryString()}`,
    queryKey: [
      "orders",
      currentPage,
      orderFilters?.status || "",
      orderFilters?.sort || "",
    ],
    staleTime: 0,
    refetchOnWindowFocus: true,
    showErrorToast: true,
    errorMessage: "Failed to load orders",
  });

  // Update filters and trigger refetch
  const updateFilters = (newFilters: Partial<typeof orderFilters>) => {
    setOrderFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const apiOrders = (ordersResp?.data?.orders ||
    (ordersResp as any)?.orders ||
    []) as any[];

  const orders = isLoading
    ? [
        {
          id: 1,
          date: "2021-01-01",
          orderId: "1234567890",
          totalPrice: 100,
          status: "pending",
          quantity: 1,
          items: [],
        },
      ]
    : apiOrders.map((o) => {
        const items = Array.isArray(o.items) ? o.items : [];
        const mappedItems = items.map((it: any) => ({
          id: it.id,
          name: it.product_name,
          image: it.image,
          price: Number(it.price_at_purchase || 0),
          quantity: Number(it.quantity || 0),
        }));
        const quantity = mappedItems.reduce(
          (sum: number, it: any) => sum + (it.quantity || 0),
          0
        );
        return {
          id: o.id,
          date: o.created_at,
          orderId: o.order_number,
          totalPrice: Number(o.total_amount || 0),
          status: o.status,
          quantity,
          items: mappedItems,
          summary: {
            subtotal: Number(o.subtotal || 0),
            discount: Number(o.discount_amount || 0),
            shipping: Number(o.shipping_amount || 0),
            tax: Number(o.tax_amount || 0),
            total: Number(o.total_amount || 0),
            payment_status: o.payment_status,
          },
        };
      });

  const selected = orderId
    ? orders.find((order) => order.id === Number(orderId))
    : null;

  const orderTrackHead = () => {
    return (
      <div className="head flex flex-col sm:flex-row gap-5 items-center justify-between mb-10">
        <div className="title">
          <h2 className="text-2xl font-[600] capitalize">
            {t("account.order_details")}
          </h2>
        </div>

        <div className="back">
          <Button
            onClick={() =>
              router.push(localeHref(`/account?tab=order-tracking`, language))
            }
            size="sm"
            className="h-11 rounded-sm py-3 px-6 bg-black text-white text-[12px] md:text-sm"
          >
            {direction === "ltr" ? (
              <ArrowLeft className="w-4 h-4" />
            ) : (
              <ArrowRight className="w-4 h-4" />
            )}
            {t("account.back_to_orders")}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <section className="space-y-5">
      {isLoading && orderId ? (
        <div className="">
          {orderTrackHead()}
          <div className="order-info border border-border rounded-sm p-8 flex items-center justify-center">
            <Image
              src="/track-order.gif"
              alt="order"
              width={160}
              height={160}
              className="w-160 h-160 object-cover"
            />
          </div>
        </div>
      ) : isLoading ? (
        <div className="orders-list space-y-5">
          {Array.from({ length: 2 }).map((_, idx) => (
            <div
              key={idx}
              className="border border-border rounded-sm p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-5"
            >
              <div className="space-y-3 w-full">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-6 w-64" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-6 w-40" />
              </div>
              <div className="w-full md:w-auto flex justify-end">
                <Skeleton className="h-11 w-48" />
              </div>
            </div>
          ))}
        </div>
      ) : orders.length > 0 ? (
        selected ? (
          <TrackOrder
            selectedOrder={selected}
            orderTrackHead={orderTrackHead}
          />
        ) : (
          <Orders
            orders={orders}
            isLoading={isLoading}
            filters={orderFilters}
            onFiltersChange={updateFilters}
          />
        )
      ) : orderFilters.status === null && orderFilters.sort === null ? (
        <EmptyOrders />
      ) : (
        <Orders
          orders={orders}
          isLoading={isLoading}
          filters={orderFilters}
          onFiltersChange={updateFilters}
        />
      )}

      {/* Pagination */}
      {orders.length > 0 && !orderId && (
        <div className="pagination max-w-7xl mx-auto pb-20 px-6">
          <CustomPagination
            totalPages={ordersResp?.data?.pagination?.last_page || 0}
            currentPage={currentPage}
          />
        </div>
      )}
    </section>
  );
}

export default ShowPage;
