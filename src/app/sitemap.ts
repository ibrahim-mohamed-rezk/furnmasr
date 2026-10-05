import { MetadataRoute } from 'next';

// Canonical origin is non-www (next.config.js 308-redirects www → non-www).
const NEXT_PUBLIC_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://furnmasr.com';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://ghoran.test-domain-devunity.com/api';

/**
 * Helper function to fetch data for dynamic routes
 */
async function fetchDynamicData<T>(endpoint: string, key: string, lang: string): Promise<T[]> {
  let allItems: T[] = [];
  let currentPage = 1;
  let lastPage = 1;

  try {
    do {
      const sep = endpoint.includes('?') ? '&' : '?';
      const url = `${API_BASE_URL}${endpoint}${sep}page=${currentPage}&limit=100`;
      
      const res = await fetch(url, {
        headers: {
          'Accept-Language': lang,
          'X-Language': lang,
          'lang': lang,
        },
        next: { revalidate: 3600 },
      });
      
      if (!res.ok) {
        console.error(`Error fetching ${url}:`, res.statusText);
        break;
      }
      
      const json = await res.json();
      
      if (json.status && json.data) {
        if (Array.isArray(json.data[key])) {
          allItems = [...allItems, ...json.data[key]];
        }
        
        if (json.data.pagination && json.data.pagination.last_page) {
          lastPage = json.data.pagination.last_page;
        } else {
          break; // No pagination data, assume single page
        }
      } else {
        break; // Unexpected API structure
      }
      
      currentPage++;
    } while (currentPage <= lastPage);
    
  } catch (error) {
    console.error(`Error fetching ${endpoint} for sitemap:`, error);
  }
  
  return allItems;
}

// Locales served under URL prefixes. Arabic is the x-default.
const LOCALES = ['ar', 'en'] as const;
type Locale = (typeof LOCALES)[number];

/**
 * Build hreflang alternates for a logical path. `localePath` returns the
 * per-locale logical path (used for products whose slug differs per locale).
 */
function altLanguages(
  baseUrl: string,
  localePath: (l: Locale) => string,
): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const l of LOCALES) {
    languages[l] = `${baseUrl}/${l}${localePath(l)}`;
  }
  languages['x-default'] = `${baseUrl}/ar${localePath('ar')}`;
  return languages;
}

/**
 * Emit one sitemap entry per locale for a logical path, each carrying the full
 * set of hreflang alternates (Next renders these as xhtml:link rel="alternate").
 */
function localizedEntries(
  baseUrl: string,
  localePath: (l: Locale) => string,
  opts: { changeFrequency: 'daily' | 'weekly' | 'monthly'; priority: number },
): MetadataRoute.Sitemap {
  const languages = altLanguages(baseUrl, localePath);
  return LOCALES.map((l) => ({
    url: `${baseUrl}/${l}${localePath(l)}`,
    lastModified: new Date(),
    changeFrequency: opts.changeFrequency,
    priority: opts.priority,
    alternates: { languages },
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = NEXT_PUBLIC_SITE_URL;

  // 1. Static Routes (same logical path in every locale).
  // Note: /account, /cart, /checkout are intentionally excluded — they are
  // non-indexable user-flow pages and are disallowed in robots.ts.
  const staticPages = [
    '',
    '/blogs',
    '/contact',
    '/data-deletion',
    '/delivery-and-shipping',
    '/delivery-policy',
    '/exchange-policy',
    '/flash-sale',
    '/privacy',
    '/refund-policy',
    '/refunds-and-exchanges',
    '/shipping-policy',
    '/shop'
  ];

  const staticRoutes = staticPages.flatMap((route) =>
    localizedEntries(baseUrl, () => route, {
      changeFrequency: 'daily',
      priority: route === '' ? 1 : 0.8,
    }),
  );

  // 2. Fetch dynamically generated data segments for both languages
  const [
    productsDataEn, blogsDataEn, blogCategoriesDataEn,
    productsDataAr, blogsDataAr, blogCategoriesDataAr
  ] = await Promise.all([
    fetchDynamicData<any>('/products', 'products', 'en'),
    fetchDynamicData<any>('/blogs', 'blogs', 'en'),
    fetchDynamicData<any>('/categories', 'category', 'en'),
    fetchDynamicData<any>('/products', 'products', 'ar'),
    fetchDynamicData<any>('/blogs', 'blogs', 'ar'),
    fetchDynamicData<any>('/categories', 'category', 'ar')
  ]);

  // Merge products by id so each appears once, carrying both localized slugs.
  const productsById = new Map<string | number, any>();
  for (const p of [...productsDataAr, ...productsDataEn]) {
    const existing = productsById.get(p.id) || {};
    productsById.set(p.id, { ...existing, ...p });
  }
  const allBlogs = [...blogsDataEn, ...blogsDataAr];
  const allCategories = [...blogCategoriesDataEn, ...blogCategoriesDataAr];

  // 3. Dynamic Products — per-locale slug (slug_ar / slug_en) when available.
  const productRoutes = Array.from(productsById.values()).flatMap((product) => {
    const arSlug = product.slug_ar || product.slug || product.id;
    const enSlug = product.slug_en || product.slug || product.id;
    return localizedEntries(
      baseUrl,
      (l) => `/shop/${l === 'ar' ? arSlug : enSlug}`,
      { changeFrequency: 'daily', priority: 0.8 },
    );
  });

  // 4. Dynamic Blogs (id-based — same path per locale)
  const seenBlogs = new Set<string | number>();
  const blogRoutes = allBlogs.flatMap((blog) => {
    if (seenBlogs.has(blog.id)) return [];
    seenBlogs.add(blog.id);
    return localizedEntries(baseUrl, () => `/blogs/${blog.id}`, {
      changeFrequency: 'weekly',
      priority: 0.7,
    });
  });

  // 5. Dynamic Blog Categories (id-based — same path per locale)
  const seenCats = new Set<string | number>();
  const blogCategoryRoutes = allCategories.flatMap((category) => {
    if (seenCats.has(category.id)) return [];
    seenCats.add(category.id);
    return localizedEntries(baseUrl, () => `/blogs/category/${category.id}`, {
      changeFrequency: 'monthly',
      priority: 0.6,
    });
  });

  return [
    ...staticRoutes,
    ...productRoutes,
    ...blogRoutes,
    ...blogCategoryRoutes,
  ];
}
