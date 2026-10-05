"use client";

import { StarIcon } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";

interface RatingProps {
  value: number;
  maxValue?: number;
  size?: number;
  readonly?: boolean;
  allowFraction?: boolean;
  fillColor?: string;
  emptyColor?: string;
  className?: string;
  onValueChange?: (value: number) => void;
  dir?: "ltr" | "rtl";
}

export function Rating({
  value = 0,
  maxValue = 5,
  size = 20,
  readonly = false,
  allowFraction = false,
  fillColor = "#FFAC33",
  emptyColor = "#e5e7eb",
  className = "",
  onValueChange,
  dir = "ltr",
}: RatingProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  const displayValue = isHovering ? hoverValue || 0 : value;
  const isRTL = dir === "rtl";

  const calculateValueFromPosition = (x: number, width: number) => {
    let percentage = x / width;

    // Invert percentage for RTL
    if (isRTL) {
      percentage = 1 - percentage;
    }

    let newValue = percentage * maxValue;

    if (allowFraction) {
      // For fractional ratings, round to nearest 0.5
      newValue = Math.round(newValue * 2) / 2;
    } else {
      // For whole numbers only, round up
      newValue = Math.ceil(newValue);
    }

    return Math.max(0, Math.min(maxValue, newValue));
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (readonly) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const width = rect.width;

    const newValue = calculateValueFromPosition(x, width);
    setHoverValue(newValue);
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    if (readonly) return;
    setIsHovering(false);
    setHoverValue(null);
  };

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (readonly) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const width = rect.width;

    const newValue = calculateValueFromPosition(x, width);
    onValueChange?.(newValue);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (readonly) return;

    let newValue = value;

    switch (event.key) {
      case "ArrowLeft":
        event.preventDefault();
        if (isRTL) {
          // In RTL, left arrow increases value
          if (allowFraction) {
            newValue = Math.min(maxValue, value + 0.5);
          } else {
            newValue = Math.min(maxValue, value + 1);
          }
        } else {
          // In LTR, left arrow decreases value
          if (allowFraction) {
            newValue = Math.max(0, value - 0.5);
          } else {
            newValue = Math.max(0, value - 1);
          }
        }
        onValueChange?.(newValue);
        break;
      case "ArrowRight":
        event.preventDefault();
        if (isRTL) {
          // In RTL, right arrow decreases value
          if (allowFraction) {
            newValue = Math.max(0, value - 0.5);
          } else {
            newValue = Math.max(0, value - 1);
          }
        } else {
          // In LTR, right arrow increases value
          if (allowFraction) {
            newValue = Math.min(maxValue, value + 0.5);
          } else {
            newValue = Math.min(maxValue, value + 1);
          }
        }
        onValueChange?.(newValue);
        break;
      case "ArrowUp":
        event.preventDefault();
        if (allowFraction) {
          newValue = Math.min(maxValue, value + 0.5);
        } else {
          newValue = Math.min(maxValue, value + 1);
        }
        onValueChange?.(newValue);
        break;
      case "ArrowDown":
        event.preventDefault();
        if (allowFraction) {
          newValue = Math.max(0, value - 0.5);
        } else {
          newValue = Math.max(0, value - 1);
        }
        onValueChange?.(newValue);
        break;
      case "Home":
        event.preventDefault();
        onValueChange?.(0);
        break;
      case "End":
        event.preventDefault();
        onValueChange?.(maxValue);
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        // Toggle between current value and 0
        onValueChange?.(value > 0 ? 0 : allowFraction ? 0.5 : 1);
        break;
    }
  };

  const handleFocus = () => {
    if (readonly) return;
    // Set focus to current value or first star
    setFocusedIndex(Math.max(0, Math.floor(value) - 1));
  };

  const handleBlur = () => {
    setFocusedIndex(-1);
  };

  const handleStarKeyDown = (event: React.KeyboardEvent, starIndex: number) => {
    if (readonly) return;

    switch (event.key) {
      case "ArrowLeft":
        event.preventDefault();
        if (isRTL) {
          // In RTL, left arrow moves to next star (higher index)
          if (starIndex < maxValue - 1) {
            setFocusedIndex(starIndex + 1);
          }
        } else {
          // In LTR, left arrow moves to previous star (lower index)
          if (starIndex > 0) {
            setFocusedIndex(starIndex - 1);
          }
        }
        break;
      case "ArrowRight":
        event.preventDefault();
        if (isRTL) {
          // In RTL, right arrow moves to previous star (lower index)
          if (starIndex > 0) {
            setFocusedIndex(starIndex - 1);
          }
        } else {
          // In LTR, right arrow moves to next star (higher index)
          if (starIndex < maxValue - 1) {
            setFocusedIndex(starIndex + 1);
          }
        }
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        const newValue = starIndex + 1;
        onValueChange?.(newValue);
        break;
    }
  };

  const renderStar = (index: number) => {
    const starValue = index + 1;
    const isFilled = displayValue >= starValue;
    const isPartial =
      allowFraction && displayValue > index && displayValue < starValue;
    const isFocused = focusedIndex === index;

    let fillPercentage = 0;
    if (isFilled) {
      fillPercentage = 100;
    } else if (isPartial) {
      // Calculate the exact percentage for partial fill
      const partialValue = displayValue - index;
      fillPercentage = Math.round(partialValue * 100);
    }

    return (
      <div
        key={index}
        className={`relative inline-block cursor-pointer ${
          isFocused ? "ring-2 ring-blue-500 ring-offset-2" : ""
        }`}
        style={{ width: size, height: size }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={(e) => handleClick(e)}
        onKeyDown={(e) => handleStarKeyDown(e, index)}
        tabIndex={readonly ? -1 : 0}
        role="button"
        aria-label={`Rate ${starValue} ${starValue === 1 ? "star" : "stars"}`}
        aria-pressed={isFilled}
      >
        {/* Empty star background */}
        <StarIcon
          size={size}
          className="absolute inset-0 fill-current"
          style={{ color: emptyColor }}
        />

        {/* Filled star overlay */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${fillPercentage}%` }}
        >
          <StarIcon
            size={size}
            style={{ color: fillColor }}
            className="fill-current"
          />
        </div>
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      className={`flex items-center gap-1 ${className} `}
      style={{ direction: dir }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={(e) => handleClick(e)}
      onKeyDown={handleKeyDown}
      onFocus={handleFocus}
      onBlur={handleBlur}
      tabIndex={readonly ? -1 : 0}
      role="slider"
      aria-label="Rating"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={maxValue}
      aria-valuetext={`${value} / ${maxValue}`}
    >
      {Array.from({ length: maxValue }, (_, index) => renderStar(index))}
    </div>
  );
}
