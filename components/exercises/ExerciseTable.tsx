"use client";
import { useState } from "react";
import type { Exercise } from "@prisma/client";
import { ExerciseFormModal } from "./ExerciseFormModal";
import { Pencil, Trash2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export function ExerciseTable({ exercises }: { exercises: Exercise[] }) {
  const [editing, setEditing] = useState<Exercise | null>(null);
  const [adding, setAdding] = useState(false);
  const router = useRouter();

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this exercise?")) return;
    await fetch(`/api/exercises/${id}`, { method: "DELETE" });
    router.refresh();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="font-semibold text-gray-700">Exercise library</h2>
        <button
          onClick={() => setAdding(true)}
          className="flex items-center gap-1.5 bg-violet-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-violet-700 transition-colors"
        >
          <Plus size={16} /> New exercise
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {exercises.length === 0 && (
          <p className="text-gray-400 text-sm text-center py-12">
            No exercises yet. Add your first one!
          </p>
        )}
        {exercises.map((ex, i) => (
          <div
            key={ex.id}
            className={`flex items-center justify-between px-4 py-3
              ${i !== 0 ? "border-t border-gray-50" : ""}`}
          >
            <div>
              <p className="text-sm font-medium text-gray-800">{ex.name}</p>
              <p className="text-xs text-gray-400">{ex.muscleGroup}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setEditing(ex)}
                className="text-gray-300 hover:text-violet-500 transition-colors"
              >
                <Pencil size={15} />
              </button>
              <button
                onClick={() => handleDelete(ex.id)}
                className="text-gray-300 hover:text-red-400 transition-colors"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {(adding || editing) && (
        <ExerciseFormModal
          exercise={editing}
          onClose={() => {
            setAdding(false);
            setEditing(null);
            router.refresh();
          }}
        />
      )}
    </div>
  );
}
