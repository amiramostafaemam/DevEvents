// app/api/pending-events/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import PendingEvent from "@/database/pending-event.model";
import { Types } from "mongoose";
import { revalidatePath } from "next/cache";

export async function DELETE(
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

    const deletedEvent = await PendingEvent.findByIdAndDelete(id);

    if (!deletedEvent) {
      return NextResponse.json(
        { success: false, message: "Pending event not found" },
        { status: 404 }
      );
    }

    // Revalidate pages
    revalidatePath("/");
    revalidatePath("/events");
    revalidatePath("/admin");

    return NextResponse.json({
      success: true,
      message: "Event rejected and deleted successfully",
    });
  } catch (error: unknown) {
    console.error("Error rejecting event:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
