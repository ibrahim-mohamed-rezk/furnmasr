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
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight, PenSquare } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "@/hooks/useTranslation";
import { useGetData } from "@/hooks/useGetData";
import { useMutate } from "@/hooks/useMutate";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { CustomPagination } from "@/components/Shared/Pagination";

const addressFormSchema = z.object({
  first_name: z.string().min(1, { message: "First name is required." }),
  last_name: z.string().min(1, { message: "Last name is required." }),
  country_id: z.string().min(1, { message: "Country is required." }),
  city_id: z.string().optional(),
  address: z.string().min(1, { message: "Address is required." }),
});

interface Address {
  id: number;
  firstName: string;
  lastName: string;
  city: string;
  country: string;
  address: string;
  cityId?: number;
  countryId?: number;
}

interface EditAddressProps {
  address: Address;
  onSuccess: () => void;
}

export function EditAddress({ address, onSuccess }: EditAddressProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string>(
    address.countryId ? String(address.countryId) : ""
  );

  const [countriesPage, setCountriesPage] = useState<number>(1);
  const [citiesPage, setCitiesPage] = useState<number>(1);
  const countriesQuery = useGetData<{
    countries: any[];
    pagination?: { current_page: number; last_page: number };
  }>({
    endpoint: `/countries?page=${countriesPage}`,
    queryKey: ["countries", countriesPage],
    showErrorToast: true,
    errorMessage: "Failed to load countries",
  });
  const citiesQuery = useGetData<{
    country?: {
      id: number;
      name: string;
      cities: { id: number; name: string }[];
      pagination?: { current_page: number; last_page: number };
    };
    cities?: { id: number; name: string }[];
    pagination?: { current_page: number; last_page: number };
  }>({
    endpoint: `/countries/${selectedCountry}?page=${citiesPage}`,
    queryKey: ["country", selectedCountry, citiesPage],
    enabled: !!selectedCountry,
    showErrorToast: false,
    errorMessage: "Failed to load cities",
  });

  const updateAddress = useMutate<any, any>({
    endpoint: (v) => `/addresses/${address.id}`,
    method: "POST",
    successMessage: "Address updated",
    errorMessage: "Failed to update address",
  });

  const form = useForm<z.infer<typeof addressFormSchema>>({
    resolver: zodResolver(addressFormSchema),
    defaultValues: {
      first_name: address.firstName,
      last_name: address.lastName,
      country_id: address.countryId ? String(address.countryId) : "",
      city_id: address.cityId ? String(address.cityId) : "",
      address: address.address,
    },
  });

  function onSubmit(values: z.infer<typeof addressFormSchema>) {
    const payload: any = {
      country_id: Number(values.country_id),
      name: `${values.first_name} ${values.last_name}`.trim(),
      address: values.address,
    };
    if (values.city_id && Number(values.city_id) > 0) {
      payload.city_id = Number(values.city_id);
    }
    updateAddress.mutate(payload, {
      onSuccess: () => {
        setOpen(false);
        form.reset();
        onSuccess();
      },
    });
  }

  function handleSaveAddress(e: React.FormEvent) {
    e.preventDefault();
    e.stopPropagation();
    form.handleSubmit(onSubmit)(e);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) {
          form.reset({
            first_name: address.firstName,
            last_name: address.lastName,
            country_id: address.countryId ? String(address.countryId) : "",
            city_id: address.cityId ? String(address.cityId) : "",
            address: address.address,
          });
          setSelectedCountry(address.countryId ? String(address.countryId) : "");
          form.clearErrors();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button className="bg-black text-white">
          <PenSquare className="w-6 h-6" />
          {t("account.edit_address")}
        </Button>
      </DialogTrigger>

      <DialogContent className="h-[80vh] max-w-xl md:max-w-4xl lg:max-w-5xl overflow-hidden overflow-y-auto md:overflow-y-hidden p-0">
        <div className="p-5 md:px-10 lg:px-40 relative w-full h-full flex flex-col justify-center items-center">
          <div className="absolute top-0 left-0 w-full h-full bg-primary/[0.04] z-[-1]"></div>
          <div className="head flex items-center justify-center mb-10">
            <div className="title">
              <h2 className="md:text-5xl text-3xl font-[900]">
                {t("account.edit_address")}
              </h2>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={handleSaveAddress} className="space-y-8 w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="name-fields">
                  <FormField
                    control={form.control}
                    name="first_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder={t("account.enter_your_first_name")}
                            className="w-full bg-[#EDE7E0] rounded-none h-12 border-none focus:outline-none focus:ring-0 focus:border-none focus:ring-offset-0 focus-visible:ring-0"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="name-fields">
                  <FormField
                    control={form.control}
                    name="last_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder={t("account.enter_your_last_name")}
                            className="w-full bg-[#EDE7E0] rounded-none h-12 border-none focus:outline-none focus:ring-0 focus:border-none focus:ring-offset-0 focus-visible:ring-0"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="space-y-8">
                <FormField
                  control={form.control}
                  name="country_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select
                          onValueChange={(val) => {
                            field.onChange(val);
                            setSelectedCountry(val);
                            setCitiesPage(1);
                            form.setValue("city_id", "", {
                              shouldDirty: true,
                              shouldTouch: false,
                              shouldValidate: false,
                            });
                            form.clearErrors("city_id");
                          }}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full bg-[#EDE7E0] rounded-none h-12 border-none focus:outline-none focus:ring-0 focus:border-none focus:ring-offset-0 focus-visible:ring-0">
                              <SelectValue
                                placeholder={t("account.select_a_region")}
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {countriesQuery?.isPending ? (
                              <SelectItem disabled value="no-countries">
                                <LoadingSpinner
                                  text={t("common.loadingCountries")}
                                  color="black"
                                  size="sm"
                                  className="text-foreground"
                                />
                              </SelectItem>
                            ) : (
                              (countriesQuery.data?.data?.countries || []).map(
                                (c: any) => (
                                  <SelectItem key={c.id} value={String(c.id)}>
                                    {c.name}
                                  </SelectItem>
                                )
                              )
                            )}
                            {countriesQuery.data?.data?.pagination && (
                              <div className="flex items-center justify-between px-2 py-2 border-t border-border gap-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  className="h-8 px-3 rounded-none"
                                  disabled={
                                    (countriesQuery.data.data.pagination
                                      .current_page || 1) <= 1
                                  }
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setCountriesPage((p) => Math.max(1, p - 1));
                                  }}
                                >
                                  <ChevronLeft className="w-4 h-4" />
                                </Button>
                                <span className="text-xs">
                                  {
                                    countriesQuery.data.data.pagination
                                      .current_page
                                  }{" "}
                                  /{" "}
                                  {
                                    countriesQuery.data.data.pagination
                                      .last_page
                                  }
                                </span>
                                <Button
                                  type="button"
                                  variant="outline"
                                  className="h-8 px-3 rounded-none"
                                  disabled={
                                    (countriesQuery.data.data.pagination
                                      .current_page || 1) >=
                                    (countriesQuery.data.data.pagination
                                      .last_page || 1)
                                  }
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setCountriesPage((p) => p + 1);
                                  }}
                                >
                                  <ChevronRight className="w-4 h-4" />
                                </Button>
                              </div>
                            )}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {selectedCountry && (
                  <FormField
                    control={form.control}
                    name="city_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full bg-[#EDE7E0] rounded-none h-12 border-none focus:outline-none focus:ring-0 focus:border-none focus:ring-offset-0 focus-visible:ring-0">
                                <SelectValue
                                  placeholder={t("account.select_a_city")}
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {citiesQuery.isPending ? (
                                <SelectItem disabled value="no-cities">
                                  <LoadingSpinner
                                    text={t("common.loadingCities")}
                                    color="black"
                                    size="sm"
                                    className="text-foreground"
                                  />
                                </SelectItem>
                              ) : Array.isArray(
                                  citiesQuery.data?.data?.country?.cities ||
                                    citiesQuery.data?.data?.cities
                                ) &&
                                (
                                  citiesQuery.data?.data?.country?.cities ||
                                  citiesQuery.data?.data?.cities
                                )?.length! > 0 ? (
                                (
                                  citiesQuery.data?.data?.country?.cities ||
                                  citiesQuery.data?.data?.cities ||
                                  []
                                ).map((city: any) => (
                                  <SelectItem
                                    key={city.id}
                                    value={String(city.id)}
                                  >
                                    {city.name}
                                  </SelectItem>
                                ))
                              ) : (
                                <SelectItem disabled value="no-cities">
                                  {t("account.no_cities") || "No cities"}
                                </SelectItem>
                              )}
                              {((citiesQuery.data?.data?.country as any)
                                ?.pagination ||
                                citiesQuery.data?.data?.pagination) && (
                                <div className="flex items-center justify-between px-2 py-2 border-t border-border gap-2">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    className="h-8 px-3 rounded-none"
                                    disabled={
                                      ((citiesQuery.data?.data?.country as any)
                                        ?.pagination?.current_page ||
                                        citiesPage) <= 1
                                    }
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      setCitiesPage((p) => Math.max(1, p - 1));
                                    }}
                                  >
                                    <ChevronLeft className="w-4 h-4" />
                                  </Button>
                                  <span className="text-xs">
                                    {(citiesQuery.data?.data?.country as any)
                                      ?.pagination?.current_page ||
                                      citiesPage}{" "}
                                    /{" "}
                                    {(citiesQuery.data?.data?.country as any)
                                      ?.pagination?.last_page ||
                                      (citiesQuery.data?.data as any)
                                        ?.pagination?.last_page ||
                                      1}
                                  </span>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    className="h-8 px-3 rounded-none"
                                    disabled={
                                      ((citiesQuery.data?.data?.country as any)
                                        ?.pagination?.current_page ||
                                        citiesPage) >=
                                      ((citiesQuery.data?.data?.country as any)
                                        ?.pagination?.last_page ||
                                        (citiesQuery.data?.data as any)
                                          ?.pagination?.last_page ||
                                        1)
                                    }
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      setCitiesPage((p) => p + 1);
                                    }}
                                  >
                                    <ChevronRight className="w-4 h-4" />
                                  </Button>
                                </div>
                              )}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <div className="address-fields">
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder={t("account.enter_your_address")}
                            className="w-full bg-[#EDE7E0] rounded-none h-12 border-none focus:outline-none focus:ring-0 focus:border-none focus:ring-offset-0 focus-visible:ring-0"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="submit-btn flex justify-center gap-5">
                  <Button
                    type="submit"
                    className="bg-black text-white py-3 px-6 rounded-none hover:bg-primary transition-colors h-11"
                    disabled={updateAddress.isPending}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    {updateAddress.isPending ? (
                      <LoadingSpinner
                        text={t("common.updating")}
                        color="white"
                        size="sm"
                        className="text-white"
                      />
                    ) : (
                      t("account.update_address")
                    )}
                  </Button>
                  <div className="close">
                    <DialogClose>
                      <Button
                        type="button"
                        variant="outline"
                        className="h-11 hover:bg-accent rounded-none hover:text-foreground py-3 px-6 border-black"
                      >
                        {t("common.cancel")}
                      </Button>
                    </DialogClose>
                  </div>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
