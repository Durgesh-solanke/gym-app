"use client";
import { useRouter } from "next/navigation";
import type { PlanDay } from "@prisma/client";

interface Props {
  planId: string;
  planDay: PlanDay | null;
  dayName: string;
}

export function RestDayToggle({ planId, planDay, dayName }: Props) {
  const router = useRouter();

  const toggle = async () => {
    if (!planDay) {
      await fetch(`/api/plan-days/${planId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dayName, isRestDay: true }),
      });
    } else {
      await fetch(`/api/plan-days/${planId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dayId: planDay.id, isRestDay: !planDay.isRestDay }),
      });
    }
    router.refresh();
  };

  return (
    <button
      onClick={toggle}
      className={`text-xs px-1.5 py-0.5 rounded-full transition-colors
        ${planDay?.isRestDay
          ? "bg-orange-100 text-orange-600"
          : "text-gray-300 hover:text-orange-400"}`}
    >
      rest
    </button>
  );
}
