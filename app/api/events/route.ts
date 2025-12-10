// app/api/events/route.ts
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import connectDB from "@/lib/mongodb";
import Event from "@/database/event.model";
import { revalidatePath } from "next/cache";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

interface EventDataInput {
  title: string;
  description: string;
  overview: string;
  location: string;
  date: string;
  time: string;
  mode: string;
  organizer: string;
  image: string;
  tags?: string[];
  agenda?: string[];
  audience?: string[];
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const formData = await req.formData();
    const file = formData.get("image") as File;

    if (!file || file.size === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Image file is required",
        },
        { status: 400 }
      );
    }

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

    const eventData: EventDataInput = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      overview: formData.get("overview") as string,
      location: formData.get("location") as string,
      date: formData.get("date") as string,
      time: formData.get("time") as string,
      mode: (formData.get("mode") as string)?.toLowerCase().trim(),
      organizer: formData.get("organizer") as string,
      image: uploadResult.secure_url,
    };

    const tagsString = formData.get("tags");
    const agendaString = formData.get("agenda");
    const audienceString = formData.get("audience");

    if (tagsString) {
      try {
        eventData.tags = JSON.parse(tagsString as string);
      } catch (e) {
        return NextResponse.json(
          { success: false, message: "Invalid tags format" },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json(
        { success: false, message: "Tags are required" },
        { status: 400 }
      );
    }

    if (agendaString) {
      try {
        eventData.agenda = JSON.parse(agendaString as string);
      } catch (e) {
        return NextResponse.json(
          { success: false, message: "Invalid agenda format" },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json(
        { success: false, message: "Agenda is required" },
        { status: 400 }
      );
    }

    if (audienceString) {
      try {
        eventData.audience = JSON.parse(audienceString as string);
      } catch (e) {
        return NextResponse.json(
          { success: false, message: "Invalid audience format" },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json(
        { success: false, message: "Audience is required" },
        { status: 400 }
      );
    }

    if (!Array.isArray(eventData.audience) || eventData.audience.length === 0) {
      return NextResponse.json(
        { success: false, message: "At least one target audience is required" },
        { status: 400 }
      );
    }

    if (!Array.isArray(eventData.tags) || eventData.tags.length === 0) {
      return NextResponse.json(
        { success: false, message: "At least one tag is required" },
        { status: 400 }
      );
    }

    if (!Array.isArray(eventData.agenda) || eventData.agenda.length === 0) {
      return NextResponse.json(
        { success: false, message: "At least one agenda item is required" },
        { status: 400 }
      );
    }

    const createdEvent = await Event.create(eventData);

    revalidatePath("/");
    revalidatePath("/events");
    revalidatePath("/admin");

    return NextResponse.json(
      {
        success: true,
        message: "Event created successfully",
        data: createdEvent,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.name === "ValidationError") {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const validationError = error as any;
        const validationErrors: Record<string, string> = {};
        for (const field in validationError.errors) {
          validationErrors[field] = validationError.errors[field].message;
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
    }

    return NextResponse.json(
      {
        success: false,
        message: "Event creation failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");

    if (slug) {
      const event = await Event.findOne({ slug });

      if (!event) {
        return NextResponse.json(
          { success: false, message: "Event not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true, event });
    }

    const events = await Event.find({}).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      count: events.length,
      data: events,
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
