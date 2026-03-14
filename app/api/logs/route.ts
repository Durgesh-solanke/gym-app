import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const planId = searchParams.get("planId");
  const logs = await prisma.workoutLog.findMany({
    where: planId ? { planId } : {},
    include: { sets: true },
    orderBy: { date: "desc" },
  });
  return NextResponse.json(logs);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { planId, dayName } = await req.json();
  const log = await prisma.workoutLog.create({
    data: { planId, dayName },
    include: { sets: true },
  });
  return NextResponse.json(log, { status: 201 });
}
