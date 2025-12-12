// app/admin/events/create/page.tsx
"use client";

import EventForm from "@/components/EventForm";
import EventFormSkeleton from "@/components/EventFormSkeleton";
import { Suspense } from "react";

const AdminCreateEventPage = () => {
  return (
    <Suspense fallback={<EventFormSkeleton />}>
      <EventForm createdBy="admin" />
    </Suspense>
  );
};

export default AdminCreateEventPage;
