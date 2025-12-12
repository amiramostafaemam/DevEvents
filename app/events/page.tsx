// app/events/page.tsx
import EventCard from "@/components/EventCard";
import EventsListSkeleton from "@/components/EventsListSkeleton";
import { IEvent } from "@/database/event.model";
import { cacheLife } from "next/cache";
import { Suspense } from "react";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

// Separate async component for events list
async function EventsList() {
  "use cache";
  cacheLife("hours");
  const response = await fetch(`${BASE_URL}/api/events`, {});
  const { events } = await response.json();

  if (!events || events.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400">No events available at the moment.</p>
      </div>
    );
  }

  return (
    <ul className="events">
      {events.map((event: IEvent) => (
        <li key={event.title} className="list-none capitalize">
          <EventCard {...event} />
        </li>
      ))}
    </ul>
  );
}

const Page = () => {
  return (
    <section>
      <div className="space-y-7">
        <h1 className="text-center">Featured Events</h1>
        <Suspense fallback={<EventsListSkeleton count={6} />}>
          <EventsList />
        </Suspense>
      </div>
    </section>
  );
};

export default Page;
