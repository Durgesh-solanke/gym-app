"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  CalendarDays,
  History,
  Dumbbell,
} from "lucide-react";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/log",       label: "Today",     icon: ClipboardList },
  { href: "/plan",      label: "Plan",      icon: CalendarDays },
  { href: "/history",   label: "History",   icon: History },
  { href: "/exercises", label: "Exercises", icon: Dumbbell },
];

export function Sidebar() {
  const path = usePathname();

  return (
    <>
      {/* Desktop sidebar — hidden on mobile */}
      <aside className="hidden lg:flex w-56 bg-white border-r border-gray-200 flex-col py-6 px-3 shrink-0">
        <div className="flex items-center gap-2 px-3 mb-8">
          <Dumbbell className="text-violet-600" size={22} />
          <span className="font-semibold text-lg text-violet-700">Gym Buddy</span>
        </div>
        <nav className="flex flex-col gap-1">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = path.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                  ${active
                    ? "bg-violet-50 text-violet-700"
                    : "text-gray-600 hover:bg-gray-100"}`}
              >
                <Icon size={18} />
                {label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile bottom nav — hidden on desktop */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 flex items-center justify-around px-2 pb-5 pt-2">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = path.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-colors
                ${active ? "text-violet-700" : "text-gray-400"}`}
            >
              <Icon size={22} strokeWidth={active ? 2.5 : 1.8} />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
