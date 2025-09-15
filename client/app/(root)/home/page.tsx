import { Button } from "@/components/ui/button";

const HomeScreen = () => {
  return (
    <div className="">
      {/* Header */}
      <div className="sticky top-0 bg-black/80 backdrop-blur-sm border-b border-neutral-800 z-10">
        <div className="relative w-full mx-auto flex items-center justify-between">
          <div className="w-full">
            <Button
              variant="tab"
              role="button"
              className="w-full p-0 h-16 rounded-none cursor-pointer"
            >
              <span className="text-[16px] font-semibold">For you</span>
            </Button>
          </div>

          <div className="w-full">
            <Button
              variant="tab"
              role="button"
              className="w-full h-16 rounded-none cursor-pointer"
            >
              <span className="text-[16px] font-semibold">Following</span>
            </Button>
          </div>
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
