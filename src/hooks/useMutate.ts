import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { toast } from "sonner";
import { api, ApiResponse, ApiError } from "@/lib/api";
import { useLanguage } from "@/contexts/LanguageContext";

type HttpMethod = 'POST' | 'PUT' | 'DELETE' | 'GET';

interface UseMutateOptions<TData, TVariables> extends Omit<UseMutationOptions<ApiResponse<TData>, ApiError, TVariables>, 'mutationFn'> {
  endpoint: string | ((variables: TVariables) => string);
  method?: HttpMethod;
  successMessage?: string;
  errorMessage?: string;
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
  headers?: Record<string, string>;
}

export const useMutate = <TData = any, TVariables = any>({
  endpoint,
  method = 'POST',
  successMessage,
  errorMessage,
  showSuccessToast = true,
  showErrorToast = true,
  headers,
  ...options
}: UseMutateOptions<TData, TVariables>) => {
  const { language } = useLanguage();

  return useMutation<ApiResponse<TData>, ApiError, TVariables>({         
    mutationFn: async (variables: TVariables) => {
      
      try {
        let response: ApiResponse<TData>;
        const finalEndpoint = typeof endpoint === 'function' ? endpoint(variables) : endpoint;

        switch (method) {
          case 'POST':
            response = await api.post<TData>(finalEndpoint, variables, headers, language);
            break;
          case 'PUT':
            response = await api.put<TData>(finalEndpoint, variables, headers, language);
            break;
          case 'DELETE':
            response = await api.delete<TData>(finalEndpoint, headers, language);
            break;
          case 'GET':
            response = await api.get<TData>(finalEndpoint, headers, language);
            break;
          default:
            throw new Error(`Unsupported HTTP method: ${method}`);
        }

        if (showSuccessToast && successMessage) {
          toast.success(successMessage);
        }

        return response;
      } catch (error) {
        const errorMsg = errorMessage || (error as Error).message || 'An error occurred';

        if (showErrorToast) {
          toast.error(errorMsg);
        }

        throw error;
      }
    },
    ...options,
  });
}; 