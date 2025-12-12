//app/events/create/page.tsx
"use client";
import EventForm from "@/components/EventForm";
import EventFormSkeleton from "@/components/EventFormSkeleton";
import Loading from "@/loading";
import { Suspense } from "react";

const CreateEventPage = () => {
  return (
    <Suspense fallback={<EventFormSkeleton />}>
      <EventForm createdBy="user" />
    </Suspense>
  );
};

export default CreateEventPage;
