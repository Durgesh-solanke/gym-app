"use client";
import { useRouter } from "next/navigation";
import type { Exercise, PlanDay, PlanDayExercise } from "@prisma/client";
import { RestDayToggle } from "./RestDayToggle";
import { ExercisePicker } from "./ExercisePicker";
import { X } from "lucide-react";

type PlanDayFull = PlanDay & {
  exercises: (PlanDayExercise & { exercise: Exercise })[];
};

interface Props {
  planId: string;
  dayName: string;
  planDay: PlanDayFull | null;
  allExercises: Exercise[];
}

export function DayColumn({ planId, dayName, planDay, allExercises }: Props) {
  const router = useRouter();

  const ensureDay = async (): Promise<string> => {
    if (planDay) return planDay.id;
    const res = await fetch(`/api/plan-days/${planId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dayName }),
    });
    const data = await res.json();
    return data.id;
  };

  const removeExercise = async (pdeId: string) => {
    await fetch(`/api/plan-days/${planId}?exerciseEntryId=${pdeId}`, {
      method: "DELETE",
    });
    router.refresh();
  };

  const addExercise = async (exerciseId: string) => {
    const dayId = await ensureDay();
    await fetch(`/api/plan-days/${planId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dayId, exerciseId }),
    });
    router.refresh();
  };

  const isRest = planDay?.isRestDay ?? false;

  return (
    <div
      className={`rounded-2xl border p-3 space-y-3 min-h-[200px]
        ${isRest ? "bg-gray-50 border-gray-200" : "bg-white border-gray-100"}`}
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          {dayName.slice(0, 3)}
        </p>
        <RestDayToggle planId={planId} planDay={planDay} dayName={dayName} />
      </div>

      {!isRest && (
        <>
          <div className="space-y-1.5">
            {(planDay?.exercises ?? []).map((pde) => (
              <div
                key={pde.id}
                className="flex items-center justify-between bg-violet-50 rounded-lg px-2 py-1.5"
              >
                <span className="text-xs text-violet-800 font-medium">
                  {pde.exercise.name}
                </span>
                <button
                  onClick={() => removeExercise(pde.id)}
                  className="text-violet-300 hover:text-red-400 transition-colors"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
          <ExercisePicker
            allExercises={allExercises}
            addedIds={(planDay?.exercises ?? []).map((e) => e.exerciseId)}
            onAdd={addExercise}
          />
        </>
      )}
    </div>
  );
}
