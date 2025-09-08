"use client";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { UseFormRegister, FieldValues, Path } from "react-hook-form";

interface Props<T extends FieldValues>
  extends React.InputHTMLAttributes<HTMLInputElement> {
  register: UseFormRegister<T>;
  isError?: any;
  errorMessage?: string;
}

export const PasswordInput = <T extends FieldValues>({
  name,
  placeholder,
  register,
  isError,
  errorMessage,
  className,
  ...rest
}: Props<T>) => {
  const [showPass, setShowPass] = useState(false);

  return (
    <div className="relative w-full">
      <input
        {...rest}
        type={showPass ? "text" : "password"}
        id={name}
        className={cn(
          "block px-2.5 pb-2.5 pt-2.5 w-full text-sm text-lightGray bg-transparent rounded-xs border border-border dark:border-neutral-800 appearance-none focus:outline-none focus:ring-0 focus:border-primary peer",
          isError && "!border-red-500/60 !focus:border-red-500/60"
        )}
        placeholder=""
        {...register(name as Path<T>)}
      />
      <label
        htmlFor={name}
        className={cn(
          "absolute text-sm text-gray-400  duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-background dark:bg-background  px-2 peer-focus:px-2 peer-focus:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1",
          isError && "text-red-500/80 peer-focus:text-red-500/80",
          className
        )}
      >
        {placeholder}
      </label>
      <button
        type="button"
        className="absolute right-3 top-3 cursor-pointer"
        onClick={() => setShowPass((prev) => !prev)}
      >
        {!showPass ? <Eye className="size-5" /> : <EyeOff className="size-5" />}
      </button>
    </div>
  );
};
