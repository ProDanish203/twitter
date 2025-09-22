import { Rightbar } from "@/components/base_layout/rightbar";
import { Sidebar } from "@/components/base_layout/sidebar";
import React from "react";

const MainLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="min-h-screen bg-black overflow-x-clip">
      <div className="relative max-w-7xl mx-auto flex justify-center overflow-x-clip">
        {/* Sidebar - responsive width */}
        <div className="max-sm:hidden w-20 xl:w-72 flex-shrink-0">
          <Sidebar />
        </div>

        {/* Main Content Area - takes remaining space */}
        <div className="flex-1 lg:pr-0 min-w-0 sm:max-w-xl z-10 border-x border-neutral-800">
          {children}
        </div>

        {/* Right Sidebar - hidden on mobile/tablet */}
        <div className="hidden lg:block w-96 flex-shrink-0">
          <Rightbar />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
