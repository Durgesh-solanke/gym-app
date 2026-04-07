export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, XCircle } from "lucide-react";

export default async function WeeklyHistoryPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user) redirect("/auth/signin");
    const userId = (session.user as { id: string }).id;

    const activePlan = await prisma.plan.findFirst({
        where: { isActive: true, userId },
        include: {
            days: {
                include: {
                    exercises: { include: { exercise: true } },
                },
            },
        },
    });

    if (!activePlan) {
        return (
            <div className="max-w-4xl mx-auto p-4 text-center">
                <p className="text-gray-500">No active plan found.</p>
                <Link href="/dashboard" className="text-purple-600 hover:underline mt-4 inline-block">Back to Dashboard</Link>
            </div>
        );
    }

    const logs = await prisma.workoutLog.findMany({
        where: { planId: activePlan.id },
        include: {
            sets: { include: { exercise: true } },
        },
        orderBy: { date: "desc" },
    });

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat("en-US", {
            weekday: 'long', month: 'short', day: 'numeric'
        }).format(date);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-20">
            <div className="flex items-center gap-3">
                <Link href="/dashboard" className="p-2 bg-white rounded-full border shadow-sm hover:bg-gray-50">
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                </Link>
                <h1 className="text-2xl font-bold text-gray-900">Workout History</h1>
            </div>

            <div className="space-y-6">
                {logs.length === 0 ? (
                    <p className="text-gray-500 text-center py-10">No workout history found yet.</p>
                ) : (
                    logs.map((log) => {
                        const plannedDay = activePlan.days.find(d => d.dayName === log.dayName);
                        const plannedExercises = plannedDay?.exercises.map(e => e.exercise) || [];

                        const doneExerciseIds = new Set(log.sets.map(s => s.exerciseId));
                        const doneExercises = Array.from(new Set(log.sets.map(s => s.exercise.name)));

                        const missedExercises = plannedExercises
                            .filter(e => !doneExerciseIds.has(e.id))
                            .map(e => e.name);

                        return (
                            <div key={log.id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                                <div className="border-b border-gray-100 pb-3 mb-4">
                                    <h2 className="font-semibold text-lg text-gray-900">{formatDate(log.date)}</h2>
                                    <p className="text-sm text-gray-500">{log.dayName} Routine</p>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
                                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                                            Completed
                                        </h3>
                                        {doneExercises.length > 0 ? (
                                            <ul className="list-disc list-inside text-sm text-gray-600 ml-1">
                                                {doneExercises.map(ex => <li key={ex}>{ex}</li>)}
                                            </ul>
                                        ) : (
                                            <p className="text-sm text-gray-400 italic">No exercises logged.</p>
                                        )}
                                    </div>

                                    {missedExercises.length > 0 && (
                                        <div className="pt-2">
                                            <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
                                                <XCircle className="w-4 h-4 text-red-500" />
                                                Skipped / Missed
                                            </h3>
                                            <ul className="list-disc list-inside text-sm text-gray-500 ml-1 opacity-75">
                                                {missedExercises.map(ex => <li key={ex}>{ex}</li>)}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}