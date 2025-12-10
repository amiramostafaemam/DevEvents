// app/api/events/route.ts
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import connectDB from "@/lib/mongodb";
import Event from "@/database/event.model";
import { revalidatePath } from "next/cache";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// ✅ إضافة interface للـ event data
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
    console.log("=== POST /api/events - Starting request ===");
    await connectDB();
    console.log("✓ Database connected");

    const formData = await req.formData();
    console.log("✓ FormData received");

    // Get image file
    const file = formData.get("image") as File;

    if (!file || file.size === 0) {
      console.error("✗ Image file is missing or empty");
      return NextResponse.json(
        {
          success: false,
          message: "Image file is required",
        },
        { status: 400 }
      );
    }

    console.log(
      `✓ Image file received: ${file.name}, size: ${file.size} bytes`
    );

    // Upload to Cloudinary first
    console.log("→ Starting Cloudinary upload...");
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
              console.log("✓ Cloudinary upload successful:", result.secure_url);
              resolve(result);
            }
          )
          .end(buffer);
      }
    );

    // Prepare event data
    console.log("→ Preparing event data...");
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

    console.log("✓ Basic fields extracted:", {
      title: eventData.title,
      location: eventData.location,
      date: eventData.date,
      time: eventData.time,
      mode: eventData.mode,
    });

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
        eventData.tags = JSON.parse(tagsString as string);
        console.log("✓ Tags parsed successfully:", eventData.tags);
      } catch (e) {
        console.error("✗ Tags parsing error:", e);
        return NextResponse.json(
          { success: false, message: "Invalid tags format" },
          { status: 400 }
        );
      }
    } else {
      console.error("✗ Tags string is missing");
      return NextResponse.json(
        { success: false, message: "Tags are required" },
        { status: 400 }
      );
    }

    if (agendaString) {
      try {
        eventData.agenda = JSON.parse(agendaString as string);
        console.log("✓ Agenda parsed successfully:", eventData.agenda);
      } catch (e) {
        console.error("✗ Agenda parsing error:", e);
        return NextResponse.json(
          { success: false, message: "Invalid agenda format" },
          { status: 400 }
        );
      }
    } else {
      console.error("✗ Agenda string is missing");
      return NextResponse.json(
        { success: false, message: "Agenda is required" },
        { status: 400 }
      );
    }

    if (audienceString) {
      try {
        eventData.audience = JSON.parse(audienceString as string);
        console.log("✓ Audience parsed successfully:", eventData.audience);
      } catch (e) {
        console.error("✗ Audience parsing error:", e);
        return NextResponse.json(
          { success: false, message: "Invalid audience format" },
          { status: 400 }
        );
      }
    } else {
      console.error("✗ Audience string is missing");
      return NextResponse.json(
        { success: false, message: "Audience is required" },
        { status: 400 }
      );
    }

    // Validate arrays are not empty
    if (!Array.isArray(eventData.audience) || eventData.audience.length === 0) {
      console.error("✗ Audience array is empty or invalid");
      return NextResponse.json(
        { success: false, message: "At least one target audience is required" },
        { status: 400 }
      );
    }

    if (!Array.isArray(eventData.tags) || eventData.tags.length === 0) {
      console.error("✗ Tags array is empty or invalid");
      return NextResponse.json(
        { success: false, message: "At least one tag is required" },
        { status: 400 }
      );
    }

    if (!Array.isArray(eventData.agenda) || eventData.agenda.length === 0) {
      console.error("✗ Agenda array is empty or invalid");
      return NextResponse.json(
        { success: false, message: "At least one agenda item is required" },
        { status: 400 }
      );
    }

    console.log("→ Creating event in database...");
    console.log("Event data to save:", {
      ...eventData,
      tags: eventData.tags,
      agenda: eventData.agenda,
      audience: eventData.audience,
    });

    // Create event
    const createdEvent = await Event.create(eventData);
    console.log("✓ Event created successfully:", createdEvent._id);
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
    console.error("✗ POST /api/events error:", error);

    if (error instanceof Error) {
      console.error("Error stack:", error.stack);
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);

      // Log validation errors in detail
      if (error.name === "ValidationError") {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const validationError = error as any;
        console.error("Validation errors:", validationError.errors);
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
    console.error("GET /api/events error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
