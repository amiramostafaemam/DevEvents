// components/EventFormSkeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";

const EventFormSkeleton = () => {
  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Title Skeleton */}
      <Skeleton className="h-12 w-64 mx-auto mb-8 bg-[#182830]" />

      <div className="bg-[#0D161A] border-[#243B47] p-5 rounded-xl">
        <div className="space-y-6 px-4 py-3">
          {/* Event Title */}
          <div>
            <Skeleton className="h-5 w-24 mb-3 bg-[#182830]" />
            <Skeleton className="h-12 w-full bg-[#182830]" />
          </div>

          {/* Event Date */}
          <div>
            <Skeleton className="h-5 w-24 mb-3 bg-[#182830]" />
            <Skeleton className="h-12 w-full bg-[#182830]" />
          </div>

          {/* Event Time */}
          <div>
            <Skeleton className="h-5 w-24 mb-3 bg-[#182830]" />
            <Skeleton className="h-12 w-full bg-[#182830]" />
          </div>

          {/* Location */}
          <div>
            <Skeleton className="h-5 w-24 mb-3 bg-[#182830]" />
            <Skeleton className="h-12 w-full bg-[#182830]" />
          </div>

          {/* Event Mode */}
          <div>
            <Skeleton className="h-5 w-24 mb-3 bg-[#182830]" />
            <div className="flex gap-3">
              <Skeleton className="h-12 w-full bg-[#182830]" />
              <Skeleton className="h-12 w-full bg-[#182830]" />
              <Skeleton className="h-12 w-full bg-[#182830]" />
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <Skeleton className="h-5 w-48 mb-3 bg-[#182830]" />
            <Skeleton className="h-48 w-full bg-[#182830] rounded-xl" />
          </div>

          {/* Tags */}
          <div>
            <Skeleton className="h-5 w-16 mb-3 bg-[#182830]" />
            <div className="flex gap-2 mb-2">
              <Skeleton className="h-12 flex-1 bg-[#182830]" />
              <Skeleton className="h-12 w-20 bg-[#182830]" />
            </div>
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-8 w-20 bg-[#182830] rounded-full" />
              <Skeleton className="h-8 w-24 bg-[#182830] rounded-full" />
              <Skeleton className="h-8 w-16 bg-[#182830] rounded-full" />
            </div>
          </div>

          {/* Agenda */}
          <div>
            <Skeleton className="h-5 w-20 mb-3 bg-[#182830]" />
            <div className="flex gap-2 mb-2">
              <Skeleton className="h-12 flex-1 bg-[#182830]" />
              <Skeleton className="h-12 w-20 bg-[#182830]" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-12 w-full bg-[#182830] rounded-full" />
              <Skeleton className="h-12 w-full bg-[#182830] rounded-full" />
            </div>
          </div>

          {/* Target Audience */}
          <div>
            <Skeleton className="h-5 w-32 mb-3 bg-[#182830]" />
            <div className="flex gap-2 mb-2">
              <Skeleton className="h-12 flex-1 bg-[#182830]" />
              <Skeleton className="h-12 w-20 bg-[#182830]" />
            </div>
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-10 w-28 bg-[#182830] rounded-full" />
              <Skeleton className="h-10 w-24 bg-[#182830] rounded-full" />
            </div>
          </div>

          {/* Organizer */}
          <div>
            <Skeleton className="h-5 w-32 mb-3 bg-[#182830]" />
            <Skeleton className="h-12 w-full bg-[#182830]" />
          </div>

          {/* Overview */}
          <div>
            <Skeleton className="h-5 w-32 mb-3 bg-[#182830]" />
            <Skeleton className="h-24 w-full bg-[#182830]" />
          </div>

          {/* Description */}
          <div>
            <Skeleton className="h-5 w-36 mb-3 bg-[#182830]" />
            <Skeleton className="h-40 w-full bg-[#182830]" />
          </div>

          {/* Submit Button */}
          <div>
            <Skeleton className="h-14 w-full bg-[#182830] rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventFormSkeleton;
