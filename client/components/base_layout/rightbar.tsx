import { SearchBar } from "../form/search-bar";

export const Rightbar = () => {
  return (
    <aside className="relative h-screen pr-2">
      {/* Sticky Search Bar Container */}
      <div className="fixed top-0 z-20 w-96 px-4 pr-6">
        <SearchBar />
      </div>

      {/* Scrollable Content Area */}
      <div className="sticky mt-20">
        <div className="overflow-y-auto h-full pb-20">
          {/* Empty content containers for demonstration */}
          <div className="p-4 space-y-4">
            <div className="bg-neutral-900 rounded-2xl p-4 h-32">
              <div className="h-4 bg-neutral-700 rounded mb-2"></div>
              <div className="h-3 bg-neutral-800 rounded mb-1"></div>
              <div className="h-3 bg-neutral-800 rounded w-3/4"></div>
            </div>

            <div className="bg-neutral-900 rounded-2xl p-4 h-48">
              <div className="h-4 bg-neutral-700 rounded mb-3"></div>
              <div className="space-y-2">
                <div className="h-8 bg-neutral-800 rounded"></div>
                <div className="h-8 bg-neutral-800 rounded"></div>
                <div className="h-8 bg-neutral-800 rounded"></div>
              </div>
            </div>

            <div className="bg-neutral-900 rounded-2xl p-4 h-40">
              <div className="h-4 bg-neutral-700 rounded mb-3"></div>
              <div className="space-y-2">
                <div className="h-6 bg-neutral-800 rounded"></div>
                <div className="h-6 bg-neutral-800 rounded"></div>
              </div>
            </div>

            {/* More empty containers to show scrolling */}
            <div className="bg-neutral-900 rounded-2xl p-4 h-32">
              <div className="h-4 bg-neutral-700 rounded mb-2"></div>
              <div className="h-3 bg-neutral-800 rounded mb-1"></div>
              <div className="h-3 bg-neutral-800 rounded w-2/3"></div>
            </div>

            <div className="bg-neutral-900 rounded-2xl p-4 h-24">
              <div className="h-4 bg-neutral-700 rounded mb-2"></div>
              <div className="h-3 bg-neutral-800 rounded"></div>
            </div>
            <div className="bg-neutral-900 rounded-2xl p-4 h-32">
              <div className="h-4 bg-neutral-700 rounded mb-2"></div>
              <div className="h-3 bg-neutral-800 rounded mb-1"></div>
              <div className="h-3 bg-neutral-800 rounded w-2/3"></div>
            </div>

            <div className="bg-neutral-900 rounded-2xl p-4 h-24">
              <div className="h-4 bg-neutral-700 rounded mb-2"></div>
              <div className="h-3 bg-neutral-800 rounded"></div>
            </div>
            <div className="bg-neutral-900 rounded-2xl p-4 h-32">
              <div className="h-4 bg-neutral-700 rounded mb-2"></div>
              <div className="h-3 bg-neutral-800 rounded mb-1"></div>
              <div className="h-3 bg-neutral-800 rounded w-2/3"></div>
            </div>

            <div className="bg-neutral-900 rounded-2xl p-4 h-24">
              <div className="h-4 bg-neutral-700 rounded mb-2"></div>
              <div className="h-3 bg-neutral-800 rounded"></div>
            </div>
            <div className="bg-neutral-900 rounded-2xl p-4 h-32">
              <div className="h-4 bg-neutral-700 rounded mb-2"></div>
              <div className="h-3 bg-neutral-800 rounded mb-1"></div>
              <div className="h-3 bg-neutral-800 rounded w-2/3"></div>
            </div>

            <div className="bg-neutral-900 rounded-2xl p-4 h-24">
              <div className="h-4 bg-neutral-700 rounded mb-2"></div>
              <div className="h-3 bg-neutral-800 rounded"></div>
            </div>
            <div className="bg-neutral-900 rounded-2xl p-4 h-32">
              <div className="h-4 bg-neutral-700 rounded mb-2"></div>
              <div className="h-3 bg-neutral-800 rounded mb-1"></div>
              <div className="h-3 bg-neutral-800 rounded w-2/3"></div>
            </div>

            <div className="bg-neutral-900 rounded-2xl p-4 h-24">
              <div className="h-4 bg-neutral-700 rounded mb-2"></div>
              <div className="h-3 bg-neutral-800 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
