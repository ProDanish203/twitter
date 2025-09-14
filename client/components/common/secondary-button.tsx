"use client";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface SecondaryButtonProps {
  text: string;
  onClick?: () => void;
  className?: string;
}

export const SecondaryButton: React.FC<SecondaryButtonProps> = ({
  text,
  onClick,
  className,
}) => {
  return (
    <Button
      variant="ghost"
      className={cn(
        "w-full py-5 h-10 border border-[#2f3336] cursor-pointer text-[15px] font-bold",
        className
      )}
      onClick={() => {
        onClick && onClick();
      }}
    >
      {text}
    </Button>
  );
};
