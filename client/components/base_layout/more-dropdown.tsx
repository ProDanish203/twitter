"use client";
import { cn } from "@/lib/utils";
import { CircleEllipsis, MoreHorizontal } from "lucide-react";

export const MoreDropdown = () => {
  return (
    <button className="group w-full flex items-center max-xl:justify-center cursor-pointer">
      <div
        className={cn(
          "flex items-center justify-center rounded-full group-hover:bg-neutral-900 transition-colors w-fit py-3",
          "xl:justify-start xl:space-x-4 xl:px-3 xl:pr-5",
          "max-xl:size-12"
        )}
      >
        <MoreHorizontal
          size={26}
          className="size-7 text-white xl:block hidden"
        />
        <CircleEllipsis size={26} className="size-7 text-white xl:hidden" />
        <span className="text-xl text-white font-normal hidden xl:block">
          More
        </span>
      </div>
    </button>
  );
};
