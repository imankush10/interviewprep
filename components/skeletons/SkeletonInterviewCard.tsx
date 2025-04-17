const SkeletonInterviewCard = () => (
  <div className="card-border w-[360px] max-sm:w-full min-h-96 animate-pulse">
    <div className="card-interview relative flex flex-col items-center px-6 py-8">
      {/* Badge */}
      <div className="absolute top-0 right-0 w-fit px-4 py-2 rounded-bl-lg bg-gray-600 h-7">
        <div className="w-14 h-4 bg-gray-600 rounded" />
      </div>

      {/* Logo */}
      <div className="rounded-full bg-gray-600 size-[90px] mt-2" />

      {/* Title */}
      <div className="mt-5 w-3/4 h-6 bg-gray-600 rounded" />
      <div className="mt-2 w-2/4 h-4 bg-gray-600 rounded" />

      {/* Date and Score */}
      <div className="flex flex-row gap-5 mt-3 w-full justify-center">
        <div className="flex flex-row gap-2 items-center">
          <div className="w-6 h-6 bg-gray-600 rounded" />
          <div className="w-16 h-4 bg-gray-600 rounded" />
        </div>
        <div className="flex flex-row gap-2 items-center">
          <div className="w-6 h-6 bg-gray-600 rounded" />
          <div className="w-12 h-4 bg-gray-600 rounded" />
        </div>
      </div>

      {/* Feedback */}
      <div className="mt-5 w-full h-4 bg-gray-600 rounded" />
      <div className="mt-2 w-3/4 h-4 bg-gray-600 rounded" />

      {/* Tech + Button */}
      <div className="flex flex-row justify-between items-center w-full mt-6">
        <div className="w-10 h-10 bg-gray-600 rounded-full" />
        <div className="w-28 h-10 bg-gray-600 rounded" />
      </div>
    </div>
  </div>
);

export default SkeletonInterviewCard;
