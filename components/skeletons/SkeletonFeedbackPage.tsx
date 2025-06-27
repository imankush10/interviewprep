const SkeletonFeedbackPage = () => (
  <div className="min-h-screen bg-black relative overflow-hidden">
    {/* Background elements */}
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute -inset-10 opacity-15 bg-gradient-to-br from-purple-500/10 to-blue-500/10" />
    </div>
    
    {/* Grid pattern overlay */}
    <div className="absolute inset-0 opacity-[0.02]">
      <div className="h-full w-full bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:80px_80px]" />
    </div>

    <div className="relative z-10 container mx-auto px-4 py-12 max-w-7xl animate-pulse">
      {/* Header Section */}
      <div className="text-center mb-12">
        {/* Status badge */}
        <div className="inline-flex items-center space-x-3 bg-white/[0.08] border border-white/20 rounded-full px-6 py-3 backdrop-blur-xl mb-6">
          <div className="w-5 h-5 bg-gray-600 rounded" />
          <div className="w-5 h-5 bg-gray-600 rounded" />
          <div className="w-32 h-4 bg-gray-600 rounded" />
        </div>

        {/* Main title */}
        <div className="h-12 lg:h-16 w-96 bg-gray-600 rounded mx-auto mb-4" />
        
        {/* Subtitle */}
        <div className="h-6 w-64 bg-gray-600 rounded mx-auto" />
      </div>

      {/* Two-Section Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
        {/* Left Section - Analytics & Graphs */}
        <div className="space-y-8">
          {/* Overall Score Card */}
          <div className="bg-white/[0.05] backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              {/* Score Circle */}
              <div className="flex-shrink-0">
                <div className="w-32 h-32 bg-gray-600 rounded-full" />
              </div>
              
              <div className="flex-1 text-center lg:text-left space-y-4">
                <div className="h-8 w-64 bg-gray-600 rounded" />
                <div className="h-6 w-80 bg-gray-600 rounded" />
                
                <div className="flex items-center justify-center lg:justify-start gap-4">
                  <div className="w-4 h-4 bg-gray-600 rounded" />
                  <div className="w-40 h-4 bg-gray-600 rounded" />
                </div>
              </div>
            </div>
          </div>

          {/* Radar Chart */}
          <div className="bg-white/[0.05] backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-6 h-6 bg-gray-600 rounded" />
              <div className="h-6 w-48 bg-gray-600 rounded" />
            </div>
            
            <div className="flex justify-center">
              <div className="w-48 h-48 bg-gray-600 rounded-full" />
            </div>
          </div>

          {/* Performance Trends */}
          <div className="bg-white/[0.05] backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-6 h-6 bg-gray-600 rounded" />
              <div className="h-6 w-40 bg-gray-600 rounded" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-black/20 rounded-xl p-4 text-center space-y-2">
                  <div className="h-8 w-12 bg-gray-600 rounded mx-auto" />
                  <div className="h-4 w-20 bg-gray-600 rounded mx-auto" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Section - Detailed Feedback */}
        <div className="space-y-8">
          {/* Detailed AI Feedback */}
          <div className="bg-white/[0.05] backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-6 h-6 bg-gray-600 rounded" />
              <div className="h-6 w-48 bg-gray-600 rounded" />
            </div>
            
            <div className="bg-gradient-to-br from-black/30 to-black/10 rounded-xl p-6 border border-white/10">
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-gray-600 rounded-full" />
                  <div className="w-40 h-4 bg-gray-600 rounded" />
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="h-4 w-full bg-gray-600 rounded" />
                <div className="h-4 w-5/6 bg-gray-600 rounded" />
                <div className="h-4 w-4/5 bg-gray-600 rounded" />
                <div className="h-4 w-full bg-gray-600 rounded" />
                <div className="h-4 w-3/4 bg-gray-600 rounded" />
              </div>
              
              <div className="mt-6 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <div className="w-32 h-4 bg-gray-600 rounded" />
                  <div className="w-40 h-4 bg-gray-600 rounded" />
                </div>
              </div>
            </div>
          </div>

          {/* Performance Breakdown with Bar Chart */}
          <div className="bg-white/[0.05] backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-6 h-6 bg-gray-600 rounded" />
              <div className="h-6 w-44 bg-gray-600 rounded" />
            </div>
            
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="w-24 h-4 bg-gray-600 rounded" />
                    <div className="w-12 h-4 bg-gray-600 rounded" />
                  </div>
                  <div className="relative h-3 bg-white/10 rounded-full overflow-hidden">
                    <div className="absolute left-0 top-0 h-full w-3/4 bg-gray-600 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Strengths and Improvements */}
          <div className="grid grid-cols-1 gap-6">
            {/* Strengths */}
            <div className="bg-white/[0.05] backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-6 h-6 bg-gray-600 rounded" />
                <div className="h-5 w-32 bg-gray-600 rounded" />
              </div>
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-green-500/10 rounded-xl border border-green-500/20">
                    <div className="w-4 h-4 bg-gray-600 rounded flex-shrink-0 mt-0.5" />
                    <div className="space-y-1 flex-1">
                      <div className="h-4 w-full bg-gray-600 rounded" />
                      <div className="h-4 w-3/4 bg-gray-600 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Areas for Improvement */}
            <div className="bg-white/[0.05] backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-6 h-6 bg-gray-600 rounded" />
                <div className="h-5 w-28 bg-gray-600 rounded" />
              </div>
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-orange-500/10 rounded-xl border border-orange-500/20">
                    <div className="w-4 h-4 bg-gray-600 rounded flex-shrink-0 mt-0.5" />
                    <div className="space-y-1 flex-1">
                      <div className="h-4 w-full bg-gray-600 rounded" />
                      <div className="h-4 w-2/3 bg-gray-600 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <div className="bg-white/[0.05] border border-white/20 rounded-xl h-12 w-48" />
        <div className="bg-gray-600 rounded-xl h-12 w-48" />
      </div>
    </div>
  </div>
);

export default SkeletonFeedbackPage;