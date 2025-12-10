// app/admin/events/edit/[id]/page.tsx
import { notFound } from "next/navigation";
import connectDB from "@/lib/mongodb";
import Event from "@/database/event.model";
import EventForm from "@/components/EventForm";
import { Types } from "mongoose";

interface EditEventPageProps {
  params: Promise<{ id: string }>;
}

const EditEventPage = async ({ params }: EditEventPageProps) => {
  const { id } = await params;

  try {
    // Validate MongoDB ObjectId format
    if (!Types.ObjectId.isValid(id)) {
      return notFound();
    }

    await connectDB();

    const event = await Event.findById(id).lean();

    if (!event) {
      return notFound();
    }

    // Convert MongoDB document to plain object with string _id
    const eventData = {
      ...event,
      _id: event._id.toString(),
      createdAt: event.createdAt?.toISOString(),
      updatedAt: event.updatedAt?.toISOString(),
    };

    return <EventForm event={eventData as any} />;
  } catch (error) {
    return notFound();
  }
};

export default EditEventPage;
