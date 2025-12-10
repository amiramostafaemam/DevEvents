"use server";

import Booking from "@/database/booking.model";
import connectDB from "@/lib/mongodb";

export async function getBookingsCount(eventId: string): Promise<number> {
  try {
    await connectDB();

    const count = await Booking.countDocuments({ eventId });

    return count;
  } catch (error) {
    return 0;
  }
}

export async function getAllBookingsCount(): Promise<number> {
  try {
    await connectDB();

    const count = await Booking.countDocuments();

    return count;
  } catch (error) {
    return 0;
  }
}

export async function getEventBookings(eventId: string) {
  try {
    await connectDB();

    const bookings = await Booking.find({ eventId })
      .sort({ createdAt: -1 })
      .lean();

    return JSON.parse(JSON.stringify(bookings));
  } catch (error) {
    return [];
  }
}

export async function deleteEventBookings(eventId: string): Promise<number> {
  try {
    await connectDB();

    const result = await Booking.deleteMany({ eventId });

    return result.deletedCount;
  } catch (error) {
    return 0;
  }
}

export const getBookingCount = async (eventId: string): Promise<number> => {
  try {
    await connectDB();

    const count = await Booking.countDocuments({ eventId });

    return count;
  } catch (error) {
    return 0;
  }
};
