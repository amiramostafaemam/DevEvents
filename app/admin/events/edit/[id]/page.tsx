//app/admin/events/edit/[id]/page.tsx
import { notFound } from "next/navigation";
import connectDB from "@/lib/mongodb";
import Event, { IEventSerialized } from "@/database/event.model";
import { Types } from "mongoose";
import EditEventClient from "./EditEventClient";

interface EditEventPageProps {
  params: Promise<{ id: string }>;
}

const EditEventPage = async ({ params }: EditEventPageProps) => {
  const { id } = await params;

  try {
    if (!Types.ObjectId.isValid(id)) {
      return notFound();
    }

    await connectDB();
    const event = await Event.findById(id).lean();

    if (!event) {
      return notFound();
    }

    const eventData: IEventSerialized = {
      _id: event._id.toString(),
      title: event.title,
      slug: event.slug,
      description: event.description,
      overview: event.overview,
      image: event.image,
      location: event.location,
      date: event.date,
      time: event.time,
      mode: event.mode,
      audience: event.audience,
      agenda: event.agenda,
      organizer: event.organizer,
      tags: event.tags,
      createdAt: event.createdAt?.toISOString(),
      updatedAt: event.updatedAt?.toISOString(),
    };

    return <EditEventClient event={eventData} />;
  } catch (error) {
    console.error("Error loading event:", error);
    return notFound();
  }
};

export default EditEventPage;
