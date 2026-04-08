import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { WeeklyList, WeeklyDayData } from "@/components/weekly/WeeklyList";
import { TimeFilterNav } from "@/components/weekly/TimeFilterNav";
import { isSameDay } from "@/lib/dates";

export const dynamic = "force-dynamic";

export default async function WeeklyCompletionPage({
  searchParams
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/auth/signin");
  const userId = (session.user as { id: string }).id;

  const activePlan = await prisma.plan.findFirst({
    where: { isActive: true, userId },
    include: {
      days: {
        include: {
          exercises: { include: { exercise: true }, orderBy: { order: "asc" } },
        },
      },
    },
  });

  if (!activePlan) {
    return (
      <div className="max-w-4xl mx-auto p-4 text-center">
        <p className="text-gray-500">No active plan found.</p>
        <Link href="/dashboard" className="text-purple-600 hover:underline mt-4 inline-block">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const mode = searchParams?.mode === "month" ? "month" : "week";
  const parsedOffset = Number(searchParams?.offset) || 0;
  const offset = Math.min(0, parsedOffset); // Cannot select future weeks/months

  const tzToday = new Date();
  tzToday.setHours(0, 0, 0, 0);

  const planStart = new Date(activePlan.createdAt);
  planStart.setHours(0, 0, 0, 0);

  let startDate = new Date(tzToday);
  let endDate = new Date(tzToday);
  let dates: Date[] = [];
  let minOffset = 0;
  let labelTitle = "";

  if (mode === "week") {
    // Current week start boundaries logic
    const day = tzToday.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    startDate.setDate(tzToday.getDate() + diff); 
    startDate.setDate(startDate.getDate() + (offset * 7));
    
    endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 7);

    for (let i = 0; i < 7; i++) {
        const d = new Date(startDate);
        d.setDate(d.getDate() + i);
        dates.push(d);
    }

    // Min offset calculation for week
    const planStartWeek = new Date(planStart);
    const psDay = planStartWeek.getDay();
    const psDiff = psDay === 0 ? -6 : 1 - psDay;
    planStartWeek.setDate(planStartWeek.getDate() + psDiff);
    
    const currentStartWeek = new Date(tzToday);
    const cDay = currentStartWeek.getDay();
    const cDiff = cDay === 0 ? -6 : 1 - cDay;
    currentStartWeek.setDate(currentStartWeek.getDate() + cDiff);

    const msPerWeek = 1000 * 60 * 60 * 24 * 7;
    minOffset = -Math.floor((currentStartWeek.getTime() - planStartWeek.getTime()) / msPerWeek);

    const formatOpts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
    labelTitle = `${startDate.toLocaleDateString("en-US", formatOpts)} - ${new Date(endDate.getTime() - 1000).toLocaleDateString("en-US", formatOpts)}`;
  } else {
    // Month boundaries logic
    startDate.setDate(1);
    startDate.setMonth(startDate.getMonth() + offset);

    endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    const daysInMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 0).getDate();
    for(let i = 0; i < daysInMonth; i++) {
        const d = new Date(startDate);
        d.setDate(d.getDate() + i);
        dates.push(d);
    }

    // Min offset calculation for month
    const yearDiff = tzToday.getFullYear() - planStart.getFullYear();
    const monthDiff = tzToday.getMonth() - planStart.getMonth();
    minOffset = -(yearDiff * 12 + monthDiff);

    labelTitle = startDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  }

  // Cap minOffset properly
  minOffset = Math.min(0, minOffset);

  const logsThisPeriod = await prisma.workoutLog.findMany({
    where: { planId: activePlan.id, date: { gte: startDate, lt: endDate } },
    include: { sets: true },
  });

  const weekData: WeeklyDayData[] = dates.map((specificDate) => {
    const rawDayName = specificDate.toLocaleDateString("en-US", { weekday: "long" });
    const formattedDateHeader = specificDate.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
    
    // Fall back to simple day names if week mode so we don't overcrowd the accordion
    const displayDayName = mode === "week" ? rawDayName : formattedDateHeader;

    const planDay = activePlan.days.find(d => d.dayName === rawDayName);
    const isTodayFlag = isSameDay(specificDate, tzToday);
    const isPastFlag = specificDate < tzToday && !isTodayFlag;
    
    // Instead of matching just by generic DayName ("Monday"), we must match by the EXACT calendar date.
    // However, some older logs might have same 'name' but we only fetched the current ranges, 
    // it's safest to verify isSameDay since there's one run per day essentially.
    const exactDayLog = logsThisPeriod.find(l => isSameDay(l.date, specificDate));
    const completedExerciseIds = new Set(exactDayLog?.sets.map(s => s.exerciseId) || []);

    const isRestDay = !planDay || planDay.isRestDay;
    const hasExercises = planDay ? planDay.exercises.length > 0 : false;
    
    const exercises = planDay ? planDay.exercises.map(ex => ({
      id: ex.id,
      name: ex.exercise.name,
      isDone: completedExerciseIds.has(ex.exerciseId)
    })) : [];

    return {
      dayName: displayDayName,
      isToday: isTodayFlag,
      isPast: isPastFlag,
      isRestDay,
      hasExercises,
      exercises
    };
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex items-center gap-3">
        <Link href="/dashboard" className="p-2 bg-white rounded-full border shadow-sm hover:bg-gray-50 flex-shrink-0 transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Historical Breakdown</h1>
      </div>

      <TimeFilterNav mode={mode} offset={offset} minOffset={minOffset} label={labelTitle} />

      <WeeklyList weekData={weekData} />
    </div>
  );
}
