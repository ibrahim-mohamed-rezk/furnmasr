import { useGetData } from "./useGetData";
import { useState } from "react";

export interface City {
  id: number;
  name: string;
  days: number | null;
  shipping_price: number | null;
}

export interface CitiesResponse {
  country?: {
    id: number;
    name: string;
    cities: City[];
    pagination?: {
      current_page: number;
      last_page: number;
    };
  };
  cities?: City[];
  pagination?: {
    current_page: number;
    last_page: number;
  };
}

export function useCities(selectedCountryId: string | number) {
  const [citiesPage, setCitiesPage] = useState(1);

  const citiesQuery = useGetData<CitiesResponse>({
    endpoint: `/countries/${selectedCountryId}?page=${citiesPage}`,
    queryKey: ["country", selectedCountryId, citiesPage],
    enabled: !!selectedCountryId,
    showErrorToast: false,
    errorMessage: "Failed to load cities",
  });

  // Extract cities from either the country object or direct cities array
  const cities =
    citiesQuery.data?.data?.country?.cities ||
    citiesQuery.data?.data?.cities ||
    [];

  const pagination =
    citiesQuery.data?.data?.country?.pagination ||
    citiesQuery.data?.data?.pagination;

  const isLoading = citiesQuery.isLoading;
  const error = citiesQuery.error;

  const nextPage = () => {
    if (pagination && citiesPage < pagination.last_page) {
      setCitiesPage((prev) => prev + 1);
    }
  };

  const prevPage = () => {
    if (citiesPage > 1) {
      setCitiesPage((prev) => prev - 1);
    }
  };

  const goToPage = (page: number) => {
    if (pagination && page >= 1 && page <= pagination.last_page) {
      setCitiesPage(page);
    }
  };

  // Reset page when country changes
  const resetPage = () => {
    setCitiesPage(1);
  };

  return {
    cities,
    pagination,
    isLoading,
    error,
    currentPage: citiesPage,
    nextPage,
    prevPage,
    goToPage,
    resetPage,
    refetch: citiesQuery.refetch,
  };
}
