"use client";
import { useState } from "react";
import type { Exercise } from "@prisma/client";
import { Search, Plus } from "lucide-react";

interface Props {
  allExercises: Exercise[];
  addedIds: string[];
  onAdd: (id: string) => void;
}

export function ExercisePicker({ allExercises, addedIds, onAdd }: Props) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const filtered = allExercises.filter(
    (e) =>
      !addedIds.includes(e.id) &&
      e.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1 text-xs text-violet-500 hover:text-violet-700 transition-colors"
      >
        <Plus size={12} /> Add exercise
      </button>
      {open && (
        <div className="absolute z-10 top-6 left-0 w-52 bg-white border border-gray-200 rounded-xl shadow-lg p-2 space-y-1">
          <div className="flex items-center gap-1 border border-gray-200 rounded-lg px-2">
            <Search size={12} className="text-gray-400" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
              className="flex-1 text-xs py-1.5 outline-none"
            />
          </div>
          <div className="max-h-40 overflow-y-auto space-y-0.5">
            {filtered.length === 0 && (
              <p className="text-xs text-gray-400 py-2 text-center">
                No exercises found
              </p>
            )}
            {filtered.map((ex) => (
              <button
                key={ex.id}
                onClick={() => {
                  onAdd(ex.id);
                  setOpen(false);
                  setQuery("");
                }}
                className="w-full text-left text-xs px-2 py-1.5 rounded-lg hover:bg-violet-50 text-gray-700"
              >
                <span className="font-medium">{ex.name}</span>
                <span className="text-gray-400 ml-1">· {ex.muscleGroup}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
