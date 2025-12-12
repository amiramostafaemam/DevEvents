// lib/actions/event.actions.ts
"use server";
import Event from "@/database/event.model";
import PendingEvent from "@/database/pending-event.model";
import connectDB from "@/lib/mongodb";
import { IEvent } from "@/database/event.model";
import { IPendingEvent } from "@/database/pending-event.model";
import { unstable_noStore } from "next/cache";

/**
 * Get event by slug - checks both Event and PendingEvent collections
 * Returns event with isPending flag if found in PendingEvent collection
 */
export const getEventBySlug = async (slug: string) => {
  unstable_noStore();
  try {
    await connectDB();

    // First try to find in Event collection (approved events)
    const approvedEvent = await Event.findOne({ slug }).lean();

    if (approvedEvent) {
      return {
        event: JSON.parse(JSON.stringify(approvedEvent)),
        isPending: false,
      };
    }

    // If not found in Event, check PendingEvent collection
    const pendingEvent = await PendingEvent.findOne({ slug }).lean();

    if (pendingEvent) {
      return {
        event: JSON.parse(JSON.stringify(pendingEvent)),
        isPending: true,
      };
    }

    return null;
  } catch (error) {
    return null;
  }
};

/**
 * Get similar events by slug (for public event detail page)
 * Works for both approved and pending events
 * Only returns approved events from Event collection (similar events are always approved)
 */
export const getSimilarEventsBySlug = async (slug: string) => {
  unstable_noStore();
  try {
    await connectDB();

    // First try to find in Event collection (approved events)
    const approvedEvent = await Event.findOne({ slug });

    // If not found in Event, check PendingEvent collection
    const pendingEvent = approvedEvent
      ? null
      : await PendingEvent.findOne({ slug });

    // Use whichever event was found (approved or pending)
    const event = approvedEvent || pendingEvent;

    if (!event) return [];

    // Only return approved events (from Event collection) as similar events
    // This ensures similar events are always approved, even when viewing a pending event
    return await Event.find({
      _id: { $ne: event._id },
      tags: { $in: event.tags },
    }).lean();
  } catch {
    return [];
  }
};

/**
 * Get ALL APPROVED events (from Event collection only)
 * This is for admin dashboard to show approved events table
 */
export async function getAllEvents(): Promise<IEvent[]> {
  unstable_noStore();
  try {
    await connectDB();

    // Get only from Event collection (all events here are approved)
    const events = await Event.find({}).sort({ createdAt: -1 }).lean();

    return JSON.parse(JSON.stringify(events));
  } catch (error) {
    return [];
  }
}

/**
 * Get only PENDING events (from PendingEvent collection)
 * For admin dashboard pending events section
 */
export async function getPendingEvents(): Promise<IPendingEvent[]> {
  unstable_noStore();
  try {
    await connectDB();

    const events = await PendingEvent.find({}).sort({ createdAt: -1 }).lean();

    return JSON.parse(JSON.stringify(events));
  } catch (error) {
    return [];
  }
}

/**
 * Get only APPROVED events (for public pages)
 * Same as getAllEvents since Event collection only has approved events
 */
export async function getApprovedEvents(): Promise<IEvent[]> {
  unstable_noStore();
  try {
    await connectDB();

    // Get from Event collection (all approved)
    const events = await Event.find({}).sort({ createdAt: -1 }).lean();

    return JSON.parse(JSON.stringify(events));
  } catch (error) {
    return [];
  }
}

/**
 * Delete an approved event (from Event collection)
 */
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

/**
 * Delete a pending event (from PendingEvent collection)
 */
export async function deletePendingEvent(id: string): Promise<boolean> {
  unstable_noStore();
  try {
    await connectDB();

    const result = await PendingEvent.findByIdAndDelete(id);

    return !!result;
  } catch (error) {
    return false;
  }
}
