// // //app/events/[slug]/page.tsx
// // import EventDetails from "@/components/EventDetails";
// // import EventPageSkeleton from "@/components/EventPageSkeleton";
// // import { Suspense } from "react";

// // const EventDetailsPage = async ({
// //   params,
// //   searchParams,
// // }: {
// //   params: Promise<{ slug: string }>;
// //   searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
// // }) => {
// //   const slug = params.then((p) => p.slug);
// //   return (
// //     <main>
// //       <Suspense
// //         fallback={
// //           <div>
// //             <EventPageSkeleton />
// //           </div>
// //         }
// //       >
// //         <EventDetails params={slug} searchParams={searchParams} />
// //       </Suspense>
// //     </main>
// //   );
// // };

// // export default EventDetailsPage;
// // app/events/[slug]/page.tsx
// import EventDetails from "@/components/EventDetails";
// import EventPageSkeleton from "@/components/EventPageSkeleton";
// import { headers } from "next/headers";
// import { Suspense } from "react";

// const EventDetailsPage = async ({
//   params,
// }: {
//   params: Promise<{ slug: string }>;
// }) => {
//   const slug = await params.then((p) => p.slug);

//   // Get headers here (outside of cached component)
//   const headersList = await headers();
//   const referer = headersList.get("referer") || "";
//   const isAdminView = referer.includes("/admin");

//   return (
//     <main>
//       <Suspense
//         fallback={
//           <div>
//             <EventPageSkeleton />
//           </div>
//         }
//       >
//         <EventDetails
//           params={Promise.resolve(slug)}
//           isAdminView={isAdminView}
//         />
//       </Suspense>
//     </main>
//   );
// };

// export default EventDetailsPage;
// app/events/[slug]/page.tsx
import EventDetails from "@/components/EventDetails";
import EventPageSkeleton from "@/components/EventPageSkeleton";
import { Suspense } from "react";

const EventDetailsPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const slug = await params.then((p) => p.slug);

  return (
    <main>
      <Suspense
        fallback={
          <div>
            <EventPageSkeleton />
          </div>
        }
      >
        <EventDetails params={Promise.resolve(slug)} />
      </Suspense>
    </main>
  );
};

export default EventDetailsPage;
