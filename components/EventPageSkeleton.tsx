const EventPageSkeleton = () => {
  return (
    <section className="animate-pulse space-y-10">
      {/* Hero Image */}
      <div className="w-full h-80 bg-gray-300 rounded-xl"></div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
        {/* LEFT SECTION */}
        <div className="md:col-span-8 space-y-8">
          {/* Title */}
          <div className="h-6 bg-gray-300 rounded w-1/3"></div>

          {/* Overview */}
          <div className="space-y-3">
            <div className="h-4 bg-gray-300 rounded w-2/3"></div>
            <div className="h-4 bg-gray-300 rounded w-full"></div>
            <div className="h-4 bg-gray-300 rounded w-5/6"></div>
          </div>

          {/* Event Details */}
          <div className="space-y-4">
            <div className="h-5 bg-gray-300 rounded w-1/4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            <div className="h-4 bg-gray-300 rounded w-1/3"></div>
            <div className="h-4 bg-gray-300 rounded w-2/5"></div>
          </div>

          {/* Agenda */}
          <div className="space-y-4">
            <div className="h-5 bg-gray-300 rounded w-1/4"></div>

            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-3 bg-gray-300 rounded w-full"></div>
            ))}
          </div>

          {/* About */}
          <div className="space-y-3">
            <div className="h-5 bg-gray-300 rounded w-1/4"></div>
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 rounded w-full"></div>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="md:col-span-4 space-y-4 p-5 border rounded-xl bg-gray-100">
          <div className="h-5 bg-gray-300 rounded w-1/2"></div>

          <div className="h-4 bg-gray-300 rounded w-full"></div>

          <div className="h-10 bg-gray-300 rounded w-full"></div>

          <div className="h-10 bg-gray-300 rounded w-full mt-4"></div>
        </div>
      </div>

      {/* Similar Events */}
      <div className="space-y-5">
        <div className="h-6 bg-gray-300 rounded w-1/4"></div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="w-full h-40 bg-gray-300 rounded-xl"></div>
              <div className="h-4 bg-gray-300 rounded w-2/3"></div>
              <div className="h-3 bg-gray-300 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventPageSkeleton;
