import { useGetData } from "./useGetData";
import { useState } from "react";

export interface Country {
  id: number;
  name: string;
  cities?: { id: number; name: string }[];
}

export interface CountriesResponse {
  countries: Country[];
  pagination?: {
    current_page: number;
    last_page: number;
  };
}

export function useCountries() {
  const [countriesPage, setCountriesPage] = useState(1);

  const countriesQuery = useGetData<CountriesResponse>({
    endpoint: `/countries?page=${countriesPage}`,
    queryKey: ["countries", countriesPage],
    showErrorToast: true,
    errorMessage: "Failed to load countries",
  });

  const countries = countriesQuery.data?.data?.countries || [];
  const pagination = countriesQuery.data?.data?.pagination;
  const isLoading = countriesQuery.isLoading;
  const error = countriesQuery.error;

  const nextPage = () => {
    if (pagination && countriesPage < pagination.last_page) {
      setCountriesPage((prev) => prev + 1);
    }
  };

  const prevPage = () => {
    if (countriesPage > 1) {
      setCountriesPage((prev) => prev - 1);
    }
  };

  const goToPage = (page: number) => {
    if (pagination && page >= 1 && page <= pagination.last_page) {
      setCountriesPage(page);
    }
  };

  return {
    countries,
    pagination,
    isLoading,
    error,
    currentPage: countriesPage,
    nextPage,
    prevPage,
    goToPage,
    refetch: countriesQuery.refetch,
  };
}
