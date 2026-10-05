"use client";

import { useMutate } from "@/hooks/useMutate";
import { Button } from "@/components/ui/button";

interface ExampleData {
  id: number;
  name: string;
}

export default function ExampleMutation() {
  // Example POST mutation
  const createMutation = useMutate<ExampleData, { name: string }>({
    endpoint: "/example",
    method: "POST",
    successMessage: "Data created successfully!",
    errorMessage: "Failed to create data",
    onSuccess: (data) => {
      console.log("Created:", data);
    },
  });

  // Example PUT mutation
  const updateMutation = useMutate<ExampleData, { id: number; name: string }>({
    endpoint: "/example",
    method: "PUT",
    successMessage: "Data updated successfully!",
    errorMessage: "Failed to update data",
    onSuccess: (data) => {
      console.log("Updated:", data);
    },
  });

  // Example DELETE mutation
  const deleteMutation = useMutate<void, { id: number }>({
    endpoint: "/example",
    method: "DELETE",
    successMessage: "Data deleted successfully!",
    errorMessage: "Failed to delete data",
    onSuccess: () => {
      console.log("Deleted successfully");
    },
  });

  const handleCreate = () => {
    createMutation.mutate({ name: "Example Name" });
  };

  const handleUpdate = () => {
    updateMutation.mutate({ id: 1, name: "Updated Name" });
  };

  const handleDelete = () => {
    deleteMutation.mutate({ id: 1 });
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Mutation Examples</h2>
      
      <div className="space-y-2">
        <Button 
          onClick={handleCreate}
          disabled={createMutation.isPending}
          className="mr-2"
        >
          {createMutation.isPending ? "Creating..." : "Create Data"}
        </Button>

        <Button 
          onClick={handleUpdate}
          disabled={updateMutation.isPending}
          className="mr-2"
        >
          {updateMutation.isPending ? "Updating..." : "Update Data"}
        </Button>

        <Button 
          onClick={handleDelete}
          disabled={deleteMutation.isPending}
          variant="destructive"
        >
          {deleteMutation.isPending ? "Deleting..." : "Delete Data"}
        </Button>
      </div>

      {/* Show loading states */}
      {(createMutation.isPending || updateMutation.isPending || deleteMutation.isPending) && (
        <p className="text-blue-600">Processing...</p>
      )}

      {/* Show error states */}
      {(createMutation.error || updateMutation.error || deleteMutation.error) && (
        <p className="text-red-600">
          Error: {(createMutation.error || updateMutation.error || deleteMutation.error)?.message}
        </p>
      )}
    </div>
  );
} 