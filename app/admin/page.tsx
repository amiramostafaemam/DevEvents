// app/admin/events/page.tsx
import Link from "next/link";
import EventsTable from "@/components/admin/EventsTable";
import { getAllEvents } from "@/lib/actions/event.actions";
import EventsStats from "./EventsStats";
import { cookies } from "next/headers";

const AdminEventsPage = async () => {
  await cookies();
  const events = await getAllEvents();

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

      {/* Events Table */}
      <EventsTable events={events} />
    </div>
  );
};

export default AdminEventsPage;
