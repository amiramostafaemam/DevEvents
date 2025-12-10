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
      console.error("Invalid MongoDB ID format:", id);
      return notFound();
    }

    await connectDB();

    const event = await Event.findById(id).lean();

    if (!event) {
      console.error("Event not found:", id);
      return notFound();
    }

    // Convert MongoDB document to plain object with string _id
    const eventData = {
      ...event,
      _id: event._id.toString(),
      createdAt: event.createdAt?.toISOString(),
      updatedAt: event.updatedAt?.toISOString(),
    };

    // console.log("Event loaded for editing:", eventData._id);

    return <EventForm event={eventData as any} />;
  } catch (error) {
    // console.error("Error fetching event for edit:", error);
    return notFound();
  }
};

export default EditEventPage;
