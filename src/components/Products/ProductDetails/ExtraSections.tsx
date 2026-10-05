"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { ProductExtraSection } from "@/lib/api";

interface ExtraSectionsProps {
  sections?: ProductExtraSection[];
}

export default function ExtraSections({ sections = [] }: ExtraSectionsProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!sections.length) return null;

  return (
    <ul className="extra-sections flex flex-col gap-2">
      {sections.map((section, index) => {
        const isOpen = openIndex === index;

        return (
          <li
            key={`${section.title}-${index}`}
            className="border border-primary rounded-md overflow-hidden bg-background"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="flex w-full items-center justify-between gap-3 px-5 py-2 text-primary text-md font-semibold min-h-0"
            >
              <span className="text-start leading-tight">{section.title}</span>
              <ChevronDown
                className={`h-4 w-4 shrink-0 text-primary transition-transform duration-300 ${
                  isOpen ? "rotate-180" : "rotate-0"
                }`}
                aria-hidden
              />
            </button>

            <div
              className={`grid transition-all duration-300 ease-in-out ${
                isOpen
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <div className="border-t border-primary/30 px-5 pb-2 pt-1.5">
                  <div
                    className="text-sm text-primary/90 leading-snug [&_ul]:list-disc [&_ul]:ps-4 [&_ol]:list-decimal [&_ol]:ps-4 [&_p]:mb-1 [&_p]:last:mb-0"
                    dangerouslySetInnerHTML={{ __html: section.description }}
                  />
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
