// components/admin/Logout.tsx
"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

const Logout = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      document.cookie = "admin_authenticated=; path=/; max-age=0";

      router.push("/");
      router.refresh();
    } catch (error) {}
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 px-5 py-3 bg-red-700 hover:bg-red-800 text-white rounded-full font-medium shadow-2xl transition-all hover:scale-110 cursor-pointer"
        title="Logout"
      >
        <LogOut size={20} />
      </button>
    </div>
  );
};

export default Logout;
