"use client";

import Image from "next/image";
import { useState } from "react";
import { PaymentMethod } from "@/hooks/usePaymentMethods";

const ICON_ALIASES: Record<string, string> = {
  cash: "card",
};

function resolveIconSrc(icon?: string): string | null {
  if (!icon) return null;
  if (icon.startsWith("http://") || icon.startsWith("https://")) return icon;
  const fileName = ICON_ALIASES[icon.toLowerCase()] || icon;
  return `/payment/${fileName}.svg`;
}

function PaymentLogoItem({ method }: { method: PaymentMethod }) {
  const [hasError, setHasError] = useState(false);
  const src = resolveIconSrc(method.icon);

  return (
    <li
      className="flex h-11 items-center justify-center rounded-md border border-border/60 bg-white px-2 py-1.5 shadow-sm transition-shadow hover:shadow-md"
      title={method.name}
    >
      {src && !hasError ? (
        <Image
          src={src}
          alt={method.name}
          width={120}
          height={48}
          className="h-7 w-auto max-w-[72px] object-contain"
          onError={() => setHasError(true)}
        />
      ) : (
        <span className="text-[10px] font-semibold text-muted-foreground text-center leading-tight line-clamp-2">
          {method.name}
        </span>
      )}
    </li>
  );
}

interface PaymentMethodLogosProps {
  methods: PaymentMethod[];
}

export default function PaymentMethodLogos({ methods }: PaymentMethodLogosProps) {
  if (!methods.length) return null;

  return (
    <ul className="mt-3 grid grid-cols-4 sm:grid-cols-5 gap-2 w-full">
      {methods.map((method, index) => (
        <PaymentLogoItem
          key={`${method.key}-${method.integration_id ?? index}`}
          method={method}
        />
      ))}
    </ul>
  );
}
