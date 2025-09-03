"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface GoogleButtonProps {
  text: string;
  className?: string;
}

export const GoogleButton: React.FC<GoogleButtonProps> = ({
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
          src="/assets/icons/google-logo.svg"
          alt="google-logo"
          width={30}
          height={30}
          className="object-contain"
        />
        <span className="text-[#0f1419] text-[15px] font-normal">{text}</span>
      </Button>
    </div>
  );
};
