"use client";
import { useState } from "react";
import type { Exercise, WorkoutSet } from "@prisma/client";
import { SetRow } from "./SetRow";
import { AddSetButton } from "./AddSetButton";
import { CheckCircle2, Circle, ChevronDown, ChevronUp } from "lucide-react";
import { useRouter } from "next/navigation";

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
  const [creating, setCreating] = useState(false);
  const router = useRouter();

  const handleSetAdded = (newSet: WorkoutSet) => {
    setSets((prev) => [...prev, newSet]);
  };

  const handleSetUpdated = (updated: WorkoutSet) =>
    setSets((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));

  const handleSetDeleted = (id: string) => {
    const remaining = sets.filter((s) => s.id !== id);
    setSets(remaining);
    if (remaining.length === 0) {
      setMarkedDone(false);
      setExpanded(false);
    }
  };

  const toggleDone = async () => {
    if (!markedDone && sets.length === 0) {
      setCreating(true);
      setExpanded(true);
      
      const newSets: WorkoutSet[] = [];
      for (let i = 1; i <= targetSets; i++) {
        const res = await fetch("/api/sets", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            logId,
            exerciseId: exercise.id,
            setNumber: i,
            reps: targetReps,
          }),
        });
        if (res.ok) {
          const newSet = await res.json();
          newSets.push(newSet);
        }
      }
      setSets(newSets);
      setMarkedDone(true);
      setCreating(false);
      router.refresh();
    } else if (markedDone && sets.length > 0) {
      if (confirm(`Delete all ${sets.length} sets for ${exercise.name}?`)) {
        for (const set of sets) {
          await fetch(`/api/sets/${set.id}`, { method: "DELETE" });
        }
        setSets([]);
        setMarkedDone(false);
        setExpanded(false);
        router.refresh();
      }
    } else {
      setMarkedDone((v) => !v);
      if (!markedDone) setExpanded(true);
    }
  };

  const targetLabel = `${targetSets} × ${targetReps} ${targetUnit}`;
  const extraSets = sets.slice(targetSets);

  return (
    <div className={`bg-white rounded-2xl border p-3 sm:p-4 space-y-2 sm:space-y-3 transition-colors
      ${markedDone ? "border-violet-200 bg-violet-50/30" : "border-gray-100"}`}>
      <div className="flex items-center gap-2 sm:gap-3">
        <button onClick={toggleDone} className="shrink-0 transition-colors" disabled={creating}>
          {markedDone
            ? <CheckCircle2 size={24} className="text-violet-600 sm:w-[26px] sm:h-[26px]" />
            : <Circle size={24} className="text-gray-300 sm:w-[26px] sm:h-[26px]" />}
        </button>
        <div className="flex-1 min-w-0">
          <p className={`font-semibold text-xs sm:text-sm leading-tight ${markedDone ? "text-gray-800" : "text-gray-800"}`}>
            {exercise.name}
          </p>
          <div className="flex items-center gap-1.5 sm:gap-2 mt-0.5 flex-wrap">
            <span className="text-[10px] sm:text-xs text-gray-400">{exercise.muscleGroup}</span>
            <span className="text-[10px] sm:text-xs bg-violet-100 text-violet-700 px-1.5 sm:px-2 py-0.5 rounded-full font-medium">
              Target: {targetLabel}
            </span>
          </div>
        </div>
        <button
          onClick={() => setExpanded((v) => !v)}
          className="shrink-0 text-gray-300 hover:text-gray-500 transition-colors p-1"
        >
          {expanded ? <ChevronUp size={16} className="sm:w-[18px] sm:h-[18px]" /> : <ChevronDown size={16} className="sm:w-[18px] sm:h-[18px]" />}
        </button>
      </div>

      {expanded && (
        <div className="pl-7 sm:pl-9 space-y-2">
          {creating && (
            <p className="text-[10px] sm:text-xs text-violet-500">Creating {targetSets} sets...</p>
          )}
          {markedDone && !creating && (
            <>
              <div className="bg-green-50 border border-green-200 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2">
                <p className="text-[10px] sm:text-xs text-green-700 font-medium">✓ Target completed: {targetSets} sets of {targetReps} {targetUnit}</p>
              </div>
              
              {extraSets.length > 0 && (
                <div className="space-y-2 pt-2">
                  <p className="text-[10px] sm:text-xs text-gray-500 font-medium">Extra sets:</p>
                  {extraSets.map((set) => (
                    <SetRow key={set.id} set={set} onUpdated={handleSetUpdated} onDeleted={handleSetDeleted} />
                  ))}
                </div>
              )}
              
              <AddSetButton 
                logId={logId} 
                exerciseId={exercise.id} 
                nextSetNumber={sets.length + 1} 
                onAdded={handleSetAdded} 
                defaultReps={targetReps} 
              />
            </>
          )}
          {!creating && sets.length === 0 && (
            <p className="text-[10px] sm:text-xs text-gray-400">Check the exercise to log {targetSets} sets of {targetReps} {targetUnit}</p>
          )}
        </div>
      )}
    </div>
  );
}
