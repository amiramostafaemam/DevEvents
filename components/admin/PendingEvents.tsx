// components/admin/PendingEvents.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, X, Eye, MapPin, Calendar, Clock, Laptop } from "lucide-react";
import { IPendingEvent } from "@/database/pending-event.model";
import { toast } from "sonner";
import LoadingButton from "../LoadingButton";

interface PendingEventsProps {
  initialEvents: IPendingEvent[];
}

const PendingEvents = ({ initialEvents }: PendingEventsProps) => {
  const [pendingEvents, setPendingEvents] =
    useState<IPendingEvent[]>(initialEvents);

  const [processingId, setProcessingId] = useState<string | null>(null);
  const [processingAction, setProcessingAction] = useState<
    "approve" | "reject" | null
  >(null);

  useEffect(() => {
    setPendingEvents(initialEvents);
  }, [initialEvents]);

  const handleApprove = async (eventId: string) => {
    setProcessingId(eventId);
    setProcessingAction("approve");

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

        setPendingEvents((prev) =>
          prev.filter((e) => e._id.toString() !== eventId)
        );

        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        toast.error(
          data.message ||
            "Failed to approve event. There's an event with the same title",
          {
            style: {
              background: "#DC2626",
              color: "#FFFFFF",
              border: "transparent",
              borderRadius: "12px",
              fontSize: "16px",
              fontWeight: "semibold",
              padding: "12px 16px",
            },
          }
        );
      }
    } catch {
      toast.error("Failed to approve event.", {
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
      setProcessingAction(null);
    }
  };

  const handleReject = async (eventId: string) => {
    setProcessingId(eventId);
    setProcessingAction("reject");

    try {
      const response = await fetch(`/api/pending-events/${eventId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Event rejected successfully!", {
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

        setPendingEvents((prev) =>
          prev.filter((e) => e._id.toString() !== eventId)
        );

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
    } catch {
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
      setProcessingAction(null);
    }
  };

  if (pendingEvents.length === 0) {
    return (
      <div className="bg-[#0D161A] rounded-xl border border-[#243B47] p-8 text-center">
        <p className="text-slate-500">No pending events</p>
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
          <div key={event._id.toString()} className="p-6 transition-colors">
            <div className="flex items-start gap-4">
              <Image
                src={event.image}
                alt={event.title}
                width={120}
                height={120}
                className="rounded-lg object-cover flex-shrink-0"
              />
              <div>
                <h3 className="font-semibold text-lg text-[#E7F2FF] mb-2 capitalize">
                  {event.title}
                </h3>

                <p className="text-sm text-slate-400 mb-3 line-clamp-2">
                  {event.overview}
                </p>

                <div className="flex flex-wrap gap-4 text-sm text-slate-300 mb-4">
                  <span className="flex items-center">
                    <MapPin size={16} className="mr-2 text-red-500" />
                    <span className="text-slate-200 capitalize font-semibold">
                      {event.location}
                    </span>
                  </span>

                  <span className="flex items-center">
                    <Calendar size={16} className="mr-2 text-cyan-300" />
                    <span className="text-slate-200 font-semibold">
                      {event.date}
                    </span>
                  </span>

                  <span className="flex items-center">
                    <Clock size={16} className="mr-2 text-violet-400" />
                    <span className="text-slate-200 font-semibold">
                      {event.time}
                    </span>
                  </span>

                  <span className="flex items-center">
                    <Laptop size={16} className="mr-2 text-indigo-300" />

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                        event.mode === "offline"
                          ? "bg-gray-500/15 text-gray-300 border border-gray-400/20"
                          : event.mode === "online"
                          ? "bg-green-500/15 text-green-300 border border-green-400/20"
                          : "bg-purple-500/15 text-purple-300 border border-purple-400/20"
                      }`}
                    >
                      {event.mode}
                    </span>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/events/${event.slug}`}
                    className="flex items-center gap-2 px-4 py-2 bg-[#182830] hover:bg-[#112029] rounded-lg transition-colors text-sm text-[#E7F2FF]"
                  >
                    <Eye size={16} />
                    Preview
                  </Link>

                  {/* Approve Button */}
                  <LoadingButton
                    onClick={() => handleApprove(event._id.toString())}
                    isLoading={
                      processingId === event._id.toString() &&
                      processingAction === "approve"
                    }
                    loadingText="Approving"
                    variant="secondary"
                    size="sm"
                    className="cursor-pointer flex items-center gap-2 text-green-300 border-none hover:bg-green-400/30 bg-green-600/20"
                  >
                    <Check size={16} />
                    Approve
                  </LoadingButton>

                  {/* Reject Button */}
                  <LoadingButton
                    onClick={() => handleReject(event._id.toString())}
                    isLoading={
                      processingId === event._id.toString() &&
                      processingAction === "reject"
                    }
                    loadingText="Rejecting"
                    variant="danger"
                    size="sm"
                    className="cursor-pointer flex items-center gap-2 text-red-300 hover:bg-red-500/30 bg-red-600/20"
                  >
                    <X size={16} />
                    Reject
                  </LoadingButton>
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
