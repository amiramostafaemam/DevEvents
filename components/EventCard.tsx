// components/EventCard.tsx
import Image from "next/image";
import Link from "next/link";

interface Props {
  title: string;
  image: string;
  slug: string;
  location: string;
  date: string;
  time: string;
  updatedAt?: Date | string;
}

const EventCard = ({
  title,
  image,
  slug,
  location,
  date,
  time,
  updatedAt,
}: Props) => {
  // Safely handle date parsing to avoid Suspense boundary issues
  let cacheKey = "";
  if (updatedAt) {
    try {
      const dateObj =
        typeof updatedAt === "string" ? new Date(updatedAt) : updatedAt;
      if (!isNaN(dateObj.getTime())) {
        cacheKey = dateObj.getTime().toString();
      }
    } catch (e) {
      // Silently fail if date parsing fails
      cacheKey = "";
    }
  }
  const imageUrl = cacheKey ? `${image}?v=${cacheKey}` : image;

  return (
    <Link href={`/events/${slug}`} id="event-card">
      <Image
        src={imageUrl}
        alt={title}
        width={410}
        height={300}
        className="poster"
        quality={85}
        loading="lazy"
      />
      <div className="flex flex-row gap-2">
        <Image src="/icons/pin.svg" alt="Location" width={14} height={14} />
        <p>{location}</p>
      </div>
      <p className="title capitalize">{title}</p>
      <div className="datetime">
        <div>
          <Image src="/icons/calendar.svg" alt="Date" width={14} height={14} />
          <p>{date}</p>
        </div>
        <div>
          <Image src="/icons/clock.svg" alt="Time" width={14} height={14} />
          <p>{time}</p>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
