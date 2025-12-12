// app/admin/auth-wrapper.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function AuthWrapper({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const isAuthenticated =
    cookieStore.get("admin_authenticated")?.value === "true";

  if (!isAuthenticated) {
    redirect("/");
  }

  return <>{children}</>;
}
