export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { getTodayDayName } from "@/lib/dates";
import { ExerciseLogCard } from "@/components/log/ExerciseLogCard";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";


export default async function LogPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/auth/signin");
  const userId = (session.user as { id: string }).id;
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

  const planDay = activePlan?.days[0];
  const planExercises = planDay?.exercises ?? [];

  let log = null;
  if (activePlan && planExercises.length > 0) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    log = await prisma.workoutLog.findFirst({
      where: {
        planId: activePlan.id,
        dayName: todayName,
        date: { gte: today, lt: tomorrow },
      },
      include: { sets: { orderBy: { setNumber: "asc" } } },
    });

    if (!log) {
      log = await prisma.workoutLog.create({
        data: { planId: activePlan.id, dayName: todayName },
        include: { sets: { orderBy: { setNumber: "asc" } } },
      });
    }
  }

  if (!activePlan || !planDay) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20 text-gray-400">
        <p className="text-lg">No active plan found.</p>
        <p className="text-sm mt-2">
          Go to <strong>Weekly Plan</strong> to create and activate one.
        </p>
      </div>
    );
  }

  if (planDay.isRestDay) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20 text-gray-400">
        <p className="text-2xl">Rest day!</p>
        <p className="text-sm mt-2">Enjoy your recovery.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <p className="text-sm text-gray-400">
        {todayName} &middot; {activePlan.name}
      </p>
      {planExercises.map((pde) => (
        <ExerciseLogCard
          key={pde.id}
          exercise={pde.exercise}
          logId={log!.id}
          targetSets={pde.targetSets}
          targetReps={pde.targetReps}
          targetUnit={pde.targetUnit}
          existingSets={log!.sets.filter((s) => s.exerciseId === pde.exerciseId)}
        />
      ))}
    </div>
  );
}
