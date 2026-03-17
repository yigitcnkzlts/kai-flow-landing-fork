export default function Loading() {
  return (
    <div className="overflow-x-hidden animate-pulse">
      {/* Hero Section Skeleton */}
      <div className="relative min-h-[80vh] bg-black flex flex-col items-center justify-center px-4 pt-4 pb-6">
        {/* Title */}
        <div className="h-10 md:h-16 lg:h-20 w-3/4 max-w-2xl bg-white/10 rounded-xl mb-4" />
        {/* Subtitle */}
        <div className="h-6 md:h-8 lg:h-10 w-2/3 max-w-xl bg-white/10 rounded-lg mb-3" />
        {/* Description */}
        <div className="h-4 md:h-5 w-1/2 max-w-lg bg-white/10 rounded-md mb-2" />
        <div className="h-4 md:h-5 w-2/5 max-w-md bg-white/10 rounded-md mb-6" />

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-4">
          <div className="h-12 w-40 bg-white/10 rounded-xl" />
          <div className="h-12 w-40 bg-white/10 rounded-xl" />
        </div>

        {/* Hero Image */}
        <div className="mt-8 w-full max-w-4xl h-64 md:h-96 bg-white/5 rounded-2xl" />
      </div>

      {/* Features Section Skeleton */}
      <div className="bg-black py-16 px-4">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <div className="h-6 w-24 bg-white/10 rounded-full mb-4" />
          <div className="h-8 md:h-10 w-2/3 bg-white/10 rounded-lg mb-3" />
          <div className="h-4 w-1/2 bg-white/10 rounded-md mb-8" />

          {/* Tabs */}
          <div className="flex gap-3 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-10 w-28 bg-white/10 rounded-lg" />
            ))}
          </div>

          {/* Tab Content */}
          <div className="w-full h-72 md:h-96 bg-white/5 rounded-2xl" />
        </div>
      </div>

      {/* Transition */}
      <div className="h-24 md:h-32 bg-gradient-to-b from-black to-slate-950" />

      {/* Integrations Section Skeleton */}
      <div className="bg-slate-950 py-16 px-4">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <div className="h-8 md:h-10 w-1/2 bg-white/10 rounded-lg mb-4" />
          <div className="h-4 w-2/3 bg-white/10 rounded-md mb-8" />
          <div className="grid grid-cols-3 md:grid-cols-5 gap-6 w-full max-w-2xl">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="h-16 w-16 mx-auto bg-white/10 rounded-xl"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Transition */}
      <div className="h-24 md:h-32 bg-gradient-to-b from-slate-950 to-black" />

      {/* Content Section Skeleton */}
      <div className="bg-black py-16 px-4">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8 items-center">
          <div className="flex-1 space-y-4">
            <div className="h-8 w-3/4 bg-white/10 rounded-lg" />
            <div className="h-4 w-full bg-white/10 rounded-md" />
            <div className="h-4 w-5/6 bg-white/10 rounded-md" />
            <div className="h-4 w-2/3 bg-white/10 rounded-md" />
          </div>
          <div className="flex-1 h-64 bg-white/5 rounded-2xl" />
        </div>
      </div>

      {/* Transition */}
      <div className="h-24 md:h-32 bg-gradient-to-b from-black to-slate-950" />

      {/* FAQ Skeleton */}
      <div className="bg-slate-950 py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="h-8 w-1/3 bg-white/10 rounded-lg mx-auto mb-8" />
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-14 w-full bg-white/10 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
