import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export async function GET(
  _: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const plan = await prisma.plan.findUnique({
    where: { id: params.id },
    include: { days: { include: { exercises: { include: { exercise: true } } } } },
  });
  return plan
    ? NextResponse.json(plan)
    : NextResponse.json({ error: "Not found" }, { status: 404 });
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as { id: string }).id;
  const body = await req.json();
  if (body.isActive) {
    await prisma.plan.updateMany({ where: { userId }, data: { isActive: false } });
  }
  const plan = await prisma.plan.update({ where: { id: params.id }, data: body });
  return NextResponse.json(plan);
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = params;
  const logs = await prisma.workoutLog.findMany({ where: { planId: id } });
  for (const log of logs) {
    await prisma.workoutSet.deleteMany({ where: { logId: log.id } });
  }
  await prisma.workoutLog.deleteMany({ where: { planId: id } });
  const days = await prisma.planDay.findMany({ where: { planId: id } });
  for (const day of days) {
    await prisma.planDayExercise.deleteMany({ where: { planDayId: day.id } });
  }
  await prisma.planDay.deleteMany({ where: { planId: id } });
  await prisma.plan.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
