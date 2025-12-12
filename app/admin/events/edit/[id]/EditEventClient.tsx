// app/admin/events/edit/[id]/EditEventClient.tsx
"use client";

import EventForm from "@/components/EventForm";
import { IEventSerialized } from "@/database/event.model";

interface EditEventClientProps {
  event: IEventSerialized;
}

const EditEventClient = ({ event }: EditEventClientProps) => {
  return <EventForm event={event} />;
};

export default EditEventClient;
