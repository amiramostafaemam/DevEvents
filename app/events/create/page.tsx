//app/events/create/page.tsx
"use client";
import EventForm from "@/components/EventForm";
import { Suspense } from "react";

const CreateEventPage = () => {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <EventForm createdBy="user" />
    </Suspense>
  );
};

export default CreateEventPage;
