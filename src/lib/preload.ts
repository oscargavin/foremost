import { cache } from "react";

/**
 * Preload utilities for anticipating navigation
 *
 * Uses React's cache() for request deduplication.
 * Call preload functions on hover/focus to warm the cache before navigation.
 */

// Industry data preload
export const getIndustryData = cache(async (slug: string) => {
  // This would typically fetch from a CMS or database
  // For now, we'll just return a marker that it was preloaded
  return { slug, preloaded: true };
});

export const preloadIndustry = (slug: string) => {
  void getIndustryData(slug);
};

// Contact page preload - no data to fetch, but could warm up form validation schema
export const preloadContact = () => {
  // Dynamically import the contact form to warm the module cache
  void import("@/lib/schemas/contact");
};

// Service page preload
export const preloadService = (serviceSlug: string) => {
  // Could prefetch service-specific data here
  void Promise.resolve({ service: serviceSlug, preloaded: true });
};

// Generic page preload using Next.js router prefetch
export function createPrefetchHandler(router: { prefetch: (url: string) => void }) {
  const prefetched = new Set<string>();

  return (url: string) => {
    if (prefetched.has(url)) return;
    prefetched.add(url);
    router.prefetch(url);
  };
}
