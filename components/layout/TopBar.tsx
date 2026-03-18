"use client";
import { usePathname } from "next/navigation";
import { formatDate } from "@/lib/dates";
import { useSession, signOut } from "next-auth/react";
import { LogOut, User } from "lucide-react";

const TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/log":       "Today's Log",
  "/plan":      "Weekly Plan",
  "/history":   "History",
  "/exercises": "Exercise Library",
};

export function TopBar() {
  const path = usePathname();
  const { data: session } = useSession();
  const title =
    Object.entries(TITLES).find(([k]) => path.startsWith(k))?.[1] ?? "Gym Buddy";

  return (
    <header className="h-14 border-b border-gray-200 bg-white px-4 lg:px-6 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-2">
        <span className="lg:hidden font-semibold text-violet-700 text-base">Gym Buddy</span>
        <span className="hidden lg:block text-base font-semibold text-gray-800">{title}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-400 hidden lg:block">{formatDate(new Date())}</span>
        {session?.user && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 rounded-lg px-2.5 py-1.5">
              <User size={13} className="text-gray-400" />
              <span className="text-xs text-gray-600 max-w-[100px] truncate">
                {session.user.name || session.user.email}
              </span>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/auth/signin" })}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors px-2 py-1.5 rounded-lg hover:bg-red-50"
            >
              <LogOut size={13} />
              <span className="hidden lg:block">Sign out</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
