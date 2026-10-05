import React, { useState } from "react";
import PasswordInput from "./password-input";
import FormPasswordInput from "./form-password-input";
import { Button } from "./button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Example form schema
const exampleSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ExampleFormData = z.infer<typeof exampleSchema>;

// Examples of how to use the password input components
export const PasswordInputExamples: React.FC = () => {
  const [standalonePassword, setStandalonePassword] = useState("");

  const form = useForm<ExampleFormData>({
    resolver: zodResolver(exampleSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: ExampleFormData) => {
    console.log("Form submitted:", data);
  };

  return (
    <div className="p-8 space-y-8">
      <h2 className="text-2xl font-bold mb-6">Password Input Examples</h2>

      {/* Standalone Password Input */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Standalone Password Input</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Basic Password Input
            </label>
            <PasswordInput
              value={standalonePassword}
              onChange={setStandalonePassword}
              placeholder="Enter your password"
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Disabled Password Input
            </label>
            <PasswordInput
              value="disabled-password"
              onChange={() => {}}
              placeholder="Disabled password"
              className="w-full"
              disabled={true}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Error State Password Input
            </label>
            <PasswordInput
              value="error-password"
              onChange={() => {}}
              placeholder="Password with error"
              className="w-full"
              error={true}
            />
          </div>
        </div>
      </div>

      {/* Form Password Input */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">
          Form Password Input (with React Hook Form)
        </h3>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <FormPasswordInput
                      placeholder="Enter your password"
                      className="w-full"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <FormPasswordInput
                      placeholder="Confirm your password"
                      className="w-full"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Submit Form</Button>
          </form>
        </Form>
      </div>

      {/* Different Styles */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Different Styles</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Default Style
            </label>
            <PasswordInput
              value="default-password"
              onChange={() => {}}
              placeholder="Default style"
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Custom Style
            </label>
            <PasswordInput
              value="custom-password"
              onChange={() => {}}
              placeholder="Custom style"
              className="w-full bg-blue-50 border-blue-200 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Usage Instructions */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Usage Instructions</h3>
        <div className="bg-muted/50 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">Features:</h4>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Click the eye icon to toggle password visibility</li>
            <li>Eye icon shows when password is hidden</li>
            <li>Eye-off icon shows when password is visible</li>
            <li>Works with React Hook Form via FormPasswordInput</li>
            <li>Supports disabled and error states</li>
            <li>Fully accessible with proper ARIA labels</li>
            <li>Customizable styling via className prop</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PasswordInputExamples;
