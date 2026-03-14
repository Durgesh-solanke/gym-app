import { prisma } from "@/lib/prisma";
import { getWeekStart } from "@/lib/dates";
import { LogSummaryCard } from "@/components/history/LogSummaryCard";
import { WeekPicker } from "@/components/history/WeekPicker";
import { ExerciseProgressChart } from "@/components/history/ExerciseProgressChart";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function HistoryPage({
  searchParams,
}: {
  searchParams: { week?: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/auth/signin");
  const userId = (session.user as { id: string }).id;

  const weekStart = searchParams.week ? new Date(searchParams.week) : getWeekStart();
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 7);

  const userPlans = await prisma.plan.findMany({
    where: { userId },
    select: { id: true },
  });
  const planIds = userPlans.map((p) => p.id);

  const logs = await prisma.workoutLog.findMany({
    where: { planId: { in: planIds }, date: { gte: weekStart, lt: weekEnd } },
    include: { sets: { include: { exercise: true } } },
    orderBy: { date: "asc" },
  });

  const allSets = await prisma.workoutSet.findMany({
    where: { exercise: { userId } },
    include: { exercise: true, log: true },
    orderBy: { completedAt: "asc" },
    take: 500,
  });

  const chartData = allSets.reduce<
    Record<string, { date: string; totalReps: number }[]>
  >((acc, set) => {
    const name = set.exercise.name;
    if (!acc[name]) acc[name] = [];
    acc[name].push({
      date: new Date(set.completedAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
      }),
      totalReps: set.reps,
    });
    return acc;
  }, {});

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <WeekPicker weekStart={weekStart} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {logs.length === 0 && (
          <p className="text-gray-400 text-sm col-span-3 text-center py-12">
            No logs for this week.
          </p>
        )}
        {logs.map((log) => (
          <LogSummaryCard key={log.id} log={log} />
        ))}
      </div>
      {Object.keys(chartData).length > 0 && (
        <ExerciseProgressChart chartData={chartData} />
      )}
    </div>
  );
}
