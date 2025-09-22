"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";

const homeTabs = ["For you", "Following"];

const HomeScreen = () => {
  const [activeTab, setActiveTab] = useState<(typeof homeTabs)[number]>(
    homeTabs[0]
  );

  return (
    <div className="">
      {/* Header */}
      <div className="sticky top-0 bg-black/80 backdrop-blur-sm border-b border-neutral-800 z-10">
        <div className="relative w-full mx-auto flex items-center justify-between">
          {homeTabs.map((tab) => {
            const isActive = activeTab === tab;

            return (
              <div className="w-full">
                <Button
                  variant="tab"
                  role="button"
                  className={cn(
                    "w-full p-0 h-16 rounded-none cursor-pointer",
                    isActive
                      ? "text-white hover:text-white"
                      : "text-neutral-500 hover:text-neutral-500"
                  )}
                  onClick={() => setActiveTab(tab)}
                >
                  <div className="relative h-full flex items-center justify-center">
                    <span
                      className={cn(
                        "text-[16px]",
                        isActive ? "font-semibold" : "font-medium"
                      )}
                    >
                      {tab}
                    </span>
                    {isActive && (
                      <span className="absolute bottom-0 left-0 h-1 w-full bg-primary rounded-full"></span>
                    )}
                  </div>
                </Button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content - just empty space for now */}
      <div className="min-h-[200vh] p-4 pr-6">
        <div className="space-y-4">
          <div className="h-32 bg-neutral-900 rounded-lg"></div>
          <div className="h-24 bg-neutral-900 rounded-lg"></div>
          <div className="h-40 bg-neutral-900 rounded-lg"></div>
          <div className="h-28 bg-neutral-900 rounded-lg"></div>
          <div className="h-36 bg-neutral-900 rounded-lg"></div>
          <div className="h-32 bg-neutral-900 rounded-lg"></div>
          <div className="h-24 bg-neutral-900 rounded-lg"></div>
          <div className="h-40 bg-neutral-900 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
