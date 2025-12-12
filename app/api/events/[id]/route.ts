//app/api/events/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Event from "@/database/event.model";
import { Types } from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import { revalidatePath } from "next/cache";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

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

export async function PUT(
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

    const existingEvent = await Event.findById(id);
    if (!existingEvent) {
      return NextResponse.json(
        { success: false, message: "Event not found" },
        { status: 404 }
      );
    }

    const formData = await req.formData();
    const updateData: Record<string, unknown> = {};

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
      }
    });

    if (updateData.title && updateData.title !== existingEvent.title) {
      const duplicateEvent = await Event.findOne({
        title: updateData.title,
        _id: { $ne: id },
      });

      if (duplicateEvent) {
        return NextResponse.json(
          {
            success: false,
            message: "Event creation failed",
            error: `E11000 duplicate key error collection: test.events index: slug_1 dup key: { slug: "${updateData.title}" }`,
          },
          { status: 500 }
        );
      }
    }

    const tagsString = formData.get("tags");
    const agendaString = formData.get("agenda");
    const audienceString = formData.get("audience");

    if (tagsString) {
      try {
        updateData.tags = JSON.parse(tagsString.toString());
      } catch (e) {
        return NextResponse.json(
          { success: false, message: "Invalid tags format" },
          { status: 400 }
        );
      }
    }

    if (agendaString) {
      try {
        updateData.agenda = JSON.parse(agendaString.toString());
      } catch (e) {
        return NextResponse.json(
          { success: false, message: "Invalid agenda format" },
          { status: 400 }
        );
      }
    }

    if (audienceString) {
      try {
        updateData.audience = JSON.parse(audienceString.toString());
      } catch (e) {
        return NextResponse.json(
          { success: false, message: "Invalid audience format" },
          { status: 400 }
        );
      }
    }

    if (
      updateData.audience &&
      (!Array.isArray(updateData.audience) || updateData.audience.length === 0)
    ) {
      return NextResponse.json(
        { success: false, message: "At least one target audience is required" },
        { status: 400 }
      );
    }

    if (
      updateData.tags &&
      (!Array.isArray(updateData.tags) || updateData.tags.length === 0)
    ) {
      return NextResponse.json(
        { success: false, message: "At least one tag is required" },
        { status: 400 }
      );
    }

    if (
      updateData.agenda &&
      (!Array.isArray(updateData.agenda) || updateData.agenda.length === 0)
    ) {
      return NextResponse.json(
        { success: false, message: "At least one agenda item is required" },
        { status: 400 }
      );
    }

    if (updateData.mode) {
      updateData.mode = (updateData.mode as string).toLowerCase().trim();
    }

    const file = formData.get("image") as File | null;
    if (file && file.size > 0) {
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
                  return reject(error);
                }
                if (!result) {
                  return reject(new Error("Upload failed"));
                }
                resolve(result);
              }
            )
            .end(buffer);
        }
      );

      updateData.image = uploadResult.secure_url;
    }

    const updatedEvent = await Event.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

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
    if (error instanceof Error) {
      if (error.name === "ValidationError") {
        const validationError = error as {
          errors?: Record<string, { message: string }>;
        };
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

    const eventToDelete = await Event.findById(id);

    if (!eventToDelete) {
      return NextResponse.json(
        { success: false, message: "Event not found" },
        { status: 404 }
      );
    }

    const { default: Booking } = await import("@/database/booking.model");
    await Booking.deleteMany({ eventId: id });

    revalidatePath("/");
    revalidatePath("/events");
    revalidatePath("/admin");

    await Event.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Event and associated bookings deleted successfully",
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
