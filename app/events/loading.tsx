import EventsListSkeleton from "@/components/EventsListSkeleton";

export default function EventsLoading() {
  return (
    <section>
      <div className="space-y-7 animate-pulse">
        <h1 className="text-center">Featured Events</h1>
        <EventsListSkeleton count={6} />
      </div>
    </section>
  );
}
