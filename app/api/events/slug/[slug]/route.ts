// app/api/events/slug/[slug]/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Event from "@/database/event.model";
import PendingEvent from "@/database/pending-event.model";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();
    const { slug } = await params;

    // First try to find in Event collection (approved events)
    let event = await Event.findOne({ slug });

    // If not found in Event, check PendingEvent collection
    if (!event) {
      event = await PendingEvent.findOne({ slug });

      if (event) {
        // Mark as pending so frontend knows
        return NextResponse.json({
          success: true,
          event: {
            ...event.toObject(),
            isPending: true,
          },
        });
      }
    }

    if (!event) {
      return NextResponse.json(
        { success: false, message: "Event not found" },
        { status: 404 }
      );
    }

    // Convert Mongoose document to plain object for consistency
    return NextResponse.json({ success: true, event: event.toObject() });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
