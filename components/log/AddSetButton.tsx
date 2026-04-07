"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import type { WorkoutSet } from "@prisma/client";

interface Props {
  logId: string;
  exerciseId: string;
  nextSetNumber: number;
  onAdded: (set: WorkoutSet) => void;
  defaultReps?: number;
}

export function AddSetButton({
  logId,
  exerciseId,
  nextSetNumber,
  onAdded,
  defaultReps = 10,
}: Props) {
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    setLoading(true);
    const res = await fetch("/api/sets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        logId,
        exerciseId,
        setNumber: nextSetNumber,
        reps: defaultReps,
      }),
    });
    if (res.ok) onAdded(await res.json());
    setLoading(false);
  };

  return (
    <button
      onClick={handleAdd}
      disabled={loading}
      className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs text-violet-600 hover:text-violet-800 transition-colors disabled:opacity-50"
    >
      <Plus size={12} className="sm:w-[14px] sm:h-[14px]" /> Add extra set
    </button>
  );
}
