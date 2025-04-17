const SkeletonFeedbackPage = () => (
  <div className="space-y-8 animate-pulse">
    {/* Header section */}
    <div className="flex flex-row gap-4 justify-between items-center">
      <div className="flex flex-row gap-4 items-center max-sm:flex-col">
        <div className="flex flex-row gap-4 items-center">
          {/* Avatar */}
          <div className="rounded-full bg-gray-600 size-[40px]" />
          {/* Title */}
          <div className="h-6 w-48 bg-gray-600 rounded" />
        </div>
        {/* Tech icons */}
        <div className="flex flex-row gap-2 ml-4">
          <div className="w-8 h-8 bg-gray-600 rounded-full" />
          <div className="w-8 h-8 bg-gray-600 rounded-full" />
        </div>
      </div>
      {/* Type badge */}
      <div className="bg-gray-600 px-8 py-3 rounded-lg h-8 w-28" />
    </div>

    {/* Overall Impression */}
    <div className="flex flex-row gap-8 items-center mt-8">
      <div className="w-8 h-8 bg-gray-600 rounded" />
      <div className="w-32 h-6 bg-gray-600 rounded" />
      <div className="w-8 h-8 bg-gray-600 rounded" />
      <div className="w-32 h-6 bg-gray-600 rounded" />
    </div>

    {/* Breakdown Title */}
    <div className="h-8 w-80 bg-gray-600 rounded mt-10" />

    {/* Breakdown Sections */}
    {[1, 2, 3].map((i) => (
      <div key={i} className="space-y-2">
        {/* Section title */}
        <div className="h-6 w-64 bg-gray-600 rounded" />
        {/* Section body */}
        <div className="h-4 w-full bg-gray-600 rounded" />
        <div className="h-4 w-5/6 bg-gray-600 rounded" />
        <div className="h-4 w-4/6 bg-gray-600 rounded" />
      </div>
    ))}
  </div>
);

export default SkeletonFeedbackPage;
