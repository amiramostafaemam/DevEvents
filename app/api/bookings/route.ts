// app/api/bookings/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Booking from "@/database/booking.model";
import Event from "@/database/event.model";

// Create a new booking
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { eventId, email } = await req.json();

    // Validation
    if (!eventId || !email) {
      return NextResponse.json(
        { success: false, error: "Event ID and email are required" },
        { status: 400 }
      );
    }

    // Check if event exists
    const event = await Event.findById(eventId);

    if (!event) {
      return NextResponse.json(
        { success: false, error: "Event not found" },
        { status: 404 }
      );
    }

    // Check if user already booked this event
    const existingBooking = await Booking.findOne({ eventId, email });

    if (existingBooking) {
      return NextResponse.json(
        { success: false, error: "You have already booked this event" },
        { status: 400 }
      );
    }

    // Create booking
    const booking = await Booking.create({ eventId, email });

    return NextResponse.json(
      {
        success: true,
        message: "Event booked successfully",
        data: booking,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to create booking",
      },
      { status: 500 }
    );
  }
}

// Get all bookings (for admin)
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get("eventId");

    let query = {};

    if (eventId) {
      query = { eventId };
    }

    const count = await Booking.countDocuments(query);

    const bookings = await Booking.find(query)
      .populate("eventId", "title slug date")
      .sort({ createdAt: -1 });

    const validBookings = bookings.filter(
      (booking) => booking.eventId !== null
    );

    return NextResponse.json({
      success: true,
      count: validBookings.length,
      data: validBookings,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to fetch bookings",
      },
      { status: 500 }
    );
  }
}
