import Link from "next/link";
import type { Exercise } from "@prisma/client";

interface Props {
  exercises: Exercise[];
  todayName: string;
}

export function TodayPreview({ exercises, todayName }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-3">
      <p className="text-sm font-medium text-gray-500">{todayName}&apos;s workout</p>
      {exercises.length === 0 ? (
        <p className="text-sm text-gray-400">Rest day or no plan active</p>
      ) : (
        <ul className="space-y-1">
          {exercises.map((ex) => (
            <li
              key={ex.id}
              className="text-sm text-gray-700 flex items-center gap-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 inline-block" />
              {ex.name}
            </li>
          ))}
        </ul>
      )}
      <Link
        href="/log"
        className="mt-auto text-center text-sm text-white bg-violet-600 hover:bg-violet-700 py-2 rounded-lg transition-colors"
      >
        Start logging →
      </Link>
    </div>
  );
}
