// database/pending-event.model.ts
import { Schema, model, models, Document } from "mongoose";

export interface IPendingEvent extends Document {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  location: string;
  date: string;
  time: string;
  mode: string;
  audience: string[];
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  submittedBy: string;
}

// Interface for serialized data
export interface IPendingEventSerialized {
  _id: string;
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  location: string;
  date: string;
  time: string;
  mode: string;
  audience: string[];
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt?: string;
  updatedAt?: string;
  submittedBy?: string;
}

const PendingEventSchema = new Schema<IPendingEvent>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    slug: {
      type: String,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    overview: {
      type: String,
      required: [true, "Overview is required"],
      trim: true,
      maxlength: [500, "Overview cannot exceed 500 characters"],
    },
    image: {
      type: String,
      required: [true, "Image URL is required"],
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
        message: "Mode must be either online, offline, or hybrid",
      },
    },
    audience: {
      type: [String],
      required: [true, "Audience is required"],
      validate: {
        validator: (v: string[]) => v.length > 0,
        message: "At least one target audience is required",
      },
    },
    agenda: {
      type: [String],
      required: [true, "Agenda is required"],
      validate: {
        validator: (v: string[]) => v.length > 0,
        message: "At least one agenda item is required",
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
        validator: (v: string[]) => v.length > 0,
        message: "At least one tag is required",
      },
    },
    submittedBy: {
      type: String,
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook for slug generation
PendingEventSchema.pre("save", function () {
  if (this.isModified("title") || this.isNew) {
    this.slug = generateSlug(this.title);
  }

  if (this.isModified("mode")) {
    this.mode = this.mode.toLowerCase().trim();
  }

  if (this.isModified("date")) {
    this.date = normalizeDate(this.date);
  }

  if (this.isModified("time")) {
    this.time = normalizeTime(this.time);
  }
});

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function normalizeDate(dateString: string): string {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    throw new Error("Invalid date format");
  }
  return date.toISOString().split("T")[0];
}

function normalizeTime(timeString: string): string {
  const timeRegex = /^(\d{1,2}):(\d{2})(\s*(AM|PM))?$/i;
  const match = timeString.trim().match(timeRegex);

  if (!match) {
    throw new Error("Invalid time format. Use HH:MM or HH:MM AM/PM");
  }

  let hours = parseInt(match[1]);
  const minutes = match[2];
  const period = match[4]?.toUpperCase();

  if (period) {
    if (period === "PM" && hours !== 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;
  }

  if (
    hours < 0 ||
    hours > 23 ||
    parseInt(minutes) < 0 ||
    parseInt(minutes) > 59
  ) {
    throw new Error("Invalid time values");
  }

  return `${hours.toString().padStart(2, "0")}:${minutes}`;
}

PendingEventSchema.index({ slug: 1 });
PendingEventSchema.index({ createdAt: -1 });

const PendingEvent =
  models.PendingEvent ||
  model<IPendingEvent>("PendingEvent", PendingEventSchema);

export default PendingEvent;
