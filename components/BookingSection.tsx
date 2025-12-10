"use client";

import { useState } from "react";
import BookEvent from "@/components/BookEvent";

interface BookingSectionProps {
  eventId: string;
  initialBookingCount: number;
}

const BookingSection = ({
  eventId,
  initialBookingCount,
}: BookingSectionProps) => {
  const [bookingCount, setBookingCount] = useState(initialBookingCount);
  const [hasBooked, setHasBooked] = useState(false);

  const handleBookingSuccess = () => {
    setBookingCount((prev) => prev + 1);
    setHasBooked(true);
  };

  return (
    <aside className="booking">
      <div className="signup-card">
        {/* ✅ إخفاء "Book Your Spot" بعد الـ booking */}
        {!hasBooked && <h2>Book Your Spot</h2>}

        {/* ✅ إخفاء الـ paragraph بعد الـ booking */}
        {!hasBooked && (
          <>
            {bookingCount > 0 ? (
              <p className="text-sm">
                Join {bookingCount} people who have already booked their spot
              </p>
            ) : (
              <p className="text-sm">Be the first to book your spot!</p>
            )}
          </>
        )}

        <BookEvent eventId={eventId} onBookingSuccess={handleBookingSuccess} />
      </div>
    </aside>
  );
};

export default BookingSection;
