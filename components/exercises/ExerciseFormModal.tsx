"use client";
import { useState } from "react";
import type { Exercise } from "@prisma/client";
import { X } from "lucide-react";

const MUSCLE_GROUPS = [
  "Chest",
  "Back",
  "Shoulders",
  "Biceps",
  "Triceps",
  "Legs",
  "Core",
  "Cardio",
  "Full Body",
];

interface Props {
  exercise: Exercise | null;
  onClose: () => void;
}

export function ExerciseFormModal({ exercise, onClose }: Props) {
  const [name, setName] = useState(exercise?.name ?? "");
  const [muscleGroup, setMuscleGroup] = useState(
    exercise?.muscleGroup ?? "Chest"
  );
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) return;
    setSaving(true);
    if (exercise) {
      await fetch(`/api/exercises/${exercise.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, muscleGroup }),
      });
    } else {
      await fetch("/api/exercises", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, muscleGroup }),
      });
    }
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm space-y-4 shadow-xl">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-gray-800">
            {exercise ? "Edit" : "New"} exercise
          </h3>
          <button onClick={onClose}>
            <X size={18} className="text-gray-400" />
          </button>
        </div>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder="Exercise name e.g. Bench Press"
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-400"
        />
        <select
          value={muscleGroup}
          onChange={(e) => setMuscleGroup(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-400"
        >
          {MUSCLE_GROUPS.map((g) => (
            <option key={g}>{g}</option>
          ))}
        </select>
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="w-full bg-violet-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-violet-700 transition-colors disabled:opacity-50"
        >
          {saving ? "Saving..." : exercise ? "Save changes" : "Create"}
        </button>
      </div>
    </div>
  );
}
