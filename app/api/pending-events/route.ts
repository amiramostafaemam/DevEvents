// app/api/pending-events/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import PendingEvent from "@/database/pending-event.model";

export async function GET() {
  try {
    await connectDB();

    const pendingEvents = await PendingEvent.find({}).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      count: pendingEvents.length,
      events: pendingEvents,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
