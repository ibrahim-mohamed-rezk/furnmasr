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
import { ChevronLeft, ChevronRight, PlusSquare } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "@/hooks/useTranslation";
import { useMutate } from "@/hooks/useMutate";
import { useCountries } from "@/hooks/useCountries";
import { useCities } from "@/hooks/useCities";
import LoadingSpinner from "@/components/ui/loading-spinner";

const addressFormSchema = z.object({
  first_name: z.string().min(1, { message: "First name is required." }),
  last_name: z.string().min(1, { message: "Last name is required." }),
  country_id: z.string().min(1, { message: "Country is required." }),
  city_id: z.string().optional(),
  address: z.string().min(1, { message: "Address is required." }),
});

interface AddAddressProps {
  onSuccess: () => void;
}

export function AddAddress({ onSuccess }: AddAddressProps) {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  const { countries, isLoading: countriesLoading } = useCountries();
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const {
    cities,
    isLoading: citiesLoading,
    resetPage,
  } = useCities(selectedCountry);

  const createAddress = useMutate<any, any>({
    endpoint: "/addresses",
    method: "POST",
    successMessage: "Address added",
    errorMessage: "Failed to add address",
  });
  const form = useForm<z.infer<typeof addressFormSchema>>({
    resolver: zodResolver(addressFormSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      country_id: "",
      city_id: "",
      address: "",
    },
  });

  function onSubmit(values: z.infer<typeof addressFormSchema>) {
    const payload: any = {
      region_id: Number(values.country_id), // backend expects region/country id here per spec
      name: `${values.first_name} ${values.last_name}`.trim(),
      address: values.address,
    };
    if (values.city_id && Number(values.city_id) > 0) {
      payload.city_id = Number(values.city_id);
    }
    createAddress.mutate(payload, {
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
          form.reset();
          setSelectedCountry("");
          form.clearErrors();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="border-black text-foreground hover:bg-black hover:text-white"
        >
          <PlusSquare className="w-6 h-6" />
          {t("account.add_address")}
        </Button>
      </DialogTrigger>

      <DialogContent className="h-[80vh] max-w-xl md:max-w-4xl lg:max-w-5xl overflow-hidden overflow-y-auto md:overflow-y-hidden p-0">
        <div className="p-5 md:px-10 lg:px-40 relative w-full h-full flex flex-col justify-center items-center">
          <div className="absolute top-0 left-0 w-full h-full bg-primary/[0.04] z-[-1]"></div>
          <div className="head flex items-center justify-center mb-10">
            <div className="title">
              <h2 className="md:text-5xl text-3xl font-[900]">
                {t("account.add_new_address")}
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
                            resetPage();
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
                            {countriesLoading ? (
                              <SelectItem disabled value="no-countries">
                                <LoadingSpinner
                                  text={t("common.loadingCountries")}
                                  color="black"
                                  size="sm"
                                  className="text-foreground"
                                />
                              </SelectItem>
                            ) : (
                              countries?.map((c: any) => (
                                <SelectItem key={c.id} value={String(c.id)}>
                                  {c.name}
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
                              {citiesLoading ? (
                                <SelectItem disabled value="no-cities">
                                  <LoadingSpinner
                                    text={t("common.loadingCities")}
                                    color="black"
                                    size="sm"
                                    className="text-foreground"
                                  />
                                </SelectItem>
                              ) : cities && cities.length > 0 ? (
                                cities.map((city: any) => (
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
                    disabled={createAddress.isPending}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    {createAddress.isPending ? (
                      <LoadingSpinner
                        text={t("common.saving")}
                        color="white"
                        size="sm"
                        className="text-white"
                      />
                    ) : (
                      t("account.save_address")
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
