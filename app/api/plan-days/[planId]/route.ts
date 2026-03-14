import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
export const dynamic = "force-dynamic";
export async function GET(
  _: Request,
  { params }: { params: { planId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const days = await prisma.planDay.findMany({
    where: { planId: params.planId },
    include: { exercises: { include: { exercise: true } } },
  });
  return NextResponse.json(days);
}

export async function POST(
  req: Request,
  { params }: { params: { planId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { dayName, isRestDay } = await req.json();
  const day = await prisma.planDay.create({
    data: { planId: params.planId, dayName, isRestDay: isRestDay ?? false },
  });
  return NextResponse.json(day, { status: 201 });
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { dayId, exerciseId, isRestDay, targetSets, targetReps, targetUnit } = await req.json();
  if (typeof isRestDay === "boolean") {
    const day = await prisma.planDay.update({ where: { id: dayId }, data: { isRestDay } });
    return NextResponse.json(day);
  }
  const entry = await prisma.planDayExercise.create({
    data: {
      planDayId: dayId,
      exerciseId,
      targetSets: targetSets ?? 3,
      targetReps: targetReps ?? 10,
      targetUnit: targetUnit ?? "reps",
    },
  });
  return NextResponse.json(entry, { status: 201 });
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("exerciseEntryId");
  if (!id) return NextResponse.json({ error: "Missing exerciseEntryId" }, { status: 400 });
  await prisma.planDayExercise.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
