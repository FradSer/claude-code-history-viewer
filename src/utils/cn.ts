import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility function for merging CSS classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
