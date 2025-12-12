import { Suspense } from "react";
import { AuthWrapper } from "./auth-wrapper";
import Logout from "@/components/admin/Logout";
import Loading from "@/loading";
import EventFormSkeleton from "@/components/EventFormSkeleton";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-transparent">
      <Suspense fallback={<EventFormSkeleton />}>
        <AuthWrapper>
          <main className="flex-1 p-8">{children}</main>
        </AuthWrapper>
      </Suspense>
      <Logout />
    </div>
  );
}
