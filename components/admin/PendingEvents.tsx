// components/admin/PendingEvents.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, X, Eye } from "lucide-react";
import { IPendingEvent } from "@/database/pending-event.model";
import { toast } from "sonner";
import { Spinner } from "../ui/spinner";

interface PendingEventsProps {
  initialEvents: IPendingEvent[];
}

const PendingEvents = ({ initialEvents }: PendingEventsProps) => {
  const [pendingEvents, setPendingEvents] =
    useState<IPendingEvent[]>(initialEvents);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    setPendingEvents(initialEvents);
  }, [initialEvents]);

  const handleApprove = async (eventId: string) => {
    setProcessingId(eventId);
    try {
      const response = await fetch(`/api/pending-events/${eventId}/approve`, {
        method: "POST",
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Event approved successfully", {
          style: {
            background: "#59DECA",
            color: "#030708",
            border: "transparent",
            borderRadius: "12px",
            fontSize: "16px",
            fontWeight: "semibold",
            padding: "12px 16px",
          },
        });

        // Remove from list
        setPendingEvents((prev) =>
          prev.filter((e) => e._id.toString() !== eventId)
        );

        // Reload page to refresh all data
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        toast.error(data.message || "Failed to approve event", {
          style: {
            background: "#DC2626",
            color: "#FFFFFF",
            border: "transparent",
            borderRadius: "12px",
            fontSize: "16px",
            fontWeight: "semibold",
            padding: "12px 16px",
          },
        });
      }
    } catch (error) {
      toast.error("Failed to approve event", {
        style: {
          background: "#DC2626",
          color: "#FFFFFF",
          border: "transparent",
          borderRadius: "12px",
          fontSize: "16px",
          fontWeight: "semibold",
          padding: "12px 16px",
        },
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (eventId: string) => {
    setProcessingId(eventId);
    try {
      const response = await fetch(`/api/pending-events/${eventId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Event rejected and deleted", {
          style: {
            background: "#59DECA",
            color: "#030708",
            border: "transparent",
            borderRadius: "12px",
            fontSize: "16px",
            fontWeight: "semibold",
            padding: "12px 16px",
          },
        });

        // Remove from list
        setPendingEvents((prev) =>
          prev.filter((e) => e._id.toString() !== eventId)
        );

        // Reload page to refresh all data
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        toast.error(data.message || "Failed to reject event", {
          style: {
            background: "#DC2626",
            color: "#FFFFFF",
            border: "transparent",
            borderRadius: "12px",
            fontSize: "16px",
            fontWeight: "semibold",
            padding: "12px 16px",
          },
        });
      }
    } catch (error) {
      toast.error("Failed to reject event", {
        style: {
          background: "#DC2626",
          color: "#FFFFFF",
          border: "transparent",
          borderRadius: "12px",
          fontSize: "16px",
          fontWeight: "semibold",
          padding: "12px 16px",
        },
      });
    } finally {
      setProcessingId(null);
    }
  };

  if (pendingEvents.length === 0) {
    return (
      <div className="bg-[#0D161A] rounded-xl border border-[#243B47] p-8 text-center">
        <p className="text-slate-400">No pending events</p>
      </div>
    );
  }

  return (
    <div className="bg-[#0D161A] rounded-xl border border-[#243B47] overflow-hidden">
      <div className="p-6 border-b border-[#243B47]">
        <h2 className="text-xl font-semibold text-[#E7F2FF]">
          Pending Events ({pendingEvents.length})
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Review and approve or reject event submissions
        </p>
      </div>

      <div className="divide-y divide-[#243B47]">
        {pendingEvents.map((event) => (
          <div
            key={event._id.toString()}
            className="p-6 hover:bg-[#112029] transition-colors"
          >
            <div className="flex items-start gap-4">
              <Image
                src={event.image}
                alt={event.title}
                width={120}
                height={120}
                className="rounded-lg object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg text-[#E7F2FF] mb-2 capitalize">
                  {event.title}
                </h3>
                <p className="text-sm text-slate-400 mb-3 line-clamp-2">
                  {event.overview}
                </p>
                <div className="flex flex-wrap gap-4 text-sm text-slate-300 mb-4">
                  <span>📍 {event.location}</span>
                  <span>📅 {event.date}</span>
                  <span>🕐 {event.time}</span>
                  <span className="capitalize">🎯 {event.mode}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/events/${event.slug}`}
                    className="flex items-center gap-2 px-4 py-2 bg-[#182830] hover:bg-[#112029] rounded-lg transition-colors text-sm text-[#E7F2FF]"
                  >
                    <Eye size={16} />
                    Preview
                  </Link>
                  <button
                    onClick={() => handleApprove(event._id.toString())}
                    disabled={processingId === event._id.toString()}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600/20 hover:bg-green-600/30 text-green-400 rounded-lg transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {processingId === event._id.toString() ? (
                      <Spinner />
                    ) : (
                      <Check size={16} />
                    )}
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(event._id.toString())}
                    disabled={processingId === event._id.toString()}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {processingId === event._id.toString() ? (
                      <Spinner />
                    ) : (
                      <X size={16} />
                    )}
                    Reject
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PendingEvents;
