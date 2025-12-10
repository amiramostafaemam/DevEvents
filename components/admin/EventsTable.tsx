"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { IEvent } from "@/database/event.model";
import DeleteModal from "./DeleteModal";
import { Spinner } from "../ui/spinner";
import { toast } from "sonner";

interface EventsTableProps {
  events: IEvent[];
}

const EventsTable = ({ events }: EventsTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [bookingCounts, setBookingCounts] = useState<Record<string, number>>(
    {}
  );
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);
  const [eventToDeleteTitle, setEventToDeleteTitle] = useState<string>(""); // ✅ إضافة state للعنوان
  const [isDeleting, setIsDeleting] = useState(false);

  const itemsPerPage = 7;

  // Fetch booking counts for all events
  useEffect(() => {
    const fetchBookingCounts = async () => {
      try {
        const counts: Record<string, number> = {};

        for (const event of events) {
          const response = await fetch(
            `/api/bookings?eventId=${event._id.toString()}`
          );
          const data = await response.json();

          if (data.success) {
            counts[event._id.toString()] = data.count || 0;
          }
        }

        setBookingCounts(counts);
      } catch (error) {
        console.error("Error fetching booking counts:", error);
      }
    };

    if (events.length > 0) {
      fetchBookingCounts();
    }
  }, [events]);

  // Filter events
  const filteredEvents = events.filter(
    (event) =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEvents = filteredEvents.slice(startIndex, endIndex);

  // ✅ تعديل: حفظ الـ ID والـ Title
  const handleDeleteClick = (id: string, title: string) => {
    setEventToDelete(id);
    setEventToDeleteTitle(title);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!eventToDelete) return;

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/events/${eventToDelete}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success(`${eventToDeleteTitle} event deleted successfully`, {
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
        setDeleteModalOpen(false);

        // Reload page to refresh all counts
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        const data = await response.json();
        toast.error(data.message || "Failed to delete event", {
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
      console.error("Delete error:", error);
      toast.error("Failed to delete event", {
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
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="bg-[#0D161A] rounded-xl border border-[#0D161A] overflow-hidden">
        {/* Search Bar */}
        <div className="p-6 border-b border-[#243B47] bg-[#0D161A]">
          <input
            type="text"
            placeholder="Search events by name or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-[#182830] border-[#243B47] text-[#DCFFF8] py-3 w-full px-4 mt-3 rounded-xl text-base placeholder:text-slate-400 placeholder:text-base focus:border-[#DCFFF8] focus:outline-1"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#182830]">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-400">
                  Events
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-400">
                  Location
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-400">
                  Date
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-400">
                  Mode
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-400">
                  Bookings
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-400">
                  Status
                </th>
                <th className="text-center px-6 py-4 text-sm font-semibold text-slate-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {currentEvents.map((event) => (
                <tr
                  key={event._id.toString()}
                  className="hover:bg-[#112029] transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Image
                        src={event.image}
                        alt={event.title}
                        width={48}
                        height={48}
                        className="rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-semibold">{event.title}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-300">{event.location}</td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-slate-300">
                        {format(new Date(event.date), "MMM dd, yyyy")}
                      </p>
                      <p className="text-sm text-slate-400">{event.time}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        event.mode === "online"
                          ? "bg-blue-500/10 text-blue-400"
                          : event.mode === "offline"
                          ? "bg-green-500/10 text-green-400"
                          : "bg-purple-500/10 text-purple-400"
                      }`}
                    >
                      {event.mode.charAt(0).toUpperCase() + event.mode.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-300 font-semibold">
                        {bookingCounts[event._id.toString()] ?? <Spinner />}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {new Date(event.date) > new Date() ? (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-cyan-500/10 text-cyan-400">
                        Active
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-500/10 text-slate-400">
                        Past
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/events/${event.slug}`}
                        className="p-2 hover:bg-slate-300/10 rounded-lg transition-colors"
                        title="View"
                      >
                        <Eye size={18} className="text-slate-300" />
                      </Link>
                      <Link
                        href={`/admin/events/edit/${event._id}`}
                        className="p-2 hover:bg-[#59DECA]/10 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Pencil size={18} className="text-[#59DECA]" />
                      </Link>
                      <button
                        onClick={() =>
                          handleDeleteClick(event._id.toString(), event.title)
                        }
                        className="p-2 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 size={18} className="text-red-700" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Pagination */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-7 py-3 shadow-[0px_1px_2px_rgba(16,24,40,0.05)] bg-[#182830]  hover:bg-[#112029] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors text-[#E7F2FF] font-semibold"
        >
          Previous
        </button>
        <p className="text-[#E7F2FF] font-medium text-base">
          Page {currentPage} of {totalPages || 1}
        </p>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages || totalPages === 0}
          className="px-7 py-3 shadow-[0px_1px_2px_rgba(16,24,40,0.05)] bg-[#182830]  hover:bg-[#112029] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors text-[#E7F2FF] font-semibold"
        >
          Next
        </button>
      </div>

      {/* Delete Modal */}
      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Event"
        message={`Are you sure you want to delete ${eventToDeleteTitle} event? This action cannot be undone.`}
        isDeleting={isDeleting}
      />
    </>
  );
};

export default EventsTable;
