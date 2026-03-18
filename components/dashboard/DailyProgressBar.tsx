import Link from "next/link";

interface Props {
  percent: number;
  done: number;
  planned: number;
  todayName: string;
  isRestDay: boolean;
}

export function DailyProgressBar({ percent, done, planned, todayName, isRestDay }: Props) {
  if (isRestDay) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-700">{todayName}</p>
          <p className="text-xs text-orange-500 font-medium mt-0.5">Rest day — enjoy your recovery!</p>
        </div>
        <span className="text-2xl">😴</span>
      </div>
    );
  }

  if (planned === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <p className="text-sm text-gray-400 text-center">
          No active plan.{" "}
          <Link href="/plan" className="text-violet-600 underline">Create one</Link>
        </p>
      </div>
    );
  }

  const allDone = percent === 100;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-700">Today — {todayName}</p>
          <p className="text-xs text-gray-400 mt-0.5">{done} of {planned} exercises logged</p>
        </div>
        <div className="flex items-center gap-2">
          {allDone && (
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
              All done!
            </span>
          )}
          <span className={`text-2xl font-bold ${allDone ? "text-green-500" : "text-violet-600"}`}>
            {percent}%
          </span>
        </div>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
        <div
          className={`h-3 rounded-full transition-all duration-500 ${allDone ? "bg-green-500" : "bg-violet-500"}`}
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className="flex gap-1.5 flex-wrap">
        {Array.from({ length: planned }).map((_, i) => (
          <div
            key={i}
            className={`h-2 rounded-full flex-1 min-w-[16px] transition-colors
              ${i < done ? (allDone ? "bg-green-400" : "bg-violet-400") : "bg-gray-200"}`}
          />
        ))}
      </div>
      {!allDone && (
        <Link
          href="/log"
          className="block text-center text-sm text-violet-600 font-medium hover:text-violet-800 transition-colors"
        >
          Continue today's workout →
        </Link>
      )}
    </div>
  );
}
