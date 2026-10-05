"use client";
import React from "react";
import { Circle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export interface StepItem {
  title: string;
  dateText?: string;
  active: boolean;
}

interface StepsProps {
  steps: [StepItem, StepItem, StepItem];
}

export default function Steps({ steps }: StepsProps) {
  const { direction } = useLanguage();

  return (
    <div className="time-steps">
      <ul className="grid lg:grid-cols-3 gap-16 mb-10 relative items-center">
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1;
          const isActive = step.active;
          const titleClass = isActive ? "text-primary" : "text-muted-foreground";
          const circleClass = isActive
            ? "text-primary fill-primary"
            : "text-gray-300 fill-gray-300";
          const dateClass = isActive ? "text-muted-foreground" : "text-muted-foreground";

          return (
            <li
              key={index}
              className={
                index === 0
                  ? "flex items-center justify-between lg:justify-start gap-2 relative"
                  : index === 1
                  ? "flex items-center lg:items-start justify-between lg:justify-center gap-2 relative"
                  : "flex items-center lg:items-start justify-between lg:justify-end gap-2"
              }
            >
              {!isLast && index === 1 && (
                <>
                <div
                  className={`line absolute top-[50%] ${
                    direction === "ltr" ? "left-[50%]" : "right-[50%]"
                  } w-[155%]  h-1 bg-accent z-[-1] hidden lg:block`}
                />
                <div
                  className={`line absolute top-[50%] ${
                    direction === "ltr" ? "right-[50%]" : "left-[50%]"
                  } w-[150%] rtl:w-[160%] h-1 bg-accent z-[-1] hidden lg:block`}
                />
                </>
              )}

              <div className="flex lg:items-center flex-col gap-2">
                <div className="title">
                  <h3 className={`text-md font-semibold ${titleClass}`}>
                    {step.title}
                  </h3>
                </div>
                <div className="point">
                  <Circle
                    className={`w-6 h-6 ${circleClass} hidden lg:block`}
                  />
                </div>
                <div className="date">
                  <p className={`text-sm ${dateClass} lg:text-center`}>
                    {step.dateText || ""}
                  </p>
                </div>
              </div>

              {!isLast && (
                <div
                  className={`line absolute top-[40%] ${
                    direction === "ltr" ? "right-[10px]" : "left-[10px]"
                  } h-[220%] w-1 bg-accent z-[-1] block lg:hidden`}
                />
              )}

              <div className="point">
                <Circle className={`w-6 h-6 ${circleClass} block lg:hidden`} />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
