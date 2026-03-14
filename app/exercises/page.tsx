import { prisma } from "@/lib/prisma";
import { ExerciseTable } from "@/components/exercises/ExerciseTable";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
export const dynamic = "force-dynamic";

export default async function ExercisesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/auth/signin");
  const userId = (session.user as { id: string }).id;

  const exercises = await prisma.exercise.findMany({
    where: { userId },
    orderBy: { name: "asc" },
  });

  return (
    <div className="max-w-3xl mx-auto">
      <ExerciseTable exercises={exercises} />
    </div>
  );
}
