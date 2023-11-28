import { type ClassValue, clsx } from "clsx"
import slugify from "slugify";
import { twMerge } from "tailwind-merge"
import { z } from "zod";
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export const isZodError = (error: any) => {
  return error instanceof z.ZodError
}

export const slug = (text: string) => {
  return slugify(text, {lower: true});
}