"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  mode: "week" | "month";
  offset: number;
  minOffset: number;
  label: string;
}

export function TimeFilterNav({ mode, offset, minOffset, label }: Props) {
  const isMin = offset <= minOffset;
  const isMax = offset >= 0;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
      {/* Mode Switches */}
      <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
        <Link
          href={`/weekly?mode=week&offset=0`}
          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${mode === "week" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
        >
          Week
        </Link>
        <Link
          href={`/weekly?mode=month&offset=0`}
          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${mode === "month" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
        >
          Month
        </Link>
      </div>

      {/* Date Navigation */}
      <div className="flex items-center gap-3">
        <Link
          href={isMin ? "#" : `/weekly?mode=${mode}&offset=${offset - 1}`}
          className={`p-2 rounded-lg border transition-colors ${isMin ? "opacity-40 cursor-not-allowed border-gray-100 bg-gray-50" : "hover:bg-gray-50 border-gray-200"}`}
          aria-disabled={isMin}
        >
          <ChevronLeft className="w-4 h-4 text-gray-600" />
        </Link>

        <span className="text-sm font-semibold text-gray-800 min-w-[120px] text-center">
          {label}
        </span>

        <Link
          href={isMax ? "#" : `/weekly?mode=${mode}&offset=${offset + 1}`}
          className={`p-2 rounded-lg border transition-colors ${isMax ? "opacity-40 cursor-not-allowed border-gray-100 bg-gray-50" : "hover:bg-gray-50 border-gray-200"}`}
          aria-disabled={isMax}
        >
          <ChevronRight className="w-4 h-4 text-gray-600" />
        </Link>
      </div>
    </div>
  );
}
