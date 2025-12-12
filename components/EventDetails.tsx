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
import { Hourglass } from "lucide-react";

const toTitleCase = (str: string): string => {
  if (!str || str.trim() === "") return "";
  return str
    .trim()
    .toLowerCase()
    .split(" ")
    .map((word) => (word ? word.charAt(0).toUpperCase() + word.slice(1) : ""))
    .join(" ");
};

const capitalize = (str: string): string => {
  if (!str || str.trim() === "") return "";
  return str.trim().charAt(0).toUpperCase() + str.trim().slice(1).toLowerCase();
};

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
      <p>{toTitleCase(label)}</p>
    </div>
  );
};

const EventAgenda = ({ agenda }: { agenda: string[] }) => {
  if (!agenda || agenda.length === 0) return null;

  return (
    <div className="agenda">
      <h2>Agenda</h2>
      <ul>
        {agenda.map((item, index) => (
          <li key={`${item}-${index}`}>{capitalize(item)}</li>
        ))}
      </ul>
    </div>
  );
};

const EventTags = ({ tags }: { tags: string[] }) => {
  if (!tags || tags.length === 0) return null;

  return (
    <div className="flex flex-row gap-1.5 flex-wrap">
      {tags.map((tag, index) => (
        <div key={`${tag}-${index}`} className="pill">
          {toTitleCase(tag)}
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
          {toTitleCase(aud)}
        </div>
      ))}
    </div>
  );
};

const EventDetails = async ({ params }: { params: Promise<string> }) => {
  const slug = await params;

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

  const bookings = isPending ? 0 : await getBookingCount(String(event._id));

  const similarEvents: IEvent[] = await getSimilarEventsBySlug(slug);

  return (
    <section id="event">
      {isPending && (
        <div className="bg-transparent border-transparent rounded-xl py-3 px-2 mb-3 flex items-center justify-center gap-2 animate-pulse mx-auto w-1/2">
          <Hourglass size={25} className="text-amber-200" />

          <p className="font-bold tracking-wide text-3xl text-amber-200">
            This event is pending approval
          </p>
        </div>
      )}

      <div className="header">
        <h1>{toTitleCase(title)}</h1>
        <p>{toTitleCase(overview)}</p>
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
            <p>{toTitleCase(description)}</p>
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
            <p>{capitalize(organizer)}</p>
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
