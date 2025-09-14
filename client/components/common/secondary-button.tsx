"use client";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface SecondaryButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  onClick?: () => void;
  className?: string;
}

export const SecondaryButton: React.FC<SecondaryButtonProps> = ({
  text,
  onClick,
  className,
  ...rest
}) => {
  return (
    <Button
      variant="outline"
      className={cn(
        "flex items-center justify-center w-full py-4 px-4 cursor-pointer hover:bg-secondary/90 h-10 rounded-full text-white text-[15px] font-bold hover:text-white !border-neutral-700",
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
