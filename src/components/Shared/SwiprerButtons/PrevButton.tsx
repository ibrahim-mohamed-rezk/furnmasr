import { Button } from "@/components/ui/button";
import React from "react";
import { CgArrowLeft } from "react-icons/cg";
import { useLanguage } from "@/contexts/LanguageContext";

function PrevButton({ className }: { className?: string }) {
  const { direction } = useLanguage();

  return (
    <Button
      size="sm"
      className={`group bg-transparent cursor-pointer testimonial-prev-button text-foreground transition-all duration-300 z-10 border border-black md:border-2 rounded-sm p-1 md:p-1.5 hover:bg-black ${className}`}
      style={{
        transform: direction === "rtl" ? "rotate(180deg)" : "none",
      }}
    >
      <CgArrowLeft className="w-5 h-5 text-foreground group-hover:text-white" />
    </Button>
  );
}

export default PrevButton;
