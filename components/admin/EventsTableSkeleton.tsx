import { Skeleton } from "@/components/ui/skeleton";

const EventsTableSkeleton = () => {
  return (
    <div className="bg-[#0D161A] rounded-xl border border-[#0D161A] overflow-hidden animate-pulse">
      {/* Search Bar Skeleton */}
      <div className="p-6 border-b border-[#243B47] bg-[#0D161A]">
        <Skeleton className="h-7 w-48 mb-2" />
        <Skeleton className="h-12 w-full mt-3 rounded-xl" />
      </div>

      {/* Table Skeleton */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#182830]">
            <tr>
              {[
                "Events",
                "Location",
                "Date",
                "Mode",
                "Bookings",
                "Status",
                "Actions",
              ].map((header, index) => (
                <th key={index} className="text-left px-6 py-4">
                  <Skeleton className="h-4 w-20" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {Array.from({ length: 5 }).map((_, rowIndex) => (
              <tr
                key={rowIndex}
                className="hover:bg-[#112029] transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-12 h-12 rounded-lg" />
                    <Skeleton className="h-5 w-32" />
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Skeleton className="h-4 w-24" />
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Skeleton className="h-6 w-20 rounded-full" />
                </td>
                <td className="px-6 py-4">
                  <Skeleton className="h-4 w-8" />
                </td>
                <td className="px-6 py-4">
                  <Skeleton className="h-6 w-16 rounded-full" />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Skeleton className="w-8 h-8 rounded-lg" />
                    <Skeleton className="w-8 h-8 rounded-lg" />
                    <Skeleton className="w-8 h-8 rounded-lg" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Skeleton */}
      <div className="flex items-center justify-between p-6 border-t border-[#243B47]">
        <Skeleton className="h-11 w-24 rounded-lg" />
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-11 w-24 rounded-lg" />
      </div>
    </div>
  );
};

export default EventsTableSkeleton;
