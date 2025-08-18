import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class names using clsx and tailwind-merge
 * This utility function helps to conditionally join Tailwind CSS classes
 * and automatically handles conflicting classes
 * 
 * @param {...ClassValue[]} inputs - Class names, objects, or arrays to combine
 * @returns {string} Combined and merged class string
 * 
 * @example
 * cn('px-2 py-1', 'px-3') // Returns: 'py-1 px-3'
 * cn('text-red-500', condition && 'text-blue-500') // Conditionally applies classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
