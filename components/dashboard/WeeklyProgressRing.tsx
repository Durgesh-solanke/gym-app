"use client";

interface Props {
  percent: number;
  done: number;
  planned: number;
}

export function WeeklyProgressRing({ percent, done, planned }: Props) {
  const r = 36;
  const circ = 2 * Math.PI * r;
  const dash = (percent / 100) * circ;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-row lg:flex-col items-center gap-4 lg:gap-3">
      <svg width="80" height="80" viewBox="0 0 96 96" className="shrink-0">
        <circle cx="48" cy="48" r={r} fill="none" stroke="#f3f4f6" strokeWidth="8" />
        <circle
          cx="48" cy="48" r={r} fill="none"
          stroke="#7c3aed" strokeWidth="8"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          transform="rotate(-90 48 48)"
        />
        <text x="48" y="53" textAnchor="middle" fontSize="16" fontWeight="600" fill="currentColor">
          {percent}%
        </text>
      </svg>
      <div className="flex flex-col lg:items-center">
        <p className="text-sm font-medium text-gray-500">Weekly completion</p>
        <p className="text-xs text-gray-400 mt-1">{done} of {planned} exercises done</p>
      </div>
    </div>
  );
}
