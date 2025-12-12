import { Skeleton } from "@/components/ui/skeleton";

const EventsStatsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="bg-[#182830] rounded-xl p-6 border border-[#182830]"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-8 w-16" />
            </div>
            <Skeleton className="w-12 h-12 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default EventsStatsSkeleton;
