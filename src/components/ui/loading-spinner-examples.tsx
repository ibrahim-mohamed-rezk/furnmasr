import React from "react";
import LoadingSpinner from "./loading-spinner";
import { Button } from "./button";

// Examples of how to use the LoadingSpinner component
export const LoadingSpinnerExamples: React.FC = () => {
  return (
    <div className="p-8 space-y-8">
      <h2 className="text-2xl font-bold mb-6">LoadingSpinner Examples</h2>

      {/* Basic Usage */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Basic Usage</h3>
        <div className="flex gap-4 items-center">
          <LoadingSpinner text="Loading..." />
          <LoadingSpinner text="Processing..." color="secondary" />
          <LoadingSpinner text="Saving..." color="gray" />
        </div>
      </div>

      {/* Different Sizes */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Different Sizes</h3>
        <div className="flex gap-4 items-center">
          <LoadingSpinner text="Small" size="sm" />
          <LoadingSpinner text="Medium" size="md" />
          <LoadingSpinner text="Large" size="lg" />
          <LoadingSpinner text="Extra Large" size="xl" />
        </div>
      </div>

      {/* Different Colors */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Different Colors</h3>
        <div className="flex gap-4 items-center">
          <LoadingSpinner text="Primary" color="primary" />
          <LoadingSpinner text="Secondary" color="secondary" />
          <LoadingSpinner
            text="White"
            color="white"
            className="bg-gray-800 p-2 rounded"
          />
          <LoadingSpinner text="Black" color="black" />
          <LoadingSpinner text="Gray" color="gray" />
        </div>
      </div>

      {/* In Buttons */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">In Buttons</h3>
        <div className="flex gap-4 items-center">
          <Button disabled>
            <LoadingSpinner text="Loading..." color="white" size="sm" />
          </Button>
          <Button variant="outline" disabled>
            <LoadingSpinner text="Processing..." color="black" size="sm" />
          </Button>
        </div>
      </div>

      {/* Custom Styling */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Custom Styling</h3>
        <div className="flex gap-4 items-center">
          <LoadingSpinner
            text="Custom Style"
            color="primary"
            className="bg-blue-50 p-3 rounded-lg border"
            textClassName="font-bold"
            spinnerClassName="text-blue-700"
          />
          <LoadingSpinner text="" color="secondary" />
        </div>
      </div>

      {/* Different Text Examples */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Common Use Cases</h3>
        <div className="flex gap-4 items-center flex-wrap">
          <LoadingSpinner text="Logging in..." color="primary" />
          <LoadingSpinner text="Creating account..." color="primary" />
          <LoadingSpinner text="Saving changes..." color="secondary" />
          <LoadingSpinner text="Uploading file..." color="secondary" />
          <LoadingSpinner text="Processing payment..." color="primary" />
          <LoadingSpinner text="Sending message..." color="gray" />
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinnerExamples;
