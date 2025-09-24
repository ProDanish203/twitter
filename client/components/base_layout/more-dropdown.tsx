"use client";
import { cn } from "@/lib/utils";
import { CircleEllipsis, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { sidebarMoreLinks } from "@/lib/sidebar-data";

export const MoreDropdown = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        className="group w-full flex items-center max-xl:justify-center cursor-pointer focus-visible:outline-none"
      >
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
      </DropdownMenuTrigger>
      <DropdownMenuContent
        // side="top"
        align="start"
        className="min-w-64 p-0 !rounded-[10px]"
      >
        {sidebarMoreLinks.map((link, idx) => (
          <DropdownMenuItem
            key={idx}
            className="rounded-none p-0 hover:!bg-neutral-950"
          >
            <Link
              href={link.href}
              className="w-full py-3 px-4 hover:bg-neutral-950 text-white sm:text-lg flex items-center gap-x-4 cursor-pointer transition-all duration-200"
            >
              <link.icon className="size-5 text-white" size={20} />
              <span>{link.title}</span>
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
