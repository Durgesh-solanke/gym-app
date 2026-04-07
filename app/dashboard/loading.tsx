export default function Loading() {
  return (
    <div className="max-w-4xl mx-auto space-y-4 animate-pulse">

      {/* Daily Progress */}
      <div className="h-20 bg-gray-200 rounded-xl" />

      {/* Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        <div className="h-40 bg-gray-200 rounded-xl" />

        <div className="h-40 bg-gray-200 rounded-xl" />

        <div className="h-40 bg-gray-200 rounded-xl" />

      </div>

    </div>
  );
}