export const dynamic = "force-dynamic";
import { getWeeklyStats } from "@/lib/stats";
import { WeeklyProgressRing } from "@/components/dashboard/WeeklyProgressRing";
import { StreakCard } from "@/components/dashboard/StreakCard";
import { TodayPreview } from "@/components/dashboard/TodayPreview";
import { DailyProgressBar } from "@/components/dashboard/DailyProgressBar";
import { prisma } from "@/lib/prisma";
import { getTodayDayName } from "@/lib/dates";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/auth/signin");
  const userId = (session.user as { id: string }).id;

  const stats = await getWeeklyStats(userId);
  const todayName = getTodayDayName();

  const activePlan = await prisma.plan.findFirst({
    where: { isActive: true, userId },
    include: {
      days: {
        where: { dayName: todayName },
        include: {
          exercises: { include: { exercise: true }, orderBy: { order: "asc" } },
        },
      },
    },
  });

  const todayExercises = activePlan?.days[0]?.exercises.map((e) => e.exercise) ?? [];
  const planDay = activePlan?.days[0];
  const isRestDay = planDay?.isRestDay ?? false;
  const totalPlannedToday = isRestDay ? 0 : (planDay?.exercises.length ?? 0);

  let totalDoneToday = 0;
  if (activePlan && totalPlannedToday > 0) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayLog = await prisma.workoutLog.findFirst({
      where: {
        planId: activePlan.id,
        dayName: todayName,
        date: { gte: today, lt: tomorrow },
      },
      include: { sets: true },
    });

    if (todayLog) {
      const doneIds = new Set(todayLog.sets.map((s) => s.exerciseId));
      totalDoneToday = doneIds.size;
    }
  }

  const dailyPercent =
    totalPlannedToday === 0
      ? 0
      : Math.round((totalDoneToday / totalPlannedToday) * 100);

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <DailyProgressBar
        percent={dailyPercent}
        done={totalDoneToday}
        planned={totalPlannedToday}
        todayName={todayName}
        isRestDay={isRestDay}
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <WeeklyProgressRing
          percent={stats.weeklyPercent}
          done={stats.totalDone}
          planned={stats.totalPlanned}
        />
        <StreakCard streak={stats.streak} />
        <TodayPreview exercises={todayExercises} todayName={todayName} />
      </div>
    </div>
  );
}
