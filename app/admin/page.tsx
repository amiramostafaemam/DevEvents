// app/admin/page.tsx
import Link from "next/link";
import EventsTable from "@/components/admin/EventsTable";
import PendingEvents from "@/components/admin/PendingEvents";
import { getAllEvents } from "@/lib/actions/event.actions";
import EventsStats from "./EventsStats";
import { cookies } from "next/headers";
import { Suspense } from "react";
import connectDB from "@/lib/mongodb";
import PendingEvent from "@/database/pending-event.model";

const AdminEventsPage = async () => {
  await cookies();

  // Get approved events from Event collection
  const events = await getAllEvents();

  // Get pending events from PendingEvent collection
  await connectDB();
  const pendingEventsData = await PendingEvent.find({})
    .sort({ createdAt: -1 })
    .lean();

  // Serialize pending events
  const pendingEvents = pendingEventsData.map((event) => ({
    ...event,
    _id: event._id.toString(),
    createdAt: event.createdAt?.toISOString(),
    updatedAt: event.updatedAt?.toISOString(),
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1>Event Management</h1>
          <p className="text-slate-400 mt-1">
            Manage all your events in one place
          </p>
        </div>
        <Link
          href="/admin/events/create"
          className="flex items-center gap-2 px-6 py-3 bg-[#59DECA] hover:bg-[#4AC9B8] rounded-lg font-semibold transition-colors text-[#030708]"
        >
          Add New Event
        </Link>
      </div>

      {/* Stats */}
      <EventsStats events={events} />

      {/* Pending Events Section */}
      {pendingEvents.length > 0 && (
        <div>
          <PendingEvents initialEvents={pendingEvents as any} />
        </div>
      )}

      {/* Events Table */}
      <Suspense
        fallback={<div className="text-slate-400">Loading events...</div>}
      >
        <EventsTable events={events} />
      </Suspense>
    </div>
  );
};

export default AdminEventsPage;
