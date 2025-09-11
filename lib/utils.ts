import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatEventDate(dateString: string): string {
  if (!dateString) return "Event Date";
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Event Date";
    
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  } catch (error) {
    return "Event Date";
  }
}
