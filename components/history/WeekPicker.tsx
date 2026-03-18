"use client";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatDate } from "@/lib/dates";

interface Props {
  weekStart: Date;
}

export function WeekPicker({ weekStart }: Props) {
  const router = useRouter();

  const go = (offset: number) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + offset * 7);
    router.push(`/history?week=${d.toISOString().split("T")[0]}`);
  };

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={() => go(-1)}
        className="text-gray-400 hover:text-gray-700 transition-colors"
      >
        <ChevronLeft size={20} />
      </button>
      <p className="text-sm font-medium text-gray-700">
        {formatDate(weekStart)} — {formatDate(weekEnd)}
      </p>
      <button
        onClick={() => go(1)}
        className="text-gray-400 hover:text-gray-700 transition-colors"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
