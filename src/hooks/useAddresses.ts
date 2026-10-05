import { useGetData } from "./useGetData";
import { useState } from "react";

export interface Address {
  id: number;
  name: string;
  address: string;
  city?: { id: number; name: string };
  region?: { id: number; name: string };
  city_id?: number;
  region_id?: number;
}

export interface AddressesResponse {
  addresses: Address[];
  pagination?: {
    current_page: number;
    last_page: number;
  };
}

export function useAddresses({ enabled }: { enabled: boolean }) {
  const [addressesPage, setAddressesPage] = useState(1);

  const addressesQuery = useGetData<AddressesResponse>({
    endpoint: `/addresses?page=${addressesPage}`,
    queryKey: ["addresses", addressesPage],
    showErrorToast: true,
    errorMessage: "Failed to load addresses",
    enabled,
  });

  const addresses = addressesQuery.data?.data?.addresses || [];
  const pagination = addressesQuery.data?.data?.pagination;
  const isLoading = addressesQuery.isLoading;
  const error = addressesQuery.error;

  const nextPage = () => {
    if (pagination && addressesPage < pagination.last_page) {
      setAddressesPage((prev) => prev + 1);
    }
  };

  const prevPage = () => {
    if (addressesPage > 1) {
      setAddressesPage((prev) => prev - 1);
    }
  };

  const goToPage = (page: number) => {
    if (pagination && page >= 1 && page <= pagination.last_page) {
      setAddressesPage(page);
    }
  };

  return {
    addresses,
    pagination,
    isLoading,
    error,
    currentPage: addressesPage,
    nextPage,
    prevPage,
    goToPage,
    refetch: addressesQuery.refetch,
  };
}
