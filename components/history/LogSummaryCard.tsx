import type { WorkoutLog, WorkoutSet, Exercise } from "@prisma/client";

type LogFull = WorkoutLog & {
  sets: (WorkoutSet & { exercise: Exercise })[];
};

export function LogSummaryCard({ log }: { log: LogFull }) {
  const exerciseMap = new Map<string, { name: string; sets: number }>();
  for (const set of log.sets) {
    const existing = exerciseMap.get(set.exerciseId);
    exerciseMap.set(set.exerciseId, {
      name: set.exercise.name,
      sets: (existing?.sets ?? 0) + 1,
    });
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-3">
      <div>
        <p className="font-semibold text-gray-800">{log.dayName}</p>
        <p className="text-xs text-gray-400">
          {new Date(log.date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
          })}
        </p>
      </div>
      <ul className="space-y-1">
        {[...exerciseMap.values()].map((ex) => (
          <li
            key={ex.name}
            className="text-sm text-gray-700 flex justify-between"
          >
            <span>{ex.name}</span>
            <span className="text-gray-400 text-xs">{ex.sets} sets</span>
          </li>
        ))}
      </ul>
      {exerciseMap.size === 0 && (
        <p className="text-xs text-gray-400">No sets logged</p>
      )}
    </div>
  );
}
