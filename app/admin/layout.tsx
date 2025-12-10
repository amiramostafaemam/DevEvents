// import { redirect } from "next/navigation";
// import { cookies } from "next/headers";
// import Logout from "@/components/admin/Logout";

// export default async function AdminLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const cookieStore = await cookies();
//   const isAuthenticated =
//     cookieStore.get("admin_authenticated")?.value === "true";

//   if (!isAuthenticated) {
//     redirect("/");
//   }

//   return (
//     <div className="flex min-h-screen bg-transparent">
//       <main className="flex-1 p-8">{children}</main>
//       <Logout />
//     </div>
//   );
// }
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
