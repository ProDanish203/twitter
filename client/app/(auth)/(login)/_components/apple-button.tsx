import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";

interface AppleButtonProps {
  text: string;
  className?: string;
}

export const AppleButton: React.FC<AppleButtonProps> = ({
  text,
  className,
}) => {
  return (
    <div className="overflow-hidden w-full">
      <Button
        variant="secondary"
        className={cn(
          "flex items-center justify-center w-full py-5 px-4 cursor-pointer hover:bg-secondary/90 h-10 rounded-full",
          className
        )}
      >
        <Image
          src="/assets/icons/apple-logo.svg"
          alt="apple-logo"
          width={30}
          height={30}
          className="object-contain"
        />
        <span className="text-[#0f1419] text-[15px] font-normal">{text}</span>
      </Button>
    </div>
  );
};
