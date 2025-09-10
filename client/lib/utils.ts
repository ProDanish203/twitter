import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const maskEmail = (value: string): string => {
  return value.replace(/(.{2}).*@(.{1}).*/, "$1*******@$2*******");
};

export const maskPhoneNumber = (value: string): string => {
  return value.replace(/(.{2})(.*)(.{2})/, "$1*******$3");
};
