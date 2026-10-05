import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, ArrowRight, MoveUpLeft, MoveUpRight } from "lucide-react";
import { LocalizedLink as Link } from "@/components/Shared/LocalizedLink";
import React, { useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { useLanguage } from "@/contexts/LanguageContext";
import { Skeleton } from "@/components/ui/skeleton";

interface OrderFilters {
  status: string | null;
  sort: "asc" | "desc" | null;
}

interface OrdersProps {
  orders: any[];
  isLoading: boolean;
  filters: OrderFilters;
  onFiltersChange: (newFilters: Partial<OrderFilters>) => void;
}

function Orders({ orders, isLoading, filters, onFiltersChange }: OrdersProps) {
  const { t } = useTranslation();
  const { direction } = useLanguage();

  // Order status options based on the filter structure
  const statusOptions = [
    {
      label: t("account.all_orders"),
      value: null,
    },
    // {
    //   label: t("account.pending"),
    //   value: "pending",
    // },
    {
      label: t("account.confirmed"),
      value: "confirmed",
    },
    // {
    //   label: t("account.processing"),
    //   value: "processing",
    // },
    {
      label: t("account.shipped"),
      value: "shipped",
    },
    {
      label: t("account.delivered"),
      value: "delivered",
    },
    // {
    //   label: t("account.cancelled"),
    //   value: "cancelled",
    // },
    // {
    //   label: t("account.refunded"),
    //   value: "refunded",
    // },
  ];

  // Sort options based on the filter structure
  const sortOptions = [
    {
      label: t("account.date_new_to_old"),
      value: "desc" as const,
    },
    {
      label: t("account.date_old_to_new"),
      value: "asc" as const,
    },
  ];

  const handleStatusChange = (status: string | null) => {
    onFiltersChange({ status });
  };

  const handleSortChange = (sort: "asc" | "desc" | null) => {
    onFiltersChange({ sort });
  };

  return (
    <section>
      <div className="orders-empty space-y-5 border-b border-border pb-10 mb-10">
        <div className="head">
          <div className="title">
            <h2 className="text-2xl font-[600]">
              {t("account.order_history")}
            </h2>
          </div>
        </div>
        <div className="content space-y-6">
          <div className="desc space-y-2">
            <p className="text-md md:text-xl font-[600]">
              {t("account.track_your_orders")}
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

      <div className="orders-filter&sort flex items-center justify-between mb-10 flex-col md:flex-row gap-5">
        <div className="filter">
          <ul className="flex items-center flex-wrap gap-2">
            {statusOptions.map((statusOption) => (
              <li key={statusOption.value || "all"}>
                <Button
                  variant="outline"
                  onClick={() => handleStatusChange(statusOption.value)}
                  className={`rounded-sm py-3 px-6 ${
                    statusOption.value === filters.status
                      ? "bg-black text-white border border-black hover:bg-black hover:text-white"
                      : "bg-transparent text-foreground border-black"
                  }`}
                >
                  {statusOption.label}
                </Button>
              </li>
            ))}
          </ul>
        </div>
        <div className="sort">
          <Select
            value={filters.sort || undefined}
            onValueChange={(value: string) =>
              handleSortChange(value as "asc" | "desc" | null)
            }
          >
            <SelectTrigger className="w-[200px] bg-transparent shadow-none outline-none focus:ring-0 text-foreground text-sm font-semibold !text-foreground">
              <SelectValue placeholder={t("account.sort_by")} />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((sortOption) => (
                <SelectItem key={sortOption.value} value={sortOption.value}>
                  {sortOption.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="orders-list space-y-5">
        {orders.length > 0 ? orders.map((order) => (
          <div
            key={order.id}
            className="order-item border border-border rounded-sm p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-5"
          >
            <div className="space-y-3">
              <div className="date">
                <p className="text-md text-muted-foreground">{order.date}</p>
              </div>

              <div className="order-id">
                <p className="text-lg font-semibold">
                  {t("account.order_id")}: {order.orderId}
                </p>
              </div>

              <div className="num-of-items">
                <p className="text-lg text-foreground">
                  {t("account.no_of_items")}: {order.quantity}
                </p>
              </div>

              <div className="total-price">
                <h3 className="text-lg font-semibold text-primary">
                  {t("account.total_price")}: {order.totalPrice}{" "}
                  {t("common.egp")}
                </h3>
              </div>
            </div>

            <div className="track">
              <Link href={`/account?tab=order-tracking&orderId=${order.id}`}>
                <Button className="h-11 rounded-sm py-3 px-6 hover:bg-black hover:text-white font-semibold tracking-wide">
                  {t("account.track_your_order")}
                  {direction === "ltr" ? (
                    <MoveUpRight className="w-4 h-4" />
                  ) : (
                    <MoveUpLeft className="w-4 h-4" />
                  )}
                </Button>
              </Link>
            </div>
          </div>
        )) : (
          <div className="text-center py-20">
            <h3 className="text-xl font-semibold text-primary mb-2 bg-muted p-4 rounded-lg">
              {t("account.no_orders_found")}
            </h3>
          </div>
        )}
      </div>
    </section>
  );
}

export default Orders;
