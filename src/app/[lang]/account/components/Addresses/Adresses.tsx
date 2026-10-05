import { Button } from "@/components/ui/button";
import { PlusSquare } from "lucide-react";
import React from "react";
import { EditAddress } from "./EditAddress";
import { DeleteConfirmation } from "./DeleteConfirmation";
import { AddAddress } from "./AddAddress";
import { useTranslation } from "@/hooks/useTranslation";
import { useAddresses } from "@/hooks/useAddresses";
import { Skeleton } from "@/components/ui/skeleton";
import { isAuthenticated } from "@/hooks/useAuth";

interface ApiAddressItem {
  id: number;
  name: string; // full name
  address: string;
  city?: { id: number; name: string } | string;
  country?: { id: number; name: string } | string; // may actually be country
  city_id?: number;
  country_id?: number;
}

interface ViewAddressItem {
  id: number;
  firstName: string;
  lastName: string;
  city: string;
  country: string;
  address: string;
  cityId?: number;
  countryId?: number;
}

function Adresses() {
  const { t } = useTranslation();

  const { addresses: rawList, isLoading, refetch } = useAddresses({
    enabled: isAuthenticated(),
  });

  const splitName = (
    fullName: string
  ): { firstName: string; lastName: string } => {
    if (!fullName) return { firstName: "", lastName: "" };
    const parts = fullName.trim().split(" ");
    if (parts.length === 1) return { firstName: parts[0], lastName: "" };
    return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
  };

  const addresses: ViewAddressItem[] = rawList.map((item) => {
    const { firstName, lastName } = splitName(item.name || "");
    const cityName = (item as any).city?.name || "";
    return {
      id: item.id,
      firstName,
      lastName,
      city: cityName,
      country: (item as any).country?.name || "",
      address: item.address || "",
      cityId: (item as any).city?.id,
      countryId: (item as any).country?.id,
    };
  });

  return (
    <section className="space-y-10">
      {isLoading &&
        Array.from({ length: 1 }).map((_, idx) => (
          <ul
            key={`skeleton-${idx}`}
            className="space-y-10 border-b border-border pb-10 last:border-b-0"
          >
            {["first", "last", "city", "country", "address"].map((key) => (
              <li key={key} className="flex justify-between items-center">
                <div className="key">
                  <Skeleton className="h-5 w-24" />
                </div>
                <div className="value">
                  <Skeleton className="h-5 w-40" />
                </div>
              </li>
            ))}
            <li className="actions flex justify-center items-center flex-wrap gap-4">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-40" />
            </li>
          </ul>
        ))}
      {!isLoading && (addresses?.length || 0) === 0 && (
        <div className="flex justify-center items-center h-[200px] bg-muted rounded-lg">
          <AddAddress onSuccess={refetch} />
        </div>
      )}
      {(addresses || []).map((address, index) => (
        <ul
          key={address.id}
          className="space-y-10 border-b border-border pb-10 last:border-b-0"
        >
          <li className="flex justify-between items-center">
            <div className="key">
              <p className="text-md font-[600] capitalize">
                {t("account.first_name")}
              </p>
            </div>
            <div className="value">
              <p className="text-md font-[500] capitalize text-foreground">
                {address.firstName}
              </p>
            </div>
          </li>
          <li className="flex justify-between items-center">
            <div className="key">
              <p className="text-md font-[600] capitalize">
                {t("account.last_name")}
              </p>
            </div>
            <div className="value">
              <p className="text-md font-[500] capitalize text-foreground">
                {address.lastName}
              </p>
            </div>
          </li>
          <li className="flex justify-between items-center">
            <div className="key">
              <p className="text-md font-[600] capitalize">
                {t("account.city")}
              </p>
            </div>
            <div className="value">
              <p className="text-md font-[500] capitalize text-foreground">
                {address.city}
              </p>
            </div>
          </li>
          <li className="flex justify-between items-center">
            <div className="key">
              <p className="text-md font-[600] capitalize">
                {t("account.country")}
              </p>
            </div>
            <div className="value">
              <p className="text-md font-[500] capitalize text-foreground">
                {address.country}
              </p>
            </div>
          </li>
          <li className="flex justify-between items-center">
            <div className="key">
              <p className="text-md font-[600] capitalize">
                {t("account.address")}
              </p>
            </div>
            <div className="value">
              <p className="text-md font-[500] capitalize text-foreground">
                {address.address}
              </p>
            </div>
          </li>

          <li className="actions flex justify-center items-center flex-wrap gap-4">
            <div className="edit-address">
              <EditAddress address={address} onSuccess={refetch} />
            </div>
            <div className="delete-address">
              <DeleteConfirmation
                addressId={address.id}
                addressName={`${address.firstName} ${address.lastName} - ${address.city}, ${address.country}`}
                onSuccess={refetch}
              />
            </div>
            {index === addresses.length - 1 && (
              <div className="add-address">
                <AddAddress onSuccess={refetch} />
              </div>
            )}
          </li>
        </ul>
      ))}
    </section>
  );
}

export default Adresses;
