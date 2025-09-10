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

export const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());

export const currentYear = new Date().getFullYear();
export const years = Array.from({ length: 100 }, (_, i) =>
  (currentYear - i).toString()
);
