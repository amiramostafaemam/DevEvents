"use server";
import Event from "@/database/event.model";
import connectDB from "@/lib/mongodb";
import { IEvent } from "@/database/event.model";
import { unstable_noStore } from "next/cache";

export const getSimilarEventsBySlug = async (slug: string) => {
  unstable_noStore();
  try {
    await connectDB();
    const event = await Event.findOne({ slug });

    return await Event.find({
      _id: { $ne: event._id },
      tags: { $in: event.tags },
    }).lean();
  } catch (error) {
    return [];
  }
};
export async function getAllEvents(): Promise<IEvent[]> {
  unstable_noStore();
  try {
    await connectDB();

    const events = await Event.find({}).sort({ createdAt: -1 }).lean();

    return JSON.parse(JSON.stringify(events));
  } catch (error) {
    return [];
  }
}

export async function deleteEvent(id: string): Promise<boolean> {
  unstable_noStore();
  try {
    await connectDB();

    const result = await Event.findByIdAndDelete(id);

    return !!result;
  } catch (error) {
    return false;
  }
}
