"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Skeleton } from "@/components/ui/skeleton";

import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { LocalizedLink as Link } from "@/components/Shared/LocalizedLink";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { FaFacebook } from "react-icons/fa";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";
import { useTranslation } from "@/hooks/useTranslation";
import { isAuthenticated } from "@/hooks/useAuth";
import { authStorage } from "@/lib/auth";
import { postLoginRedirect } from "@/lib/postLoginRedirect";
import { useCountries } from "@/hooks/useCountries";
import { useCities } from "@/hooks/useCities";
import { useAddresses } from "@/hooks/useAddresses";
import { usePaymentMethods } from "@/hooks/usePaymentMethods";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutate } from "@/hooks/useMutate";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { SuccessPayment } from "./SuccessPayment";
import { useBuyNowStore } from "@/store/buyNow";
import { useRouter } from "next/navigation";
import { simpleSession } from "@/lib/simpleSession";
import { useCheckoutShipping } from "@/contexts/CheckoutShippingContext";
import {
  trackAddPaymentInfo,
  trackPlaceAnOrder,
  trackPurchaseFromStash,
  stashPurchase,
  consumePurchase,
  TrackedItem,
} from "@/lib/tiktokPixel";

// Form schema will be created inside the component to access translations

interface Address {
  id: number;
  name: string;
  address: string;
  city?: { id: number; name: string };
  region?: { id: number; name: string };
  city_id?: number;
  country_id?: number;
}

function BillingDetails() {
  const [showAddressTabs, setShowAddressTabs] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [expandedAddress, setExpandedAddress] = useState<string | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [expandedPayment, setExpandedPayment] = useState<string | null>(null);
  const [openSuccessPayment, setOpenSuccessPayment] = useState(false);
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const buyNowProduct = useBuyNowStore((s) => s.product);
  const { shippingLocation, setShippingLocation } = useCheckoutShipping();

  const { t, language } = useTranslation("checkout");
  const { t: tAuth } = useTranslation();
  const { cartData, cartLoading, refetchCart } = useCart({
    cityId: shippingLocation.cityId,
    addressId: shippingLocation.addressId,
  });

  // Get countries and cities
  const { countries, isLoading: countriesLoading } = useCountries();
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const {
    cities,
    isLoading: citiesLoading,
    resetPage,
  } = useCities(selectedCountry);

  const isAuth = isAuthenticated();
  const { addresses, isLoading: addressesLoading } = useAddresses({
    enabled: isAuth,
  });

  // Get payment methods from API
  const {
    paymentMethods,
    isLoading: paymentMethodsLoading,
    error: paymentMethodsError,
  } = usePaymentMethods();

  // Create form schema with translations
  const formSchema = z.object({
    email: z.string().email({ message: t("invalid_email_address") }),
    join: z.boolean(),
    integration_id: z.string().optional(),
    phone: z.string().min(1, { message: t("phone_number_required") }),
    first_name: z.string().min(1, { message: t("first_name_required") }),
    last_name: z.string().min(1, { message: t("last_name_required") }),
    address: z.string().min(1, { message: t("address_required") }),
    city_id: z.string().min(1, { message: t("city_required") }),
    country_id: z.string().min(1, { message: t("region_required") }),
    save_info: z.boolean(),
    payment_method: z
      .string()
      .min(1, { message: t("payment_method_required") }),
    address_id: z.string().optional(),
    is_save: z.boolean(),
    is_exclusive: z.boolean(),
  });

  // Prevent hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      phone: "",
      join: false,
      first_name: "",
      last_name: "",
      address: "",
      city_id: "",
      country_id: "",
      save_info: false,
      payment_method: "",
      integration_id: "",
      address_id: "",
      is_save: false,
      is_exclusive: false,
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (countries && countries.length > 0 && !selectedCountry) {
      const firstCountryId = countries[0].id.toString();
      setSelectedCountry(firstCountryId);
      form.setValue("country_id", firstCountryId, { shouldValidate: true });
    }
  }, [countries, selectedCountry, form]);

  // Pre-fill contact and delivery fields with the logged-in user's data so
  // returning customers don't have to retype their email / name / phone.
  useEffect(() => {
    if (!isClient || !isAuthenticated()) return;
    const user = authStorage.getUserData();
    if (!user) return;

    if (user.email && !form.getValues("email")) {
      form.setValue("email", user.email, { shouldValidate: true });
    }
    if (user.phone && !form.getValues("phone")) {
      form.setValue("phone", user.phone, { shouldValidate: true });
    }
    if (user.name) {
      const [firstName, ...rest] = user.name.trim().split(/\s+/);
      if (firstName && !form.getValues("first_name")) {
        form.setValue("first_name", firstName, { shouldValidate: true });
      }
      const lastName = rest.join(" ");
      if (lastName && !form.getValues("last_name")) {
        form.setValue("last_name", lastName, { shouldValidate: true });
      }
    }
  }, [isClient, form]);

  // Handle address selection
  const handleAddressSelect = (address: Address) => {
    setSelectedAddress(address.id.toString());
    setExpandedAddress(address.id.toString());
    form.setValue("address_id", address.id.toString());
    if (address.address) {
      form.setValue("address", address.address, { shouldValidate: true });
    }
    const cityId =
      address.city_id?.toString() || address.city?.id?.toString() || "";
    if (cityId) {
      form.setValue("city_id", cityId, { shouldValidate: true });
    }
  };

  // Handle address toggle
  const handleAddressToggle = (addressId: string) => {
    if (expandedAddress === addressId) {
      setExpandedAddress(null);
    } else {
      setExpandedAddress(addressId);
    }
  };

  // Build the TikTok content items + value for the current checkout (buy-now
  // or cart). Value includes shipping returned by the cart API.
  const buildCheckoutTracking = (): { items: TrackedItem[]; value: number } => {
    const shipping = Number(cartData?.shipping_cost ?? 0);

    if (buyNowProduct) {
      const itemsTotal =
        (Number(buyNowProduct.price) || 0) * (buyNowProduct.quantity || 1);
      return {
        items: [
          {
            content_id: String(buyNowProduct.id),
            content_name: buyNowProduct.name,
            quantity: buyNowProduct.quantity || 1,
            price: Number(buyNowProduct.price) || 0,
          },
        ],
        value: itemsTotal + shipping,
      };
    }

    const cartItems = cartData?.cart?.items || [];
    const items: TrackedItem[] = cartItems.map((it) => ({
      content_id: String(it.product?.id),
      content_name: it.product?.name,
      quantity: it.quantity,
      price:
        Number(it.price ?? it.product?.sale_price ?? it.product?.price) || 0,
    }));
    const itemsTotal = Number(cartData?.cart?.total_amount) || 0;
    return { items, value: itemsTotal + shipping };
  };

  // Handle payment method selection
  const handlePaymentSelect = (method: string) => {
    // TikTok AddPaymentInfo — only when the selection actually changes.
    if (selectedPayment !== method) {
      const { items, value } = buildCheckoutTracking();
      trackAddPaymentInfo(items, value);
    }
    setSelectedPayment(method);
    setExpandedPayment(method);
    form.setValue("payment_method", method);
  };

  const watchedCityId = form.watch("city_id");
  const watchedAddressId = form.watch("address_id");

  // Refetch cart shipping when the customer picks a city or saved address.
  useEffect(() => {
    setShippingLocation({
      cityId: watchedCityId || null,
      addressId: selectedAddress || watchedAddressId || null,
    });
  }, [watchedCityId, watchedAddressId, selectedAddress, setShippingLocation]);

  const shippingCost = Number(cartData?.shipping_cost ?? 0);
  const selectedCity = cities.find(
    (city) => city.id.toString() === watchedCityId?.toString(),
  );

  const { mutate: createOrder, isPending: createOrderLoading } = useMutate({
    method: "POST",
    endpoint: (orderData: { product_id?: number }) =>
      orderData.product_id ? "/orders/buy-now" : "/orders",
    onSuccess: (data) => {
      // Build tracking payload BEFORE refetchCart/form.reset clear the cart.
      // Prefer the server order total/id when present.
      const { items, value } = buildCheckoutTracking();
      const orderValue = Number(data?.data?.total ?? data?.data?.amount) || value;
      const orderId = data?.data?.id ?? data?.data?.order_id;

      // TikTok PlaceAnOrder (both redirect and COD flows reach here).
      trackPlaceAnOrder(items, orderValue);
      // Stash so Purchase can fire after the payment redirect or COD success.
      stashPurchase({ orderId, items, value: orderValue });

      toast.success(t("order_created_successfully"));
      refetchCart();
      form.reset();
      localStorage.removeItem("coupon_code");
      if (data?.data?.payment_url) {
        // Redirect flow — Purchase fires on the payment callback page.
        window.location.href = data?.data?.payment_url;
      } else {
        // COD flow — no redirect, so fire Purchase here.
        const stashed = consumePurchase();
        if (stashed) trackPurchaseFromStash(stashed);
        setOpenSuccessPayment(true);
      }
    },
    onError: (error) => {
      toast.error(t("failed_to_create_order"));
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!cartData?.cart?.items?.length && !buyNowProduct) {
      toast.error(t("your_cart_is_empty"));
      return;
    }

    if (!selectedPayment) {
      toast.error(t("please_select_payment_method"));
      return;
    }

    // Update form values for exclusive and save
    form.setValue("is_exclusive", values.join);
    form.setValue("is_save", values.save_info);

    // Prepare order data
    const selectedMethodObj = paymentMethods?.find((m) => (m.integration_id?.toString() || m.key) === values.payment_method);
    
    const orderData: Record<string, unknown> = {
      email: values.email,
      phone: values.phone,
      first_name: values.first_name,
      last_name: values.last_name,
      address: values.address,
      country_id: values.country_id,
      payment_method: values.payment_method,
      integration_id: selectedMethodObj?.integration_id || values.integration_id || null,
      is_save: values.is_save ? "1" : "0",
      is_exclusive: values.is_exclusive ? "1" : "0",
      coupon: localStorage.getItem("coupon_code") || null,
    };

    orderData.city_id = Number(values.city_id);

    const addressId = selectedAddress || values.address_id;
    if (addressId) {
      orderData.address_id = Number(addressId);
    }

    // Add session_id for non-authenticated users
    if (!isAuth) {
      const sessionId = simpleSession.getOrCreateSessionId();
      const sessionIdNumber = parseInt(sessionId.replace("anon_", ""));
      orderData.session_id = sessionIdNumber;
    }

    // Add cart items or buy now product
    if (buyNowProduct) {
      orderData.product_id = buyNowProduct.id;
      orderData.quantity = buyNowProduct.quantity || 1;
    } else {
      orderData.cart_items = cartData?.cart?.items || [];
    }

    try {
      createOrder(orderData);
    } catch (error) {
      console.error("Order creation error:", error);
      toast.error(t("failed_to_create_order"));
    }
  }

  useEffect(() => {
    if (cartData?.cart?.items?.length === 0 && !buyNowProduct) {
      router.back();
    }
  }, [cartData?.cart?.items?.length, buyNowProduct, router]);

  // Don't render until client-side to prevent hydration mismatch
  if (!isClient) {
    return (
      <section>
        <div className="contact">
          <div className="form w-full">
            <div className="space-y-16">
              {/* Contact Section Skeleton */}
              <div className="space-y-5">
                <div className="head mb-5">
                  <Skeleton className="h-6 w-24" />
                </div>
                <div className="space-y-6">
                  <Skeleton className="h-12 w-full" />
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-6 w-6" />
                    <Skeleton className="h-6 w-48" />
                  </div>
                  <div className="flex items-center">
                    <Skeleton className="h-12 w-16" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                </div>
              </div>

              {/* Delivery Section Skeleton */}
              <div className="space-y-5">
                <div className="head mb-5">
                  <Skeleton className="h-6 w-24" />
                </div>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                  <Skeleton className="h-12 w-full" />
                  <div className="grid grid-cols-2 gap-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-6 w-6" />
                    <Skeleton className="h-6 w-64" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section>
      <SuccessPayment
        open={openSuccessPayment}
        setOpen={setOpenSuccessPayment}
      />
      <div className="contact">
        <div className="form w-full">
          <Form {...form}>
            <form
              key={isClient ? "client" : "server"}
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-16"
            >
              <div className="top space-y-5">
                {isClient && !isAuthenticated() && (
                  <div className="flex flex-col md:flex-row items-stretch gap-3 mb-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      onClick={() => {
                        postLoginRedirect.capture("/checkout");
                        signIn("google");
                      }}
                      className="rounded-md transition-all duration-300 capitalize hover:text-white shadow-none text-muted-foreground hover:bg-black hover:text-white w-full md:flex-1 h-12"
                    >
                      <Image
                        src="/Auth/google.png"
                        alt=""
                        width={20}
                        height={20}
                      />
                      {tAuth("auth.continue_with_google")}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      onClick={() => {
                        postLoginRedirect.capture("/checkout");
                        signIn("facebook");
                      }}
                      className="rounded-md transition-all duration-300 capitalize hover:text-white shadow-none text-muted-foreground hover:bg-[#1877F2] hover:text-white w-full md:flex-1 h-12"
                    >
                      <FaFacebook className="w-5 h-5 shrink-0" color="#1877F2" />
                      {tAuth("auth.continue_with_facebook")}
                    </Button>
                  </div>
                )}
                <div className="head mb-5">
                  <div className="title">
                    <h2 className="text-xl font-bold">{t("contact")}</h2>
                  </div>
                </div>
                <div className="content space-y-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder={t("enter_your_email")}
                            className="w-full h-12 rounded-md bg-muted/60 dark:bg-muted/30 border border-border focus:outline-none focus:ring-0 focus-visible:ring-0"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="join"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-3">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="w-6 h-6 data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=checked]:text-primary-foreground"
                          />
                        </FormControl>
                        <FormLabel className="text-md font-[500] p-0 !mt-0">
                          {t("join_exclusive_list")}
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <div className="cover flex items-center">
                          {/* <FormLabel className="text-md font-[500] p-0 !mt-0 bg-[#EDE7E0] h-12 flex items-center justify-center px-3">
                            +20
                          </FormLabel> */}
                          <FormControl>
                            <Input
                              type="tel"
                              pattern="[0-9]*"
                              inputMode="numeric"
                              maxLength={11}
                              minLength={11}
                              placeholder={t("enter_your_phone_number")}
                              className="w-full h-12 rounded-md bg-muted/60 dark:bg-muted/30 border border-border focus:outline-none focus:ring-0 focus-visible:ring-0"
                              {...field}
                            />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="bottom space-y-16">
                <div className="space-y-5 cover">
                  <div className="head mb-5">
                    <div className="title">
                      <h2 className="text-xl font-bold">{t("delivery")}</h2>
                    </div>
                  </div>

                  <div className="content space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="first_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                placeholder={t("enter_your_first_name")}
                                className="w-full h-12 rounded-md bg-muted/60 dark:bg-muted/30 border border-border focus:outline-none focus:ring-0 focus-visible:ring-0"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="last_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                placeholder={t("enter_your_last_name")}
                                className="w-full h-12 rounded-md bg-muted/60 dark:bg-muted/30 border border-border focus:outline-none focus:ring-0 focus-visible:ring-0"
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
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder={t("enter_your_address")}
                              className="w-full h-12 rounded-md bg-muted/60 dark:bg-muted/30 border border-border focus:outline-none focus:ring-0 focus-visible:ring-0"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="country_id"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Select
                                disabled
                                onValueChange={(val) => {
                                  field.onChange(val);
                                  setSelectedCountry(val);
                                  resetPage();
                                  form.setValue("city_id", "");
                                }}
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="w-full h-12 rounded-md bg-muted/60 dark:bg-muted/30 border border-border focus:outline-none focus:ring-0 focus-visible:ring-0">
                                    <SelectValue
                                      placeholder={t("select_country")}
                                    />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {countriesLoading ? (
                                    <SelectItem disabled value="loading">
                                      <div className="flex items-center gap-2">
                                        <Skeleton className="h-4 w-4" />
                                        <Skeleton className="h-4 w-20" />
                                      </div>
                                    </SelectItem>
                                  ) : (
                                    countries?.map((country) => (
                                      <SelectItem
                                        key={country.id}
                                        value={country.id.toString()}
                                      >
                                        {country.name}
                                      </SelectItem>
                                    ))
                                  )}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="city_id"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                                disabled={!selectedCountry}
                              >
                                <FormControl>
                                  <SelectTrigger className="w-full h-12 rounded-md bg-muted/60 dark:bg-muted/30 border border-border focus:outline-none focus:ring-0 focus-visible:ring-0">
                                    <SelectValue
                                      placeholder={t("select_city")}
                                    />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {citiesLoading ? (
                                    <SelectItem disabled value="loading">
                                      <div className="flex items-center gap-2">
                                        <Skeleton className="h-4 w-4" />
                                        <Skeleton className="h-4 w-20" />
                                      </div>
                                    </SelectItem>
                                  ) : cities && cities.length > 0 ? (
                                    cities.map((city) => (
                                      <SelectItem
                                        key={city.id}
                                        value={city.id.toString()}
                                      >
                                        {city.name}
                                      </SelectItem>
                                    ))
                                  ) : (
                                    <SelectItem disabled value="no-cities">
                                      {t("no_cities_available")}
                                    </SelectItem>
                                  )}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="save_info"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-3">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="w-6 h-6"
                            />
                          </FormControl>
                          <FormLabel className="text-md font-[500] p-0 !mt-0">
                            {t("save_this_information")}
                          </FormLabel>
                        </FormItem>
                      )}
                    />

                    {isClient && isAuthenticated() && addressesLoading && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Skeleton className="h-6 w-48" />
                        </div>
                        <div className="space-y-3">
                          {[1, 2].map((i) => (
                            <div
                              key={i}
                              className="border border-border rounded-md p-4"
                            >
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                  <Skeleton className="h-5 w-5" />
                                  <Skeleton className="h-5 w-32" />
                                </div>
                                <Skeleton className="h-5 w-20" />
                              </div>
                              <div className="space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {isClient &&
                      isAuthenticated() &&
                      !addressesLoading &&
                      addresses.length > 0 && (
                        <>
                          <Button
                            type="button"
                            variant={"link"}
                            className="p-0 h-auto text-lg"
                            onClick={() => setShowAddressTabs(!showAddressTabs)}
                          >
                            {showAddressTabs
                              ? t("hide_saved_addresses")
                              : t("use_saved_address")}
                          </Button>

                          {showAddressTabs && (
                            <>
                              <div className="addresse-tabs">
                                <ul className="space-y-2">
                                  {addresses.map((address) => (
                                    <li key={address.id}>
                                      <div
                                        className={`w-full border-primary hover:bg-transparent border border-primary rounded-md cursor-pointer transition-all duration-300 ${
                                          selectedAddress ===
                                          address.id.toString()
                                            ? "bg-primary/10"
                                            : ""
                                        }`}
                                      >
                                        <div
                                          className="cover flex items-center justify-between gap-3 w-full p-4 cursor-pointer"
                                          onClick={() =>
                                            handleAddressSelect(address)
                                          }
                                        >
                                          <div className="item flex items-center gap-3">
                                            <Input
                                              type="radio"
                                              id={`address-${address.id}`}
                                              name="saved-address"
                                              value={address.id.toString()}
                                              checked={
                                                selectedAddress ===
                                                address.id.toString()
                                              }
                                              onChange={(e) => {
                                                e.stopPropagation();
                                                handleAddressSelect(address);
                                              }}
                                              className="w-5 h-5 focus:ring-primary text-primary accent-primary"
                                            />
                                            <span className="text-md font-[500]">
                                              {address.name}
                                            </span>
                                          </div>

                                          <div
                                            className="flex items-center gap-2"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleAddressToggle(
                                                address.id.toString(),
                                              );
                                            }}
                                          >
                                            <span className="text-xs text-muted-foreground">
                                              {t("expand")}
                                            </span>
                                            <ChevronDown
                                              className={`w-5 h-5 transition-transform duration-300 ${
                                                expandedAddress ===
                                                address.id.toString()
                                                  ? "rotate-180"
                                                  : ""
                                              }`}
                                            />
                                          </div>
                                        </div>

                                        <div
                                          className={`content overflow-hidden transition-all duration-300 ${
                                            expandedAddress ===
                                            address.id.toString()
                                              ? "max-h-[500px] opacity-100 visible"
                                              : "max-h-0 opacity-0 invisible"
                                          }`}
                                        >
                                          <div className="px-4 pb-4">
                                            <ul className="space-y-4 p-3">
                                              <li className="flex items-center justify-between gap-3">
                                                <div className="key ">
                                                  <h3 className="text-sm font-[700]">
                                                    {t("full_name")}
                                                  </h3>
                                                </div>
                                                <div className="value text-sm font-[600] text-muted-foreground">
                                                  <p>{address.name}</p>
                                                </div>
                                              </li>
                                              <li className="flex items-center justify-between gap-3">
                                                <div className="key">
                                                  <h3 className="text-sm font-[700]">
                                                    {t("city")}
                                                  </h3>
                                                </div>
                                                <div className="value text-sm font-[600] text-muted-foreground">
                                                  <p>
                                                    {address.city?.name ||
                                                      "N/A"}
                                                  </p>
                                                </div>
                                              </li>
                                              <li className="flex items-center justify-between gap-3">
                                                <div className="key">
                                                  <h3 className="text-sm font-[700]">
                                                    {t("region")}
                                                  </h3>
                                                </div>
                                                <div className="value text-sm font-[600] text-muted-foreground">
                                                  <p>
                                                    {address.region?.name ||
                                                      "N/A"}
                                                  </p>
                                                </div>
                                              </li>
                                              <li className="flex items-center justify-between gap-3">
                                                <div className="key">
                                                  <h3 className="text-sm font-[700]">
                                                    {t("address")}
                                                  </h3>
                                                </div>
                                                <div className="value text-sm font-[600] text-muted-foreground">
                                                  <p>{address.address}</p>
                                                </div>
                                              </li>
                                            </ul>
                                          </div>
                                        </div>
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </>
                          )}
                        </>
                      )}
                    {isClient &&
                      isAuthenticated() &&
                      !addressesLoading &&
                      addresses.length === 0 && (
                        <div className="text-sm text-muted-foreground bg-primary-light dark:bg-muted/30 border border-transparent dark:border-border p-4 rounded-md text-center">
                          {t("no_saved_addresses")}
                        </div>
                      )}
                  </div>
                </div>

                {/* Shipping Method */}
                <div className="shipping-method">
                  <div className="head mb-5">
                    <div className="title">
                      <h2 className="text-xl font-bold">
                        {t("shipping_method")}
                      </h2>
                    </div>
                  </div>
                  {cartLoading ? (
                    <div className="space-y-3">
                      <Skeleton className="h-16 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  ) : selectedAddress || watchedCityId ? (
                    <div className="content border border-primary rounded-md p-4 ">
                      <div className="item flex items-center justify-between">
                        <h3 className="text-md ">
                          {selectedCity?.days} {t("business_days")}
                        </h3>
                        <p className="text-md">
                          {shippingCost} {t("egp")}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground bg-primary-light dark:bg-muted/30 border border-transparent dark:border-border p-4 rounded-md text-center">
                      {t("enter_shipping_address")}
                    </p>
                  )}
                </div>

                {/* Payment Method */}
                <div className="payment-method">
                  <div className="head mb-5">
                    <div className="title">
                      <h2 className="text-xl font-bold">{t("payment")}</h2>
                    </div>
                  </div>
                  {paymentMethodsLoading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="border border-border rounded-md p-4"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <Skeleton className="h-5 w-5" />
                              <Skeleton className="h-5 w-32" />
                            </div>
                          </div>
                          <Skeleton className="h-4 w-full" />
                        </div>
                      ))}
                    </div>
                  ) : paymentMethodsError ? (
                    <p className="text-sm text-red-600 dark:text-red-300 bg-red-50 dark:bg-red-950/30 p-4 rounded-md text-center">
                      {t("failed_to_load_payment_methods")}
                    </p>
                  ) : paymentMethods.length === 0 ? (
                    <p className="text-sm text-muted-foreground bg-primary-light dark:bg-muted/30 border border-transparent dark:border-border p-4 rounded-md text-center">
                      {t("no_payment_methods_available")}
                    </p>
                  ) : (
                    <ul className="space-y-3">
                      {paymentMethods.map((method) => {
                        const methodIdStr = method.integration_id?.toString() || method.key;
                        const isSelected = selectedPayment === methodIdStr;
                        const isExpanded = expandedPayment === methodIdStr;
                        const methodName =
                          language === "ar" ? method.name_ar : method.name;
                        const methodDescription =
                          language === "ar"
                            ? method.description_ar
                            : method.description;

                        return (
                          <li key={methodIdStr}>
                            <div
                              className={`w-full border-border border cursor-pointer transition-all duration-300 select-none rounded-md ${
                                isSelected ? "bg-primary/10 border-primary" : ""
                              }`}
                            >
                              <div
                                className={`flex items-center justify-between gap-3 w-full p-4 ${
                                  isSelected ? "border-primary" : ""
                                }`}
                                onClick={() => handlePaymentSelect(methodIdStr)}
                              >
                                <div className="flex items-center gap-3">
                                  <input
                                    type="radio"
                                    id={`payment-${methodIdStr}`}
                                    name="payment-method"
                                    value={methodIdStr}
                                    checked={isSelected}
                                    onChange={() =>
                                      handlePaymentSelect(methodIdStr)
                                    }
                                    className="w-5 h-5 accent-primary"
                                  />
                                  <label
                                    htmlFor={`payment-${methodIdStr}`}
                                    className="text-md font-[500] cursor-pointer select-none"
                                  >
                                    {methodName}
                                  </label>
                                </div>
                                {method.icon && (
                                  method.icon.startsWith("http") ? (
                                    <Image
                                      src={method.icon}
                                      alt={method.name}
                                      width={560}
                                      height={320}
                                      className="h-8 w-auto object-contain rounded"
                                    />
                                  ) : (
                                    <Image
                                      src={`/payment/${method.icon}.png`}
                                      alt={method.name}
                                      width={100}
                                      height={100}
                                      className="h-8 w-auto object-contain"
                                    />
                                  )
                                )}
                              </div>
                              {methodDescription && (
                                <div
                                  className={`overflow-hidden transition-all duration-300 ${
                                    isExpanded
                                      ? "max-h-[300px] opacity-100 visible"
                                      : "max-h-0 opacity-0 invisible"
                                  }`}
                                >
                                  <div className="px-4 pb-4">
                                    <p className="text-sm text-muted-foreground">
                                      {methodDescription}
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 bg-foreground text-background hover:bg-foreground/90"
                  disabled={createOrderLoading}
                >
                  {createOrderLoading ? (
                    <LoadingSpinner
                      color="white"
                      size="sm"
                      text={t("paying")}
                    />
                  ) : (
                    t("pay_now")
                  )}
                </Button>
              </div>
            </form>

          </Form>
        </div>
      </div>
    </section>
  );
}

export default BillingDetails;
