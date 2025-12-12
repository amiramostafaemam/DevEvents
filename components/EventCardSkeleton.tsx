import { Skeleton } from "@/components/ui/skeleton";

const EventCardSkeleton = () => {
  return (
    <div className="space-y-3 animate-pulse">
      {/* Image Skeleton */}
      <Skeleton className="w-full h-[300px] rounded-lg" />

      {/* Location Skeleton */}
      <div className="flex items-center gap-2">
        <Skeleton className="w-3.5 h-3.5 rounded-full" />
        <Skeleton className="h-4 w-24" />
      </div>

      {/* Title Skeleton */}
      <Skeleton className="h-6 w-3/4" />

      {/* Date and Time Skeleton */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Skeleton className="w-3.5 h-3.5 rounded-full" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="w-3.5 h-3.5 rounded-full" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </div>
  );
};

export default EventCardSkeleton;
