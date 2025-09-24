"use client";
import React from "react";
import { MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const ProfileDropdown = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center justify-center xl:justify-between space-x-0 xl:space-x-3 px-1 xl:px-3 py-3 rounded-full hover:bg-neutral-900 transition-colors cursor-pointer focus-visible:outline-none">
        <React.Fragment>
          <div className="flex items-center space-x-3">
            <Avatar className="size-10 bg-neutral-600 rounded-full flex items-center justify-center">
              <AvatarImage
                src="/assets/images/user.webp"
                width={20}
                height={20}
                className="object-cover"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>

            <div className="hidden xl:block flex-1 min-w-0">
              <div className="text-white font-semibold text-sm truncate">
                Your Name
              </div>
              <div className="text-gray-500 text-sm truncate">@username</div>
            </div>
          </div>
          <MoreHorizontal
            size={20}
            className="text-gray-500 hidden xl:block flex-shrink-0"
          />
        </React.Fragment>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="min-w-64 p-0 !rounded-[10px]"
      >
        <DropdownMenuItem className="hover:!bg-neutral-950 hover:!text-white p-0 py-3 px-4 !rounded-[0px] cursor-pointer">
          View Profile
        </DropdownMenuItem>
        <DropdownMenuItem className="hover:!bg-neutral-950 hover:!text-white p-0 py-3 px-4 !rounded-[0px] cursor-pointer">
          Log out @username
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
