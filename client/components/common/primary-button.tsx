"use client";
import React from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface PrimaryButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  onClick?: () => void;
  className?: string;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  text,
  onClick,
  className,
  ...rest
}) => {
  return (
    <Button
      variant="secondary"
      className={cn(
        "flex items-center justify-center w-full py-5 px-4 cursor-pointer hover:bg-secondary/90 h-10 rounded-full text-[#0f1419] text-[15px] font-bold",
        className
      )}
      onClick={() => {
        onClick && onClick();
      }}
      {...rest}
    >
      {text}
    </Button>
  );
};
