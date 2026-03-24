"use client";
import { useState } from "react";
import type { WorkoutSet } from "@prisma/client";
import { Trash2 } from "lucide-react";

interface Props {
  set: WorkoutSet;
  onUpdated: (s: WorkoutSet) => void;
  onDeleted: (id: string) => void;
}

export function SetRow({ set, onUpdated, onDeleted }: Props) {
  const [reps, setReps] = useState(String(set.reps));
  const [note, setNote] = useState(set.note ?? "");
  const [saving, setSaving] = useState(false);

  const handleBlur = async () => {
    if (String(set.reps) === reps && (set.note ?? "") === note) return;
    setSaving(true);
    const res = await fetch(`/api/sets/${set.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reps: Number(reps), note }),
    });
    if (res.ok) onUpdated(await res.json());
    setSaving(false);
  };

  const handleDelete = async () => {
    await fetch(`/api/sets/${set.id}`, { method: "DELETE" });
    onDeleted(set.id);
  };

  return (
    <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
      <span className="w-5 sm:w-6 text-gray-400 text-[10px] sm:text-xs shrink-0">#{set.setNumber}</span>
      <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-lg px-1.5 sm:px-2 py-1.5 sm:py-2">
        <input
          type="number"
          value={reps}
          onChange={(e) => setReps(e.target.value)}
          onBlur={handleBlur}
          className="w-10 sm:w-14 bg-transparent text-center outline-none text-gray-800 text-sm sm:text-base"
          min={1}
          inputMode="numeric"
        />
        <span className="text-gray-400 text-[10px] sm:text-xs">reps</span>
      </div>
      <input
        type="text"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        onBlur={handleBlur}
        placeholder="note..."
        className="flex-1 text-[10px] sm:text-xs bg-gray-50 border border-gray-200 rounded-lg px-1.5 sm:px-2 py-1.5 sm:py-2 outline-none text-gray-600 placeholder:text-gray-300"
      />
      {saving && <span className="text-[10px] sm:text-xs text-gray-300 hidden sm:inline">saving...</span>}
      <button
        onClick={handleDelete}
        className="text-gray-300 hover:text-red-400 transition-colors p-0.5 sm:p-1"
      >
        <Trash2 size={14} className="sm:w-4 sm:h-4" />
      </button>
    </div>
  );
}
