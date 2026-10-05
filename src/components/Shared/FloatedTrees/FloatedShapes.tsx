import React from "react";

/**
 * Decorative background layer sitting behind page content.
 *
 * Previously four botanical leaf watermarks (the natural-oils brand this
 * storefront was forked from). Furnmasr's identity is warm wood tones rather
 * than foliage, so the motif is now a pair of soft brand-coloured washes drawn
 * in CSS — no image requests, and it follows the theme in both light and dark.
 */
function FloatedShapes({ height }: { height: string }) {
  return (
    <div
      aria-hidden="true"
      className="floet-shapes absolute top-1/2 -translate-y-1/2 left-0 w-full z-[-1] select-none pointer-events-none overflow-hidden"
      style={{ height }}
    >
      <div className="absolute -top-24 -right-24 w-[420px] h-[420px] rounded-full bg-primary/[0.06] blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-[420px] h-[420px] rounded-full bg-primary/[0.05] blur-3xl" />
    </div>
  );
}

export default FloatedShapes;
