import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { logId, exerciseId, setNumber, reps, note } = await req.json();
  const set = await prisma.workoutSet.create({
    data: { logId, exerciseId, setNumber, reps, note },
  });
  return NextResponse.json(set, { status: 201 });
}
