# API Hooks Documentation

This document describes the custom hooks for API data fetching and mutations with integrated toast notifications.

## Overview

The system provides two main hooks:
- `useGetData` - For GET requests with caching
- `useMutate` - For POST, PUT, DELETE requests

Both hooks include automatic toast notifications for success and error states.

## useGetData Hook

### Basic Usage

```typescript
import { useGetData } from "@/hooks/useGetData";

function MyComponent() {
  const { data, isLoading, error, refetch } = useGetData<MyDataType>({
    endpoint: "/my-endpoint",
    queryKey: ["myData"],
    successMessage: "Data loaded successfully!",
    errorMessage: "Failed to load data",
    showSuccessToast: false, // Default: false
    showErrorToast: true,    // Default: true
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>{data?.data.name}</div>;
}
```

### Options

- `endpoint` (string): API endpoint path
- `successMessage` (string, optional): Success toast message
- `errorMessage` (string, optional): Error toast message
- `showSuccessToast` (boolean): Show success toast (default: false)
- `showErrorToast` (boolean): Show error toast (default: true)
- All standard React Query options (queryKey, staleTime, etc.)

## useMutate Hook

### Basic Usage

```typescript
import { useMutate } from "@/hooks/useMutate";

function MyComponent() {
  const mutation = useMutate<ResponseType, RequestType>({
    endpoint: "/my-endpoint",
    method: "POST", // "POST" | "PUT" | "DELETE"
    successMessage: "Operation successful!",
    errorMessage: "Operation failed",
    showSuccessToast: true,  // Default: true
    showErrorToast: true,    // Default: true
    onSuccess: (data) => {
      console.log("Success:", data);
    },
    onError: (error) => {
      console.log("Error:", error);
    },
  });

  const handleSubmit = () => {
    mutation.mutate({ name: "John", email: "john@example.com" });
  };

  return (
    <button 
      onClick={handleSubmit}
      disabled={mutation.isPending}
    >
      {mutation.isPending ? "Submitting..." : "Submit"}
    </button>
  );
}
```

### Options

- `endpoint` (string): API endpoint path
- `method` (string): HTTP method ("POST" | "PUT" | "DELETE")
- `successMessage` (string, optional): Success toast message
- `errorMessage` (string, optional): Error toast message
- `showSuccessToast` (boolean): Show success toast (default: true)
- `showErrorToast` (boolean): Show error toast (default: true)
- All standard React Query mutation options (onSuccess, onError, etc.)

## API Service

The API service includes:

### Headers
- `Content-Type: application/json`
- `Accept: application/json`
- `X-Requested-With: XMLHttpRequest`

### Methods
- `api.get<T>(endpoint, options?)`
- `api.post<T>(endpoint, data?, options?)`
- `api.put<T>(endpoint, data?, options?)`
- `api.delete<T>(endpoint, options?)`

### Error Handling
- Automatic error parsing
- Toast notifications
- Proper error types

## Toast Notifications

The system uses Sonner for toast notifications with:
- Rich colors
- Close button
- 4-second duration
- Top-right position

## Examples

### Fetching Home Data
```typescript
const { data, isLoading, error } = useGetData<HomeData>({
  endpoint: "/home",
  queryKey: ["homeData"],
  staleTime: 5 * 60 * 1000,
  errorMessage: "Failed to load home data",
});
```

### Creating a User
```typescript
const createUser = useMutate<User, CreateUserData>({
  endpoint: "/users",
  method: "POST",
  successMessage: "User created successfully!",
  errorMessage: "Failed to create user",
  onSuccess: (data) => {
    // Handle success
  },
});

createUser.mutate({ name: "John", email: "john@example.com" });
```

### Updating a Product
```typescript
const updateProduct = useMutate<Product, UpdateProductData>({
  endpoint: "/products",
  method: "PUT",
  successMessage: "Product updated successfully!",
  errorMessage: "Failed to update product",
});

updateProduct.mutate({ id: 1, name: "Updated Product" });
```

### Deleting an Item
```typescript
const deleteItem = useMutate<void, { id: number }>({
  endpoint: "/items",
  method: "DELETE",
  successMessage: "Item deleted successfully!",
  errorMessage: "Failed to delete item",
});

deleteItem.mutate({ id: 1 });
```

## Error Handling

The system provides comprehensive error handling:
- Network errors
- HTTP status errors
- API response errors
- Automatic toast notifications
- Error state management

## TypeScript Support

Full TypeScript support with:
- Generic types for request/response data
- Proper error types
- IntelliSense support
- Type safety for all operations 