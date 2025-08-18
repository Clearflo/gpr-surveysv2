/**
 * Performance optimization utilities for images and media
 */

/**
 * Generates optimized image srcset for responsive loading
 * @param {string} baseSrc - Base image source URL
 * @param {number[]} widths - Array of widths to generate
 * @returns {string} srcset string for responsive images
 */
export const generateSrcSet = (baseSrc: string, widths: number[] = [640, 768, 1024, 1280, 1536]): string => {
  return widths
    .map(width => `${baseSrc}?w=${width} ${width}w`)
    .join(', ');
};

/**
 * Lazy load configuration for images
 * Uses Intersection Observer for efficient loading
 */
export const lazyImageOptions = {
  root: null,
  rootMargin: '50px',
  threshold: 0.01
};

/**
 * Creates an intersection observer for lazy loading images
 * @param {Function} onIntersect - Callback when element intersects
 * @returns {IntersectionObserver} Observer instance
 */
export const createImageObserver = (onIntersect: (entry: IntersectionObserverEntry) => void): IntersectionObserver => {
  return new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        onIntersect(entry);
      }
    });
  }, lazyImageOptions);
};

/**
 * Preload critical images for better LCP (Largest Contentful Paint)
 * @param {string[]} imagePaths - Array of image paths to preload
 */
export const preloadCriticalImages = (imagePaths: string[]) => {
  imagePaths.forEach(path => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = path;
    document.head.appendChild(link);
  });
};

/**
 * Image optimization settings for different use cases
 */
export const imageOptimizationPresets = {
  thumbnail: {
    width: 150,
    height: 150,
    quality: 80
  },
  card: {
    width: 400,
    height: 300,
    quality: 85
  },
  hero: {
    width: 1920,
    height: 1080,
    quality: 90
  },
  gallery: {
    width: 800,
    height: 600,
    quality: 85
  }
};

/**
 * Debounce function for performance optimization
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Throttle function for performance optimization
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};
