"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDownIcon } from "lucide-react";

const Accordion = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("w-full", className)} {...props} />
));
Accordion.displayName = "Accordion";

const AccordionItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("border-b", className)} {...props} />
));
AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    isOpen?: boolean;
  }
>(({ className, children, isOpen, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "flex flex-1 w-full items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
      className
    )}
    {...props}
  >
    {children}
    <ChevronDownIcon
      className={cn(
        "h-6 w-6 shrink-0 transition-transform duration-200",
        isOpen && "rotate-180"
      )}
    />
  </button>
));
AccordionTrigger.displayName = "AccordionTrigger";

const AccordionContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    isOpen?: boolean;
  }
>(({ className, children, isOpen, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "overflow-hidden transition-all duration-200",
      isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
    )}
    {...props}
  >
    <div className="pb-4 pt-0">{children}</div>
  </div>
));
AccordionContent.displayName = "AccordionContent";

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
