"use client";
import { useState } from "react";
import type { Exercise, WorkoutSet } from "@prisma/client";
import { SetRow } from "./SetRow";
import { AddSetButton } from "./AddSetButton";
import { CheckCircle2, Circle, ChevronDown, ChevronUp } from "lucide-react";

interface Props {
  exercise: Exercise;
  logId: string;
  targetSets: number;
  targetReps: number;
  targetUnit: string;
  existingSets: WorkoutSet[];
}

export function ExerciseLogCard({ exercise, logId, targetSets, targetReps, targetUnit, existingSets }: Props) {
  const [sets, setSets] = useState<WorkoutSet[]>(existingSets);
  const [markedDone, setMarkedDone] = useState(existingSets.length > 0);
  const [expanded, setExpanded] = useState(existingSets.length > 0);

  const handleSetAdded = (newSet: WorkoutSet) => {
    setSets((prev) => [...prev, newSet]);
    setMarkedDone(true);
  };

  const handleSetUpdated = (updated: WorkoutSet) =>
    setSets((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));

  const handleSetDeleted = (id: string) => {
    const remaining = sets.filter((s) => s.id !== id);
    setSets(remaining);
    if (remaining.length === 0) setMarkedDone(false);
  };

  const toggleDone = () => {
    setMarkedDone((v) => !v);
    if (!markedDone) setExpanded(true);
  };

  const targetLabel = `${targetSets} × ${targetReps} ${targetUnit}`;

  return (
    <div className={`bg-white rounded-2xl border p-4 space-y-3 transition-colors
      ${markedDone ? "border-violet-200 bg-violet-50/30" : "border-gray-100"}`}>
      <div className="flex items-center gap-3">
        <button onClick={toggleDone} className="shrink-0 transition-colors">
          {markedDone
            ? <CheckCircle2 size={26} className="text-violet-600" />
            : <Circle size={26} className="text-gray-300" />}
        </button>
        <div className="flex-1 min-w-0">
          <p className={`font-semibold text-sm leading-tight ${markedDone ? "line-through text-gray-400" : "text-gray-800"}`}>
            {exercise.name}
          </p>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <span className="text-xs text-gray-400">{exercise.muscleGroup}</span>
            <span className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full font-medium">
              {targetLabel}
            </span>
          </div>
        </div>
        <button
          onClick={() => setExpanded((v) => !v)}
          className="shrink-0 text-gray-300 hover:text-gray-500 transition-colors p-1"
        >
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>

      {expanded && (
        <div className="pl-9 space-y-2">
          <p className="text-xs text-gray-400">
            Target: {targetSets} sets of {targetReps} {targetUnit}
          </p>
          {sets.map((set) => (
            <SetRow key={set.id} set={set} onUpdated={handleSetUpdated} onDeleted={handleSetDeleted} />
          ))}
          <AddSetButton logId={logId} exerciseId={exercise.id} nextSetNumber={sets.length + 1} onAdded={handleSetAdded} />
          {sets.length > 0 && (
            <p className="text-xs text-violet-500 font-medium">
              {sets.length} / {targetSets} sets logged
            </p>
          )}
        </div>
      )}
    </div>
  );
}
