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
          "z-[1] font-roboto relative px-2.5 pb-2.5 pt-6 pr-12 w-full text-sm bg-transparent rounded-xs border border-border dark:border-neutral-800 appearance-none focus:outline-none focus:ring-0 focus:border-primary dark:focus:border-primary peer disabled:bg-neutral-700/40 disabled:opacity-65",
          isError && "!border-red-500/60 !focus:border-red-500/60"
        )}
        placeholder=""
        {...register(name as Path<T>)}
      />
      <label
        htmlFor={name}
        className={cn(
          "font-roboto absolute text-sm text-gray-400 duration-200 transform top-4 left-2.5 origin-[0] peer-focus:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:top-4 peer-focus:top-1.5 peer-focus:scale-95 peer-focus:text-xs peer-[&:not(:placeholder-shown)]:top-1.5 peer-[&:not(:placeholder-shown)]:scale-95 peer-[&:not(:placeholder-shown)]:text-xs rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto user-select-none pointer-events-none transition-all",
          isError && "text-red-500/80 peer-focus:text-red-500/80",
          className
        )}
      >
        {placeholder}
      </label>
      <button
        type="button"
        className="absolute right-3 top-4 cursor-pointer z-[2]"
        onClick={() => setShowPass((prev) => !prev)}
      >
        {!showPass ? (
          <Eye className="size-5 text-gray-400" />
        ) : (
          <EyeOff className="size-5 text-gray-400" />
        )}
      </button>
    </div>
  );
};
