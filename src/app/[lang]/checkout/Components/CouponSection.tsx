"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState, useEffect, useCallback } from "react";
import { useGetData } from "@/hooks/useGetData";
import { toast } from "sonner";
import { isAuthenticated } from "@/hooks/useAuth";
import { simpleSession } from "@/lib/simpleSession";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { useMutate } from "@/hooks/useMutate";
import Cookies from "js-cookie";
import { useTranslation } from "@/hooks/useTranslation";

interface CouponSectionProps {
  onCouponApplied: (couponData: any) => void;
}

function CouponSection({ onCouponApplied }: CouponSectionProps) {
  const [couponCode, setCouponCode] = useState("");
  const { t } = useTranslation("checkout");

  // Validate coupon with proper endpoint construction
  const validateCoupon = useMutate({
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Cookies.get("token")}`,
    },
    endpoint: couponCode.trim()
      ? `/coupon?coupon=${encodeURIComponent(couponCode.trim())}${
          !isAuthenticated()
            ? `&session_id=${parseInt(
                simpleSession.getOrCreateSessionId().replace("anon_", "")
              )}`
            : ""
        }`
      : "",

    onSuccess: (data) => {
      localStorage.setItem("coupon_code", couponCode);
      onCouponApplied(data?.data);
    },
  });

  const handleCouponValidation = () => {
    validateCoupon.mutate(couponCode.trim());
  };

  //   console.log(validateCoupon.data);

  return (
    <>
      <div className="discount-code flex items-center justify-between gap-5 border-b border-t border-border py-10">
        <Input
          type="text"
          placeholder={t("enter_discount_code")}
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          className="h-12 rounded-sm bg-muted/60 dark:bg-muted/30 border border-border focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        <Button
          className="bg-foreground text-background hover:bg-foreground/90 px-10 h-12 rounded-sm font-[600] tracking-wider"
          onClick={handleCouponValidation}
          disabled={validateCoupon.isPending}
        >
          {validateCoupon.isPending ? (
            <LoadingSpinner
              text={t("applying")}
              color="white"
              size="sm"
              className="text-white"
            />
          ) : (
            t("apply")
          )}
        </Button>
      </div>

      {/* {couponData && (
        <div className="discount-applied bg-green-50 border border-green-200 rounded-md p-4 mb-5">
          <div className="flex items-center justify-between">
            <p className="text-green-800 font-medium">
              {couponData.coupon_message}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={removeCoupon}
              className="text-red-600 border-red-300 hover:bg-red-50"
            >
              Remove
            </Button>
          </div>
        </div>
      )} */}
    </>
  );
}

export default CouponSection;
