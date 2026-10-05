import { Button } from "@/components/ui/button";
import { ArrowBigRight } from "lucide-react";
import React from "react";
import { CgArrowRight } from "react-icons/cg";
import { useLanguage } from "@/contexts/LanguageContext";

function NextButton({ className }: { className?: string }) {
  const { direction } = useLanguage();

  return (
    <Button
      size="sm"
      className={`group bg-transparent cursor-pointer testimonial-next-button transition-all duration-300 z-10 border border-black md:border-2 rounded-sm p-1 md:p-1.5 hover:bg-black ${className}`}
      style={{
        transform: direction === "rtl" ? "rotate(180deg)" : "none",
      }}
    >
      <CgArrowRight className="w-5 h-5 text-foreground group-hover:text-white" />
    </Button>
  );
}

export default NextButton;
