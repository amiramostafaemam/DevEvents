"use client";

import { useState } from "react";
import LoadingButton from "@/components/LoadingButton";

interface BookEventProps {
  eventId: string;
  onBookingSuccess?: () => void;
}

const BookEvent = ({ eventId, onBookingSuccess }: BookEventProps) => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId,
          email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to book event");
      }

      setSubmitted(true);
      onBookingSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-4">
        <div className="mb-4">
          <div className="w-16 h-16 bg-[#59DECA]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-[#59DECA]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <p className="font-semibold text-xl text-[#DCFFF8]">
            Thank you for booking!
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-2">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email address"
          required
          disabled={loading}
          className="bg-[#182830] border-[#243B47] text-[#DCFFF8] py-3 w-full px-4 mt-3 rounded-xl text-base placeholder:text-[#DCFFF8] placeholder:text-base focus:border-[#DCFFF8] focus:outline-1"
        />
      </div>

      {error && <p className="text-red-600 text-base mt-1">{error}</p>}

      <LoadingButton
        type="submit"
        isLoading={loading}
        loadingText="Booking"
        className="w-full py-2 px-5 bg-[#59DECA] hover:bg-[#4FB8A6] cursor-pointer rounded-xl font-semibold text-[18px] disabled:cursor-not-allowed transition-colors text-[#030708] disabled:bg-[#182830] disabled:text-[#dcfff8]"
      >
        Book Now
      </LoadingButton>
    </form>
  );
};

export default BookEvent;
