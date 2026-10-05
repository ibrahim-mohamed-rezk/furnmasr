import { useGetData } from "./useGetData";

export interface PaymentMethod {
  key: string;
  name: string;
  name_ar: string;
  icon: string;
  description: string;
  description_ar: string;
  integration_id?: string | number | null;
}

export interface PaymentMethodsResponse {
  payment_methods: PaymentMethod[];
}

export function usePaymentMethods() {
  const paymentMethodsQuery = useGetData<PaymentMethodsResponse>({
    endpoint: `/payment-methods`,
    queryKey: ["payment-methods"],
    showErrorToast: false,
    errorMessage: "Failed to load payment methods",
  });

  const paymentMethods = paymentMethodsQuery.data?.data?.payment_methods || [];
  const isLoading = paymentMethodsQuery.isLoading;
  const error = paymentMethodsQuery.error;

  return {
    paymentMethods,
    isLoading,
    error,
    refetch: paymentMethodsQuery.refetch,
  };
}
