import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { DAYS_OF_WEEK } from "@/lib/types";
import { DayColumn } from "@/components/plan/DayColumn";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function PlanDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/auth/signin");
  const userId = (session.user as { id: string }).id;

  const plan = await prisma.plan.findUnique({
    where: { id: params.id },
    include: {
      days: {
        include: {
          exercises: { include: { exercise: true }, orderBy: { order: "asc" } },
        },
      },
    },
  });

  if (!plan || plan.userId !== userId) notFound();

  const allExercises = await prisma.exercise.findMany({
    where: { userId },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <h2 className="font-semibold text-gray-700">{plan.name}</h2>
        {plan.isActive && (
          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
            Active
          </span>
        )}
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 lg:grid lg:grid-cols-7 lg:overflow-visible">
        {DAYS_OF_WEEK.map((day) => {
          const planDay = plan.days.find((d) => d.dayName === day) ?? null;
          return (
            <div key={day} className="min-w-[160px] lg:min-w-0">
              <DayColumn
                planId={plan.id}
                dayName={day}
                planDay={planDay}
                allExercises={allExercises}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
