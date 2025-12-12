// app/admin/layout.tsx
import { Suspense } from "react";
import { AuthWrapper } from "./auth-wrapper";
import Logout from "@/components/admin/Logout";
import AdminLoading from "./loading";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-transparent">
      <Suspense fallback={<AdminLoading />}>
        <AuthWrapper>
          <main className="flex-1 p-8">{children}</main>
        </AuthWrapper>
      </Suspense>
      <Logout />
    </div>
  );
}
