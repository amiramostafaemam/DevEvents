import { Schema, model, models, Document } from "mongoose";

// TypeScript interface for Event document
export interface IEvent extends Document {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    overview: {
      type: String,
      required: [true, "Overview is required"],
      trim: true,
    },
    image: {
      type: String,
      required: [true, "Image is required"],
      trim: true,
    },
    venue: {
      type: String,
      required: [true, "Venue is required"],
      trim: true,
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    date: {
      type: String,
      required: [true, "Date is required"],
    },
    time: {
      type: String,
      required: [true, "Time is required"],
    },
    mode: {
      type: String,
      required: [true, "Mode is required"],
      enum: {
        values: ["online", "offline", "hybrid"],
        message: "Mode must be online, offline, or hybrid",
      },
      trim: true,
    },
    audience: {
      type: String,
      required: [true, "Audience is required"],
      trim: true,
    },
    agenda: {
      type: [String],
      required: [true, "Agenda is required"],
      validate: {
        validator: (value: string[]) => value.length > 0,
        message: "Agenda must have at least one item",
      },
    },
    organizer: {
      type: String,
      required: [true, "Organizer is required"],
      trim: true,
    },
    tags: {
      type: [String],
      required: [true, "Tags are required"],
      validate: {
        validator: (value: string[]) => value.length > 0,
        message: "Tags must have at least one item",
      },
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt
  }
);

// Create unique index on slug for faster queries
EventSchema.index({ slug: 1 });

/**
 * Pre-save hook to:
 * 1. Generate URL-friendly slug from title (only when title changes)
 * 2. Normalize date to ISO format (YYYY-MM-DD)
 * 3. Ensure time is stored in consistent 24-hour format (HH:MM)
 */
EventSchema.pre("save", function (next) {
  // Generate slug only if title is new or modified
  if (this.isModified("title")) {
    this.slug = this.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "") // Remove special characters
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
      .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
  }

  // Normalize date to ISO format (YYYY-MM-DD)
  if (this.isModified("date")) {
    try {
      const parsedDate = new Date(this.date);
      if (isNaN(parsedDate.getTime())) {
        return next(
          new Error("Invalid date format. Please provide a valid date.")
        );
      }
      // Store in ISO format (YYYY-MM-DD)
      this.date = parsedDate.toISOString().split("T")[0];
    } catch (error) {
      return next(
        new Error("Error parsing date. Please provide a valid date.")
      );
    }
  }

  // Normalize time to 24-hour format (HH:MM)
  if (this.isModified("time")) {
    const timeRegex = /^([01]?\d|2[0-3]):([0-5]\d)$/;

    // If already in HH:MM format, validate it
    if (timeRegex.test(this.time)) {
      const [hours, minutes] = this.time.split(":");
      this.time = `${hours.padStart(2, "0")}:${minutes}`;
    } else {
      // Try to parse other formats (e.g., "3:30 PM")
      try {
        const timeMatch = this.time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
        if (!timeMatch) {
          return next(
            new Error(
              "Invalid time format. Please use HH:MM or HH:MM AM/PM format."
            )
          );
        }

        let hours = parseInt(timeMatch[1], 10);
        const minutes = timeMatch[2];
        const meridiem = timeMatch[3]?.toUpperCase();

        // Convert to 24-hour format if AM/PM is present
        if (meridiem) {
          if (meridiem === "PM" && hours !== 12) {
            hours += 12;
          } else if (meridiem === "AM" && hours === 12) {
            hours = 0;
          }
        }

        if (hours < 0 || hours > 23) {
          return next(
            new Error("Invalid time. Hours must be between 0 and 23.")
          );
        }

        this.time = `${String(hours).padStart(2, "0")}:${minutes}`;
      } catch (error) {
        return next(
          new Error("Error parsing time. Please provide a valid time.")
        );
      }
    }
  }

  next();
});

// Use existing model if it exists (prevents OverwriteModelError in Next.js hot reload)
const Event = models.Event || model<IEvent>("Event", EventSchema);

export default Event;
