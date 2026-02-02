"use client";

import { useEffect, useState, RefObject } from "react";

/**
 * Uses IntersectionObserver to track whether an element is visible in the viewport.
 * Returns false when element is off-screen to pause expensive animations.
 */
export function useVisibility(
  ref: RefObject<HTMLElement | null>,
  options: IntersectionObserverInit = { threshold: 0.1 }
): boolean {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    }, options);

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [ref, options.threshold, options.root, options.rootMargin]);

  return isVisible;
}
