// "use server";
// import Booking from "@/database/booking.model";
// import connectDB from "@/lib/mongodb";

// export const createBooking = async ({
//   eventId,
//   slug,
//   email,
// }: {
//   eventId: string;
//   slug: string;
//   email: string;
// }) => {
//   try {
//     await connectDB();

//     const booking = await Booking.create({ eventId, slug, email });

//     return { success: true };
//   } catch (error) {
//     console.error("Error creating booking:", error);
//     return { success: false };
//   }
// };

// export const getBookingCount = async (eventId: string): Promise<number> => {
//   try {
//     await connectDB();

//     const count = await Booking.countDocuments({ eventId });

//     return count;
//   } catch (error) {
//     console.error("Error getting booking count:", error);
//     return 0;
//   }
// };

// "use server";

// import Booking from "@/database/booking.model";
// import connectDB from "@/lib/mongodb";

// export async function getBookingsCount(eventId: string): Promise<number> {
//   try {
//     await connectDB();

//     const count = await Booking.countDocuments({ eventId });

//     return count;
//   } catch (error) {
//     console.error("Error getting bookings count:", error);
//     return 0;
//   }
// }

// export async function getAllBookingsCount(): Promise<number> {
//   try {
//     await connectDB();

//     const count = await Booking.countDocuments();

//     return count;
//   } catch (error) {
//     console.error("Error getting all bookings count:", error);
//     return 0;
//   }
// }

// export async function getEventBookings(eventId: string) {
//   try {
//     await connectDB();

//     const bookings = await Booking.find({ eventId })
//       .sort({ createdAt: -1 })
//       .lean();

//     return JSON.parse(JSON.stringify(bookings));
//   } catch (error) {
//     console.error("Error getting event bookings:", error);
//     return [];
//   }
// }

// export const getBookingCount = async (eventId: string): Promise<number> => {
//   try {
//     await connectDB();

//     const count = await Booking.countDocuments({ eventId });

//     return count;
//   } catch (error) {
//     console.error("Error getting booking count:", error);
//     return 0;
//   }
// };
"use server";

import Booking from "@/database/booking.model";
import connectDB from "@/lib/mongodb";

export async function getBookingsCount(eventId: string): Promise<number> {
  try {
    await connectDB();

    const count = await Booking.countDocuments({ eventId });

    return count;
  } catch (error) {
    console.error("Error getting bookings count:", error);
    return 0;
  }
}

export async function getAllBookingsCount(): Promise<number> {
  try {
    await connectDB();

    const count = await Booking.countDocuments();

    return count;
  } catch (error) {
    console.error("Error getting all bookings count:", error);
    return 0;
  }
}

export async function getEventBookings(eventId: string) {
  try {
    await connectDB();

    const bookings = await Booking.find({ eventId })
      .sort({ createdAt: -1 })
      .lean();

    return JSON.parse(JSON.stringify(bookings));
  } catch (error) {
    console.error("Error getting event bookings:", error);
    return [];
  }
}

// ✅ New: Delete bookings for an event
export async function deleteEventBookings(eventId: string): Promise<number> {
  try {
    await connectDB();

    const result = await Booking.deleteMany({ eventId });

    console.log(`Deleted ${result.deletedCount} bookings for event ${eventId}`);

    return result.deletedCount;
  } catch (error) {
    console.error("Error deleting event bookings:", error);
    return 0;
  }
}

export const getBookingCount = async (eventId: string): Promise<number> => {
  try {
    await connectDB();

    const count = await Booking.countDocuments({ eventId });

    return count;
  } catch (error) {
    console.error("Error getting booking count:", error);
    return 0;
  }
};
