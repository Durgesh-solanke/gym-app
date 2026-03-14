interface Props {
  streak: number;
}

export function StreakCard({ streak }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-row lg:flex-col items-center gap-4 lg:gap-2 lg:justify-center">
      <div className="text-5xl font-bold text-orange-500 shrink-0">{streak}</div>
      <div>
        <p className="text-sm font-medium text-gray-500">Current streak</p>
        <p className="text-xs text-gray-400 mt-0.5">consecutive active days</p>
      </div>
    </div>
  );
}
