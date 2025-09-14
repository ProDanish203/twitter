const HomeScreen = () => {
  return (
    <div className="">
      {/* Header */}
      <div className="sticky top-0 bg-black/80 backdrop-blur-sm border-b border-neutral-800 p-4 z-10">
        <h1 className="text-xl font-bold">Home</h1>
      </div>

      {/* Main Content - just empty space for now */}
      <div className="min-h-[200vh] p-4">
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
