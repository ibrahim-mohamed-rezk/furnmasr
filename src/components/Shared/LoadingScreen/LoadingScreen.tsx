"use client";

import React from "react";
import Image from "next/image";

interface LoadingScreenProps {
  isLoading: boolean;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ isLoading }) => {

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="flex flex-col items-center space-y-4">
        {/* Website Icon */}
        <div className="relative w-30 h-30">
          <Image
            src="/ar-logo.png"
            alt="Furnmasr Logo"
            width={100}
            height={100}
            className="object-contain w-full h-full"
          />
        </div>

        {/* Spinner */}
        <div className="relative flex items-center gap-2">
          <div className="w-8 h-8 border-2 border-border border-t-primary rounded-full animate-spin"></div>
          {/* <p className="text-lg font-[400] text-muted-foreground">{loadingText}</p> */}
        </div>

        {/* Loading Text */}
      </div>
    </div>
  );
};

export default LoadingScreen;
