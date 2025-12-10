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
    console.error("POST /api/bookings error:", error);

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

    // ✅ استخدم countDocuments بدل من find().length
    // ده أسرع وأدق وميحملش الـ documents كلها في الـ memory
    const count = await Booking.countDocuments(query);

    // لو محتاج الـ data كمان (للـ admin panel مثلاً)
    const bookings = await Booking.find(query)
      .populate("eventId", "title slug date")
      .sort({ createdAt: -1 });

    // ✅ فلتر أي bookings لـ events محذوفة
    const validBookings = bookings.filter(
      (booking) => booking.eventId !== null
    );

    return NextResponse.json({
      success: true,
      count: validBookings.length,
      data: validBookings,
    });
  } catch (error) {
    console.error("GET /api/bookings error:", error);

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
