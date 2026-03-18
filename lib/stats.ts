import { prisma } from "./prisma";
import { getWeekStart, isSameDay } from "./dates";
import type { StatsData } from "./types";

export async function getWeeklyStats(userId: string): Promise<StatsData> {
  const activePlan = await prisma.plan.findFirst({
    where: { isActive: true, userId },
    include: { days: { include: { exercises: true } } },
  });

  if (!activePlan) {
    return { weeklyPercent: 0, streak: 0, totalPlanned: 0, totalDone: 0 };
  }

  const weekStart = getWeekStart();
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 7);

  const logsThisWeek = await prisma.workoutLog.findMany({
    where: { planId: activePlan.id, date: { gte: weekStart, lt: weekEnd } },
    include: { sets: true },
  });

  const workingDays = activePlan.days.filter((d) => !d.isRestDay);
  const totalPlanned = workingDays.reduce((sum, d) => sum + d.exercises.length, 0);

  const doneCombos = new Set<string>();
  for (const log of logsThisWeek) {
    for (const set of log.sets) {
      doneCombos.add(`${log.dayName}:${set.exerciseId}`);
    }
  }
  const totalDone = doneCombos.size;
  const weeklyPercent =
    totalPlanned === 0 ? 0 : Math.round((totalDone / totalPlanned) * 100);

  const allLogs = await prisma.workoutLog.findMany({
    where: { planId: activePlan.id },
    include: { sets: true },
    orderBy: { date: "desc" },
  });

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i <= 365; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(today.getDate() - i);
    const dayName = checkDate.toLocaleDateString("en-US", { weekday: "long" });
    const planDay = activePlan.days.find((d) => d.dayName === dayName);
    if (planDay?.isRestDay) continue;
    const hasLog = allLogs.some(
      (l) => isSameDay(new Date(l.date), checkDate) && l.sets.length > 0
    );
    if (hasLog) streak++;
    else if (i > 0) break;
  }

  return { weeklyPercent, streak, totalPlanned, totalDone };
}
