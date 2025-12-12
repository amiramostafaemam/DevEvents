// components/EventDetails.tsx
import EventCard from "@/components/EventCard";
import { IEvent } from "@/database/event.model";
import {
  getEventBySlug,
  getSimilarEventsBySlug,
} from "@/lib/actions/event.actions";
import { getBookingCount } from "@/lib/actions/booking.actions";
import Image from "next/image";
import { notFound } from "next/navigation";
import BookingSection from "./BookingSection";

const EventDetailItem = ({
  icon,
  alt,
  label,
}: {
  icon: string;
  alt: string;
  label: string;
}) => {
  return (
    <div className="flex-row-gap-2 items-center">
      <Image src={icon} alt={alt} width={17} height={17} />
      <p>{label}</p>
    </div>
  );
};

const EventAgenda = ({ agenda }: { agenda: string[] }) => {
  return (
    <div className="agenda">
      <h2>Agenda</h2>
      <ul>
        {agenda.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

const EventTags = ({ tags }: { tags: string[] }) => {
  return (
    <div className="flex flex-row gap-1.5 flex-wrap">
      {tags.map((tag) => (
        <div key={tag} className="pill">
          {tag}
        </div>
      ))}
    </div>
  );
};

const EventAudience = ({ audience }: { audience: string[] | string }) => {
  const audienceArray = Array.isArray(audience)
    ? audience
    : typeof audience === "string"
    ? audience.split(",").map((item) => item.trim())
    : [];

  if (audienceArray.length === 0) return null;

  return (
    <div className="flex flex-row gap-1.5 flex-wrap">
      {audienceArray.map((aud, index) => (
        <div key={`${aud}-${index}`} className="pill">
          {aud}
        </div>
      ))}
    </div>
  );
};

const EventDetails = async ({ params }: { params: Promise<string> }) => {
  const slug = await params;

  // Directly query database using server action (more efficient than API call)
  const result = await getEventBySlug(slug);

  if (!result || !result.event) {
    return notFound();
  }

  const event = result.event;
  const isPending = result.isPending;

  const {
    description,
    image,
    overview,
    date,
    time,
    location,
    mode,
    agenda,
    audience,
    organizer,
    tags,
    title,
  } = event;

  if (!description) return notFound();

  // Only get booking count for approved events (not pending)
  const bookings = isPending ? 0 : await getBookingCount(String(event._id));

  // Always fetch similar events (works for both approved and pending events)
  // Similar events will only include approved events from Event collection
  const similarEvents: IEvent[] = await getSimilarEventsBySlug(slug);

  return (
    <section id="event">
      {isPending && (
        <div className=" rounded-lg mb-3">
          <p className="text-yellow-400 text-center font-medium">
            ⏳ This event is pending approval
          </p>
        </div>
      )}

      <div className="header">
        <h1 className="capitalize">{title}</h1>
        <p>{overview}</p>
      </div>
      <div className="details">
        {/* left side - Event Content */}
        <div className="content">
          <Image
            src={image}
            alt="Event Banner"
            width={800}
            height={800}
            className="banner"
            quality={85}
            priority
          />
          <section className="flex-col-gap-2">
            <h2>Description</h2>
            <p>{description}</p>
          </section>
          <section className="flex-col-gap-2">
            <h2>Event Details</h2>
            <EventDetailItem
              icon="/icons/calendar.svg"
              alt="Calendar Icon"
              label={date}
            />
            <EventDetailItem
              icon="/icons/clock.svg"
              alt="Clock Icon"
              label={time}
            />
            <EventDetailItem
              icon="/icons/pin.svg"
              alt="Pin Icon"
              label={location}
            />
            <EventDetailItem
              icon="/icons/mode.svg"
              alt="Mode Icon"
              label={mode}
            />
          </section>

          <section className="flex-col-gap-2">
            <h2>Target Audience</h2>
            <EventAudience audience={audience} />
          </section>

          <EventAgenda agenda={agenda} />

          <section className="flex-col-gap-2">
            <h2>About the Organizer</h2>
            <p>{organizer}</p>
          </section>

          <EventTags tags={tags} />
        </div>

        {/* Only show BookingSection if NOT pending */}
        {!isPending && (
          <BookingSection
            eventId={String(event._id)}
            initialBookingCount={bookings}
          />
        )}
      </div>

      {/* Show similar events for all events (approved and pending) */}
      {similarEvents.length > 0 && (
        <div className="flex w-full flex-col gap-4 pt-20">
          <h2>Similar Events</h2>
          <div className="events">
            {similarEvents.map((similarEvent: IEvent) => (
              <EventCard
                key={similarEvent.title.toString()}
                {...similarEvent}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default EventDetails;
