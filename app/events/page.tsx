import EventCard from "@/components/EventCard";
import { IEvent } from "@/database/event.model";
import { cacheLife } from "next/cache";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const Page = async () => {
  "use cache";
  cacheLife("hours");
  const response = await fetch(`${BASE_URL}/api/events`, {});

  const { events } = await response.json();
  return (
    <section>
      <div className="space-y-7">
        <h1 className="text-center ">Featured Events</h1>
        <ul className="events">
          {events &&
            events.length > 0 &&
            events.map((event: IEvent) => (
              <li key={event.title} className="list-none">
                <EventCard {...event} />
              </li>
            ))}
        </ul>
      </div>
    </section>
  );
};

export default Page;
