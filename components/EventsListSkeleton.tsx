import EventCardSkeleton from "./EventCardSkeleton";

interface EventsListSkeletonProps {
  count?: number;
}

const EventsListSkeleton = ({ count = 6 }: EventsListSkeletonProps) => {
  return (
    <ul className="events">
      {Array.from({ length: count }).map((_, index) => (
        <li key={index} className="list-none animate-pulse">
          <EventCardSkeleton />
        </li>
      ))}
    </ul>
  );
};

export default EventsListSkeleton;
