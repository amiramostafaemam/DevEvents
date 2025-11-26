import EventCard from "@/components/EventCard";
import ExploreBtn from "@/components/ExploreBtn";
import { IEvent } from "@/database/event.model";

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

const Home = async () => {
  let events: IEvent[] = [];

  try {
    const response = await fetch(`${BASE_URL}/api/events`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch events: ${response.status}`);
    }

    const result = await response.json();

    // Handle both response formats
    events = result.data || result.events || [];
  } catch (error) {
    console.error("Error fetching events:", error);
    // Don't throw - just show empty state
  }

  return (
    <section>
      <h1 className="text-center">
        The Hub for Every Dev <br /> Event You Can&apos;t Miss
      </h1>
      <p className="text-center mt-5">
        Hackathons, Meetups, and Conferences, All in One Place
      </p>
      <ExploreBtn />
      <div className="mt-20 space-y-7">
        <h3>Featured Events</h3>
        {events && events.length > 0 ? (
          <ul className="events">
            {events.map((event: IEvent) => (
              <li
                key={event._id?.toString() || event.slug}
                className="list-none"
              >
                <EventCard {...event} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500">
            No events available at the moment
          </p>
        )}
      </div>
    </section>
  );
};

export default Home;
