"use client";
import { cn } from "@/lib/utils";
import React from "react";
import { FieldValues, Path, UseFormRegister } from "react-hook-form";

interface FloatingInputProps<T extends FieldValues>
  extends React.InputHTMLAttributes<HTMLInputElement> {
  register: UseFormRegister<T>;
  isError?: any;
  errorMessage?: string;
}

export const FloatingInput = <T extends FieldValues>({
  type,
  name,
  placeholder,
  className,
  register,
  isError,
  errorMessage,
  ...rest
}: FloatingInputProps<T>) => {
  return (
    <div className="relative w-full">
      <input
        {...rest}
        type={type}
        placeholder={""}
        className={cn(
          `z-[1] font-roboto relative px-2.5 pb-2.5 pt-6 w-full text-sm bg-transparent rounded-xs border border-neutral-800 dark:border-neutral-800 appearance-none focus:outline-none focus:ring-0 focus:border-primary dark:focus:border-primary peer disabled:bg-neutral-700/40 disabled:opacity-65`,
          isError && "!border-red-500/60 !focus:border-red-500/60"
        )}
        {...register(name as Path<T>)}
      />
      <label
        htmlFor={name}
        className={cn(
          `font-roboto absolute text-sm text-gray-400 duration-200 transform top-4 left-2.5 origin-[0] peer-focus:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:top-4 peer-focus:top-1.5 peer-focus:scale-100 peer-focus:text-xs peer-[&:not(:placeholder-shown)]:top-1.5 peer-[&:not(:placeholder-shown)]:scale-95 peer-[&:not(:placeholder-shown)]:text-xs rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto user-select-none pointer-events-none transition-all`,
          isError && "text-red-500/80 peer-focus:text-red-500/80",
          className
        )}
      >
        {isError ? errorMessage : placeholder}
      </label>
    </div>
  );
};
