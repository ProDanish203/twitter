"use client";
import { MoreHorizontal, User } from "lucide-react";

export const ProfileDropdown = () => {
  return (
    <div className="flex items-center justify-center xl:justify-start space-x-0 xl:space-x-3 px-1 xl:px-3 py-3 rounded-full hover:bg-neutral-900 transition-colors cursor-pointer">
      <div className="size-10 bg-neutral-600 rounded-full flex items-center justify-center flex-shrink-0">
        <User size={20} className="text-white" />
      </div>
      <div className="hidden xl:block flex-1 min-w-0">
        <div className="text-white font-semibold text-sm truncate">
          Your Name
        </div>
        <div className="text-gray-500 text-sm truncate">@username</div>
      </div>
      <MoreHorizontal
        size={20}
        className="text-gray-500 hidden xl:block flex-shrink-0"
      />
    </div>
  );
};
