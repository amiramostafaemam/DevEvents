// /////////////////////////////
// import { NextRequest, NextResponse } from "next/server";
// import { v2 as cloudinary } from "cloudinary";
// import connectDB from "@/lib/mongodb";
// import Event from "@/database/event.model";

// // Configure Cloudinary
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// type RawEventPayload = Record<string, FormDataEntryValue>;

// export async function POST(req: NextRequest) {
//   try {
//     await connectDB();

//     const formData = await req.formData();

//     const file = formData.get("image") as File;

//     if (!file) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "Image file is required",
//         },
//         { status: 400 }
//       );
//     }

//     let tags = JSON.parse(formData.get("tags") as string);

//     let agenda = JSON.parse(formData.get("agenda") as string);

//     // Convert file to buffer
//     const arrayBuffer = await file.arrayBuffer();
//     const buffer = Buffer.from(arrayBuffer);

//     // Upload to Cloudinary
//     const uploadResult = await new Promise<{ secure_url: string }>(
//       (resolve, reject) => {
//         cloudinary.uploader
//           .upload_stream(
//             {
//               resource_type: "image",
//               folder: "DevEvent",
//               transformation: [
//                 { width: 1200, height: 630, crop: "limit" }, // Optional: resize
//                 { quality: "auto" }, // Optional: auto quality
//               ],
//             },
//             (error, result) => {
//               if (error) return reject(error);
//               if (!result) return reject(new Error("Upload failed"));
//               resolve(result);
//             }
//           )
//           .end(buffer);
//       }
//     );

//     // 2️⃣ ثاني حاجة: حضّر الـ payload وضيفله الـ image URL
//     const event = Object.fromEntries(formData.entries());
//     const normalizedPayload = normalizeEventPayload(event);

//     // Add Cloudinary image URL
//     normalizedPayload.image = uploadResult.secure_url;

//     // 3️⃣ ثالث حاجة: احفظ الـ Event في الـ Database
//     const createdEvent = await Event.create(normalizedPayload);

//     return NextResponse.json(
//       {
//         success: true,
//         message: "Event created successfully",
//         data: createdEvent,
//       },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("POST /api/events error:", error);

//     return NextResponse.json(
//       {
//         success: false,
//         message: "Event creation failed",
//         error: error instanceof Error ? error.message : "Unknown error",
//       },
//       { status: 500 }
//     );
//   }
// }

// export async function POST(req: NextRequest) {
//   try {
//     await connectDB();

//     const formData = await req.formData();

//     // 1️⃣ Get and validate image
//     const file = formData.get("image") as File;

//     if (!file) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "Image file is required",
//         },
//         { status: 400 }
//       );
//     }

//     // 2️⃣ Upload to Cloudinary first
//     const arrayBuffer = await file.arrayBuffer();
//     const buffer = Buffer.from(arrayBuffer);

//     const uploadResult = await new Promise<{ secure_url: string }>(
//       (resolve, reject) => {
//         cloudinary.uploader
//           .upload_stream(
//             {
//               resource_type: "image",
//               folder: "DevEvent",
//               transformation: [
//                 { width: 1200, height: 630, crop: "limit" },
//                 { quality: "auto" },
//               ],
//             },
//             (error, result) => {
//               if (error) return reject(error);
//               if (!result) return reject(new Error("Upload failed"));
//               resolve(result);
//             }
//           )
//           .end(buffer);
//       }
//     );

//     // 3️⃣ Prepare payload
//     const rawData = Object.fromEntries(formData.entries());

//     // Parse tags and agenda if they're JSON strings
//     let tags: string[] = [];
//     let agenda: string[] = [];

//     try {
//       tags = JSON.parse(rawData.tags as string);
//     } catch {
//       // If not JSON, try comma-separated
//       tags = (rawData.tags as string)?.split(",").map((t) => t.trim()) || [];
//     }

//     try {
//       agenda = JSON.parse(rawData.agenda as string);
//     } catch {
//       // If not JSON, try comma-separated
//       agenda =
//         (rawData.agenda as string)?.split(",").map((a) => a.trim()) || [];
//     }

//     // 4️⃣ Create event object
//     const eventData = {
//       title: rawData.title as string,
//       description: rawData.description as string,
//       overview: rawData.overview as string,
//       venue: rawData.venue as string,
//       location: rawData.location as string,
//       date: rawData.date as string,
//       time: rawData.time as string,
//       mode: (rawData.mode as string).toLowerCase().trim(),
//       audience: rawData.audience as string,
//       organizer: rawData.organizer as string,
//       image: uploadResult.secure_url,
//       tags,
//       agenda,
//     };

//     // 5️⃣ Create event in database
//     const createdEvent = await Event.create(eventData);

//     return NextResponse.json(
//       {
//         success: true,
//         message: "Event created successfully",
//         data: createdEvent,
//       },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("POST /api/events error:", error);

//     return NextResponse.json(
//       {
//         success: false,
//         message: "Event creation failed",
//         error: error instanceof Error ? error.message : "Unknown error",
//       },
//       { status: 500 }
//     );
//   }
// }

// export async function GET(req: NextRequest) {
//   try {
//     await connectDB();

//     const { searchParams } = new URL(req.url);
//     const slug = searchParams.get("slug");

//     if (slug) {
//       const event = await Event.findOne({ slug });

//       if (!event) {
//         return NextResponse.json(
//           { success: false, message: "Event not found" },
//           { status: 404 }
//         );
//       }

//       return NextResponse.json({ success: true, event });
//     }

//     const events = await Event.find({}).sort({ date: 1 });

//     return NextResponse.json({
//       success: true,
//       count: events.length,
//       events,
//     });
//   } catch (error) {
//     console.error("GET /api/events error:", error);

//     return NextResponse.json(
//       {
//         success: false,
//         message: "Failed to fetch events",
//         error: error instanceof Error ? error.message : "Unknown error",
//       },
//       { status: 500 }
//     );
//   }
// }

// function normalizeEventPayload(payload: RawEventPayload) {
//   const normalized: Record<string, unknown> = { ...payload };

//   // Remove image from payload (we'll add it from Cloudinary)
//   delete normalized.image;

//   // Normalize mode to lowercase
//   if (typeof normalized.mode === "string") {
//     normalized.mode = normalized.mode.toLowerCase().trim();
//   }

//   // Convert arrays
//   normalized.agenda = coerceToStringArray(normalized.agenda);
//   normalized.tags = coerceToStringArray(normalized.tags);

//   return normalized;
// }

// function coerceToStringArray(value: unknown): string[] {
//   if (Array.isArray(value)) {
//     return value.map((item) => String(item).trim()).filter(Boolean);
//   }

//   if (typeof value === "string") {
//     try {
//       const parsed = JSON.parse(value);
//       if (Array.isArray(parsed)) {
//         return parsed.map((item) => String(item).trim()).filter(Boolean);
//       }
//     } catch {
//       // Fall back to comma-separated parsing
//     }

//     if (value.includes(",")) {
//       return value
//         .split(",")
//         .map((item) => item.trim())
//         .filter(Boolean);
//     }

//     return value ? [value.trim()] : [];
//   }

//   return [];
// }

import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

import connectDB from "@/lib/mongodb";
import Event from "@/database/event.model";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const formData = await req.formData();

    let event;

    try {
      event = Object.fromEntries(formData.entries());
    } catch (e) {
      return NextResponse.json(
        { message: "Invalid JSON data format" },
        { status: 400 }
      );
    }

    const file = formData.get("image") as File;

    if (!file)
      return NextResponse.json(
        { message: "Image file is required" },
        { status: 400 }
      );

    let tags = JSON.parse(formData.get("tags") as string);
    let agenda = JSON.parse(formData.get("agenda") as string);

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { resource_type: "image", folder: "DevEvent" },
          (error, results) => {
            if (error) return reject(error);

            resolve(results);
          }
        )
        .end(buffer);
    });

    event.image = (uploadResult as { secure_url: string }).secure_url;

    const createdEvent = await Event.create({
      ...event,
      tags: tags,
      agenda: agenda,
    });

    return NextResponse.json(
      { message: "Event created successfully", event: createdEvent },
      { status: 201 }
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      {
        message: "Event Creation Failed",
        error: e instanceof Error ? e.message : "Unknown",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();

    const events = await Event.find().sort({ createdAt: -1 });

    return NextResponse.json(
      { message: "Events fetched successfully", events },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json(
      { message: "Event fetching failed", error: e },
      { status: 500 }
    );
  }
}
