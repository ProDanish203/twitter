"use client";
import { ComposeTweet } from "@/components/form/compose-tweet";
import { PostCard } from "@/components/posts/post-card";
import { Button } from "@/components/ui/button";
import { dummyPosts } from "@/lib/dummy-data";
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
          {homeTabs.map((tab, index) => {
            const isActive = activeTab === tab;

            return (
              <div className="w-full" key={`home-tab-${index}`}>
                <Button
                  variant="tab"
                  role="button"
                  className={cn(
                    "w-full p-0 h-12 rounded-none cursor-pointer",
                    isActive
                      ? "text-white hover:text-white"
                      : "text-neutral-500 hover:text-neutral-500"
                  )}
                  onClick={() => setActiveTab(tab)}
                >
                  <div className="relative h-full flex items-center justify-center">
                    <span
                      className={cn(
                        "text-[14px]",
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
      <div className="min-h-[200vh]">
        <div className="max-lg:pr-6 max-sm:pr-2">
          <ComposeTweet />
        </div>
        <div className="">
          {dummyPosts.map((post) => (
            <PostCard key={post.id} post={post} type="FEED" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
