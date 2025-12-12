// app/api/pending-events/[id]/approve/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import PendingEvent from "@/database/pending-event.model";
import Event from "@/database/event.model";
import { Types } from "mongoose";
import { revalidatePath } from "next/cache";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid ID format" },
        { status: 400 }
      );
    }

    // Find pending event
    const pendingEvent = await PendingEvent.findById(id);

    if (!pendingEvent) {
      return NextResponse.json(
        { success: false, message: "Pending event not found" },
        { status: 404 }
      );
    }

    // Copy to Event collection (approved)
    const eventData = pendingEvent.toObject();
    delete eventData._id; // Remove _id to create new document
    delete eventData.submittedBy; // Remove pending-specific fields
    delete eventData.__v;

    const approvedEvent = await Event.create(eventData);

    // Delete from PendingEvent collection
    await PendingEvent.findByIdAndDelete(id);

    // Revalidate pages
    revalidatePath("/");
    revalidatePath("/events");
    revalidatePath("/admin");

    return NextResponse.json({
      success: true,
      message: "Event approved successfully",
      event: approvedEvent,
    });
  } catch (error: unknown) {
    console.error("Error approving event:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
