import { useCategories } from "./useCategories";
import { useMemo } from "react";

export const useCategoryMapping = () => {
  const { data: categoriesData } = useCategories();

  const categoryMapping = useMemo(() => {
    if (!categoriesData?.data?.category) return {};

    const mapping: { [key: string]: number } = {};
    
    categoriesData.data.category.forEach((category) => {
      mapping[category.slug] = category.id;
      // Also map common variations
      // Aliases let the hardcoded nav/footer links resolve against whatever
      // slugs the catalog API returns. Update the left-hand slugs once the
      // furnmasr catalog is live.
      if (category.slug === 'moisturizers') {
        mapping['living-room'] = category.id;
      }
      if (category.slug === 'cleansers') {
        mapping['bedroom'] = category.id;
      }
      if (category.slug === 'serums') {
        mapping['dining'] = category.id;
      }
      if (category.slug === 'sunscreens') {
        mapping['decor'] = category.id;
      }
    });


    return mapping;
  }, [categoriesData]);

  const getCategoryId = (slug: string): number | null => {
    const id = categoryMapping[slug] || null;
    return id;
  };

  const getCategoryUrl = (slug: string): string => {
    const id = getCategoryId(slug);
    const url = id ? `/shop?category=${id}` : '/shop';
    return url;
  };

  return {
    categoryMapping,
    getCategoryId,
    getCategoryUrl,
  };
}; 