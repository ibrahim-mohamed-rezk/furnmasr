import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  text?: string;
  color?: "primary" | "secondary" | "white" | "black" | "gray" | "red";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  textClassName?: string;
  spinnerClassName?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  text = null,
  color = "primary",
  size = "md",
  className,
  textClassName,
  spinnerClassName,
}) => {
  // Color variants
  const colorVariants = {
    primary: "text-primary",
    secondary: "text-muted-foreground",
    white: "text-white",
    black: "text-foreground",
    gray: "text-muted-foreground",
    red: "text-red-600",
  };

  // Size variants
  const sizeVariants = {
    sm: {
      spinner: "w-4 h-4",
      text: "text-sm",
    },
    md: {
      spinner: "w-5 h-5",
      text: "text-base",
    },
    lg: {
      spinner: "w-6 h-6",
      text: "text-lg",
    },
    xl: {
      spinner: "w-8 h-8",
      text: "text-xl",
    },
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Loader2
        className={cn(
          "animate-spin",
          colorVariants[color],
          sizeVariants[size].spinner,
          spinnerClassName
        )}
      />
      {text && (
        <span
          className={cn(
            "font-medium",
            colorVariants[color],
            sizeVariants[size].text,
            textClassName
          )}
        >
          {text}
        </span>
      )}
    </div>
  );
};

export default LoadingSpinner;
