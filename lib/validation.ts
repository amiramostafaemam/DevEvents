import { z } from "zod";

export const eventFormSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title cannot exceed 100 characters"),

  date: z
    .string()
    .min(1, "Date is required")
    .refine((date) => date && date.trim() !== "", {
      message: "Date is required",
    })
    .refine((date) => !isNaN(new Date(date).getTime()), {
      message: "Invalid date format",
    })
    .refine(
      (date) => {
        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return selectedDate >= today;
      },
      { message: "Event date cannot be in the past" }
    ),

  time: z.string().min(1, "Time is required"),

  mode: z.enum(["online", "offline", "hybrid"], {
    message: "Please select an event type",
  }),

  image: z
    .instanceof(File, { message: "Image is required" })
    .refine((file) => file.size <= 5000000, "Image must be less than 5MB")
    .refine(
      (file) =>
        ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
          file.type
        ),
      "Only .jpg, .jpeg, .png and .webp formats are supported"
    )
    .optional(),

  tags: z.array(z.string()).min(1, "At least one tag is required"),

  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description cannot exceed 1000 characters"),

  overview: z
    .string()
    .min(10, "Overview must be at least 10 characters")
    .max(500, "Overview cannot exceed 500 characters"),

  location: z.string().min(1, "Location is required"),

  audience: z
    .array(z.string())
    .min(1, "At least one target audience is required"),

  agenda: z.array(z.string()).min(1, "At least one agenda item is required"),

  organizer: z.string().min(1, "Organizer name is required"),
});

export type EventFormData = z.infer<typeof eventFormSchema>;
