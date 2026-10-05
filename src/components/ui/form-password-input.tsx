import React, { useState } from "react";
import { Input } from "./input";
import { Button } from "./button";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { FormControl } from "./form";

interface FormPasswordInputProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  error?: boolean;
  id?: string;
  name?: string;
}

const FormPasswordInput = React.forwardRef<
  HTMLInputElement,
  FormPasswordInputProps
>(
  (
    {
      value,
      onChange,
      onBlur,
      placeholder = "Enter password",
      className,
      disabled = false,
      error = false,
      id,
      name,
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    return (
      <div className="relative">
        <Input
          ref={ref}
          id={id}
          name={name}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          className={cn(
            "pr-10", // Add padding for the eye icon
            error && "border-red-500 focus-visible:ring-red-500",
            className
          )}
          disabled={disabled}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={cn(
            "absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          onClick={togglePasswordVisibility}
          disabled={disabled}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4 text-muted-foreground" />
          ) : (
            <Eye className="h-4 w-4 text-muted-foreground" />
          )}
        </Button>
      </div>
    );
  }
);

FormPasswordInput.displayName = "FormPasswordInput";

export default FormPasswordInput;
