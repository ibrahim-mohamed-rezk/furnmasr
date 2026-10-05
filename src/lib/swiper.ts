/**
 * Swiper's loop mode needs more slides than it shows at once, otherwise it
 * logs "Swiper Loop Warning: The number of slides is not enough for loop mode"
 * and silently degrades. The check it runs internally (swiper 11) is:
 *
 *   slides.length < ceil(slidesPerView) + loopedSlides
 *
 * where `loopedSlides` is `slidesPerGroup` (1 by default) plus
 * `loopAdditionalSlides` (0 by default). So the minimum workable count is
 * `ceil(maxSlidesPerView) + 1`, measured against the LARGEST `slidesPerView`
 * across every breakpoint — the warning fires on viewport size, not just the
 * initial render.
 *
 * Pass the largest `slidesPerView` any breakpoint uses.
 */
export function canLoop(slideCount: number, maxSlidesPerView: number): boolean {
  return slideCount >= Math.ceil(maxSlidesPerView) + 1;
}
