// app/events/[slug]/page.tsx
import EventDetails from "@/components/EventDetails";
import EventPageSkeleton from "@/components/EventPageSkeleton";
import { Suspense } from "react";

// Wrapper component to handle async params
async function EventPageContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return <EventDetails params={Promise.resolve(slug)} />;
}

const EventDetailsPage = ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  return (
    <main>
      <Suspense fallback={<EventPageSkeleton />}>
        <EventPageContent params={params} />
      </Suspense>
    </main>
  );
};

export default EventDetailsPage;
