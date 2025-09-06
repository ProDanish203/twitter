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
          `z-[1] font-roboto relative px-2.5 pb-2.5 pt-2.5 w-full text-sm text-lightGray bg-transparent rounded-xs border border-primary dark:border-neutral-800 appearance-none focus:outline-none focus:ring-0 focus:border-primary dark:focus:border-primary peer`,
          isError && "!border-red-500/60 !focus:border-red-500/60"
        )}
        {...register(name as Path<T>)}
      />
      <label
        htmlFor={name}
        className={cn(
          `z-[1] font-roboto absolute text-sm text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 origin-[0] bg-bg dark:bg-background px-2 peer-focus:px-2 peer-focus:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1 user-select-none pointer-events-none`,
          isError && "text-red-500/80 peer-focus:text-red-500/80",
          className
        )}
      >
        {isError ? errorMessage : placeholder}
      </label>
    </div>
  );
};
