"use client";

import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "@/hooks/useTranslation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQItem } from "@/lib/api";

function getLocalizedFaq(faq: FAQItem, language: "en" | "ar") {
  const question =
    language === "ar" ? faq.question_ar || faq.question : faq.question_en || faq.question;
  const answer =
    language === "ar" ? faq.answer_ar || faq.answer : faq.answer_en || faq.answer;
  return { question, answer };
}

interface FAQsSectionProps {
  faqs?: FAQItem[];
}

export default function FAQsSection({ faqs = [] }: FAQsSectionProps) {
  const { language } = useLanguage();
  const { t } = useTranslation("shop");
  const [openId, setOpenId] = useState<number | null>(null);

  const sortedFaqs = [...faqs].sort((a, b) => a.sort_order - b.sort_order);

  if (sortedFaqs.length === 0) {
    return null;
  }

  return (
    <section className="py-10 md:py-16 border-t border-border">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl text-center font-bold text-foreground mb-6 md:mb-8">
          {t("faqs") || "Frequently Asked Questions"}
        </h2>
        <Accordion className="w-full">
          {sortedFaqs.map((faq) => {
            const { question, answer } = getLocalizedFaq(
              faq,
              language as "en" | "ar"
            );
            const isOpen = openId === faq.id;
            return (
              <AccordionItem key={faq.id} className="border-b border-border">
                <AccordionTrigger
                  isOpen={isOpen}
                  onClick={() => setOpenId(isOpen ? null : faq.id)}
                  className="text-left text-base md:text-lg font-medium text-foreground py-5"
                >
                  {question}
                </AccordionTrigger>
                <AccordionContent
                  isOpen={isOpen}
                  className="text-muted-foreground text-sm md:text-base leading-relaxed"
                >
                  {answer}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    </section>
  );
}
