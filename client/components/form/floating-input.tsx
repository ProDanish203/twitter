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
        className={cn("")}
        {...register(name as Path<T>)}
      />
      <label htmlFor={name} className={cn("", className)}>
        {isError ? errorMessage : placeholder}
      </label>
    </div>
  );
};
