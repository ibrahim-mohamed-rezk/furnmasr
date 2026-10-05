"use client";

import Link, { LinkProps } from "next/link";
import React, { forwardRef } from "react";
import { useLocalizedHref } from "@/hooks/useLocalizedHref";

type LocalizedLinkProps = Omit<LinkProps, "href"> & {
  href: LinkProps["href"];
  children?: React.ReactNode;
  className?: string;
} & Omit<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    keyof LinkProps | "href"
  >;

/**
 * Drop-in replacement for next/link that prefixes string hrefs with the active
 * locale (e.g. "/shop" -> "/ar/shop"). Object hrefs and external/anchor hrefs
 * pass through untouched. JSX call sites stay identical, so migrating a file is
 * a one-line import swap.
 */
export const LocalizedLink = forwardRef<HTMLAnchorElement, LocalizedLinkProps>(
  function LocalizedLink({ href, children, ...rest }, ref) {
    const localize = useLocalizedHref();
    const finalHref = typeof href === "string" ? localize(href) : href;

    return (
      <Link href={finalHref} ref={ref} {...rest}>
        {children}
      </Link>
    );
  }
);
