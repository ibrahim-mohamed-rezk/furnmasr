"use client";

import React, { useState } from "react";
import { Rating } from "./rating";

export function RatingExample() {
  const [interactiveRating, setInteractiveRating] = useState(0);

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-bold">Rating Component Examples</h2>

      {/* Read-only rating with half stars */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">
          Read-only Rating with Half Stars
        </h3>
        <div className="space-y-2">
          <Rating value={3.5} readonly allowFraction={true} />
          <Rating value={4.2} readonly allowFraction={true} />
          <Rating value={2.8} readonly allowFraction={true} />
        </div>
      </div>

      {/* Interactive rating */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Interactive Rating</h3>
        <Rating
          value={interactiveRating}
          onValueChange={setInteractiveRating}
          allowFraction={true}
        />
        <p className="text-sm text-muted-foreground">
          Current rating: {interactiveRating}
        </p>
      </div>

      {/* Different sizes */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Different Sizes</h3>
        <div className="space-y-2">
          <Rating value={3.5} size={16} readonly allowFraction={true} />
          <Rating value={3.5} size={24} readonly allowFraction={true} />
          <Rating value={3.5} size={32} readonly allowFraction={true} />
        </div>
      </div>

      {/* Different colors */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Different Colors</h3>
        <div className="space-y-2">
          <Rating value={4} readonly fillColor="#ffd700" />
          <Rating value={4} readonly fillColor="#ff6b6b" />
          <Rating value={4} readonly fillColor="#4ecdc4" />
        </div>
      </div>

      {/* Whole numbers only */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Whole Numbers Only</h3>
        <Rating value={3} readonly allowFraction={false} />
      </div>
    </div>
  );
}
