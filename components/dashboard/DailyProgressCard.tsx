"use client";

interface Props {
  percent: number;
  done: number;
  planned: number;
  todayName: string;
  isRestDay: boolean;
}

export function DailyProgressCard({ percent, done, planned, todayName, isRestDay }: Props) {
  if (isRestDay) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col items-center justify-center gap-3">
        <span className="text-4xl">😴</span>
        <div className="text-center">
          <p className="text-sm font-medium text-gray-500">Rest Day</p>
          <p className="text-xs text-orange-500 mt-1">Enjoy recovery!</p>
        </div>
      </div>
    );
  }

  if (planned === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col items-center justify-center">
        <p className="text-sm text-gray-400 text-center">No plan today</p>
      </div>
    );
  }

  const r = 36;
  const circ = 2 * Math.PI * r;
  const dash = (percent / 100) * circ;
  const allDone = percent === 100;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-row lg:flex-col items-center gap-4 lg:gap-3">
      <svg width="80" height="80" viewBox="0 0 96 96" className="shrink-0">
        <circle cx="48" cy="48" r={r} fill="none" stroke="#f3f4f6" strokeWidth="8" />
        <circle
          cx="48" cy="48" r={r} fill="none"
          stroke={allDone ? "#10b981" : "#7c3aed"}
          strokeWidth="8"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          transform="rotate(-90 48 48)"
          className="transition-all duration-500"
        />
        <text x="48" y="53" textAnchor="middle" fontSize="16" fontWeight="600" fill="currentColor">
          {percent}%
        </text>
      </svg>
      <div className="flex flex-col lg:items-center">
        <p className="text-sm font-medium text-gray-500">Daily completion</p>
        <p className="text-xs text-gray-400 mt-1">{done} of {planned} exercises done</p>
        {allDone && (
          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium mt-2">
            All done! 🎉
          </span>
        )}
      </div>
    </div>
  );
}
