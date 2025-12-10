//app/api/events/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Event from "@/database/event.model";
import { Types } from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import { revalidatePath } from "next/cache";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// GET single event
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid ID" },
        { status: 400 }
      );
    }

    const event = await Event.findById(id);

    if (!event) {
      return NextResponse.json(
        { success: false, message: "Event not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: event });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

// PUT - Update event
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log("=== PUT /api/events/[id] - Starting request ===");
    await connectDB();
    console.log("✓ Database connected");

    const { id } = await params;
    console.log("→ Event ID:", id);

    if (!Types.ObjectId.isValid(id)) {
      console.error("✗ Invalid ID format:", id);
      return NextResponse.json(
        { success: false, message: "Invalid ID format" },
        { status: 400 }
      );
    }

    const existingEvent = await Event.findById(id);
    if (!existingEvent) {
      console.error("✗ Event not found:", id);
      return NextResponse.json(
        { success: false, message: "Event not found" },
        { status: 404 }
      );
    }

    console.log("✓ Event found:", existingEvent.title);

    const formData = await req.formData();
    console.log("✓ FormData received");
    const updateData: Record<string, unknown> = {};

    // Extract fields (excluding audience - it's an array)
    const fields = [
      "title",
      "description",
      "overview",
      "location",
      "date",
      "time",
      "mode",
      "organizer",
    ];

    fields.forEach((field) => {
      const value = formData.get(field);
      if (value) {
        updateData[field] = value.toString();
        console.log(`✓ ${field}:`, updateData[field]);
      }
    });

    // ✅ Check for duplicate title if title is being changed
    if (updateData.title && updateData.title !== existingEvent.title) {
      console.log("→ Title is being changed, checking for duplicates...");
      const duplicateEvent = await Event.findOne({
        title: updateData.title,
        _id: { $ne: id }, // Exclude current event
      });

      if (duplicateEvent) {
        console.error("✗ Duplicate title found:", updateData.title);
        return NextResponse.json(
          {
            success: false,
            message: "Event creation failed",
            error: `E11000 duplicate key error collection: test.events index: slug_1 dup key: { slug: "${updateData.title}" }`,
          },
          { status: 500 }
        );
      }
      console.log("✓ No duplicate title found");
    }

    // Parse arrays
    console.log("→ Parsing array fields...");
    const tagsString = formData.get("tags");
    const agendaString = formData.get("agenda");
    const audienceString = formData.get("audience");

    console.log("Array strings received:", {
      tags: tagsString ? "present" : "missing",
      agenda: agendaString ? "present" : "missing",
      audience: audienceString ? "present" : "missing",
    });

    if (tagsString) {
      try {
        updateData.tags = JSON.parse(tagsString.toString());
        console.log("✓ Tags parsed successfully:", updateData.tags);
      } catch (e) {
        console.error("✗ Tags parsing error:", e);
        return NextResponse.json(
          { success: false, message: "Invalid tags format" },
          { status: 400 }
        );
      }
    }

    if (agendaString) {
      try {
        updateData.agenda = JSON.parse(agendaString.toString());
        console.log("✓ Agenda parsed successfully:", updateData.agenda);
      } catch (e) {
        console.error("✗ Agenda parsing error:", e);
        return NextResponse.json(
          { success: false, message: "Invalid agenda format" },
          { status: 400 }
        );
      }
    }

    if (audienceString) {
      try {
        updateData.audience = JSON.parse(audienceString.toString());
        console.log("✓ Audience parsed successfully:", updateData.audience);
      } catch (e) {
        console.error("✗ Audience parsing error:", e);
        return NextResponse.json(
          { success: false, message: "Invalid audience format" },
          { status: 400 }
        );
      }
    }

    // Validate arrays if provided
    if (
      updateData.audience &&
      (!Array.isArray(updateData.audience) || updateData.audience.length === 0)
    ) {
      console.error("✗ Audience array is empty or invalid");
      return NextResponse.json(
        { success: false, message: "At least one target audience is required" },
        { status: 400 }
      );
    }

    if (
      updateData.tags &&
      (!Array.isArray(updateData.tags) || updateData.tags.length === 0)
    ) {
      console.error("✗ Tags array is empty or invalid");
      return NextResponse.json(
        { success: false, message: "At least one tag is required" },
        { status: 400 }
      );
    }

    if (
      updateData.agenda &&
      (!Array.isArray(updateData.agenda) || updateData.agenda.length === 0)
    ) {
      console.error("✗ Agenda array is empty or invalid");
      return NextResponse.json(
        { success: false, message: "At least one agenda item is required" },
        { status: 400 }
      );
    }

    // Normalize mode
    if (updateData.mode) {
      updateData.mode = (updateData.mode as string).toLowerCase().trim();
    }

    // Handle image
    const file = formData.get("image") as File | null;
    if (file && file.size > 0) {
      console.log(`→ Starting Cloudinary upload for: ${file.name}`);
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploadResult = await new Promise<{ secure_url: string }>(
        (resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              {
                resource_type: "image",
                folder: "DevEvent",
                transformation: [
                  { width: 1200, height: 630, crop: "limit" },
                  { quality: "auto:good" },
                  { fetch_format: "auto" },
                ],
                invalidate: true,
              },
              (error, result) => {
                if (error) {
                  console.error("✗ Cloudinary upload error:", error);
                  return reject(error);
                }
                if (!result) {
                  console.error("✗ Cloudinary upload failed: No result");
                  return reject(new Error("Upload failed"));
                }
                console.log(
                  "✓ Cloudinary upload successful:",
                  result.secure_url
                );
                resolve(result);
              }
            )
            .end(buffer);
        }
      );

      updateData.image = uploadResult.secure_url;
    } else {
      console.log("→ No new image provided, keeping existing image");
    }

    console.log("→ Updating event in database...");
    console.log("Update data:", updateData);

    const updatedEvent = await Event.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    console.log("✓ Event updated successfully:", updatedEvent?._id);
    revalidatePath("/");
    revalidatePath("/events");
    revalidatePath("/admin");
    if (updatedEvent?.slug) {
      revalidatePath(`/events/${updatedEvent.slug}`);
    }

    return NextResponse.json({
      success: true,
      message: "Event updated successfully",
      data: updatedEvent,
    });
  } catch (error: unknown) {
    console.error("✗ PUT /api/events/[id] error:", error);

    if (error instanceof Error) {
      console.error("Error stack:", error.stack);
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);

      // Log validation errors in detail
      if (error.name === "ValidationError") {
        const validationError = error as {
          errors?: Record<string, { message: string }>;
        };
        console.error("Validation errors:", validationError.errors);
        const validationErrors: Record<string, string> = {};
        if (validationError.errors) {
          for (const field in validationError.errors) {
            validationErrors[field] = validationError.errors[field].message;
          }
        }
        return NextResponse.json(
          {
            success: false,
            message: "Validation failed",
            errors: validationErrors,
            error: error.message,
          },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Unknown error" },
      { status: 500 }
    );
  }
}

// DELETE event
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

    // Find the event first
    const eventToDelete = await Event.findById(id);

    if (!eventToDelete) {
      return NextResponse.json(
        { success: false, message: "Event not found" },
        { status: 404 }
      );
    }

    // ✅ Delete all bookings associated with this event
    const { default: Booking } = await import("@/database/booking.model");
    await Booking.deleteMany({ eventId: id });
    console.log(`Deleted all bookings for event: ${id}`);
    revalidatePath("/"); // ✅ للـ Home page
    revalidatePath("/events"); // ✅ للـ Events page
    revalidatePath("/admin");

    // Delete the event
    await Event.findByIdAndDelete(id);

    console.log("Event deleted successfully:", id);

    return NextResponse.json({
      success: true,
      message: "Event and associated bookings deleted successfully",
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("DELETE error:", error);
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
