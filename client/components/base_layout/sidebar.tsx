import { sidebarData } from "@/lib/sidebar-data";
import { FeatherIcon, MoreHorizontal, User, X } from "lucide-react";
import Link from "next/link";
import { MoreDropdown } from "./more-dropdown";
import { PrimaryButton } from "../common";
import { Button } from "../ui/button";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ProfileDropdown } from "./profile-dropdown";

export const Sidebar = () => {
  return (
    <aside className="fixed top-0 h-full w-20 xl:w-72 border-r border-neutral-800 px-2 xl:px-4 py-4 flex flex-col bg-background">
      {/* Logo */}
      <div className="mb-4 px-1 xl:px-3 mt-2 flex justify-center xl:justify-start">
        <Image
          src="/assets/icons/logo.svg"
          alt="Logo"
          width={25}
          height={25}
          className="object-contain"
        />
      </div>

      {/* Navigation Links */}
      <nav className="mt-2 flex-1 gap-y-2 flex flex-col max-xl:items-center">
        {sidebarData.map((item) => {
          const IconComponent = item.icon;
          return (
            <Link key={item.href} href={item.href} className="group">
              <div
                className={cn(
                  "flex items-center justify-center rounded-full group-hover:bg-neutral-900 transition-colors w-fit py-3",
                  "xl:justify-start xl:space-x-4 xl:px-3 xl:pr-5",
                  "max-xl:size-12"
                )}
              >
                <IconComponent size={26} className="text-white" />
                <span className="text-xl text-white font-normal hidden xl:block">
                  {item.title}
                </span>
              </div>
            </Link>
          );
        })}

        <MoreDropdown />
      </nav>

      {/* Post Button */}
      <div className="mb-4">
        <div className="xl:block hidden">
          <PrimaryButton text="Post" className="py-7 sm:text-lg" />
        </div>
        <div className="xl:hidden flex justify-center">
          <Button
            variant="secondary"
            className="flex items-center justify-center w-full py-5 px-4 cursor-pointer hover:bg-secondary/90 size-10 rounded-full text-[#0f1419] text-[15px] font-bold"
          >
            <FeatherIcon />
          </Button>
        </div>
      </div>

      <ProfileDropdown />
    </aside>
  );
};
