"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isAuthPage =
    pathname.startsWith("/auth/signin") ||
    pathname.startsWith("/auth/signup");

  // 🔥 MODAL MODE
if (isAuthPage) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal wrapper */}
      <div className="relative z-10 w-full max-w-sm max-h-[90vh] flex">
        {children}
      </div>
    </div>
  );
}

  // ✅ NORMAL APP LAYOUT
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 pb-24 lg:pb-6">
          {children}
        </main>
      </div>
    </div>
  );
}