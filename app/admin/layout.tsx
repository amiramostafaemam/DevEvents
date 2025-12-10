import { Suspense } from "react";
import { AuthWrapper } from "./auth-wrapper";
import Logout from "@/components/admin/Logout";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-transparent">
      <Suspense
        fallback={
          <div className="flex-1 p-8 flex items-center justify-center">
            <div className="text-lg">Loading...</div>
          </div>
        }
      >
        <AuthWrapper>
          <main className="flex-1 p-8">{children}</main>
        </AuthWrapper>
      </Suspense>
      <Logout />
    </div>
  );
}
