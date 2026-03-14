import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as { id: string }).id;
  const exercises = await prisma.exercise.findMany({
    where: { userId },
    orderBy: { name: "asc" },
  });
  return NextResponse.json(exercises);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as { id: string }).id;
  const { name, muscleGroup } = await req.json();
  const exercise = await prisma.exercise.create({ data: { name, muscleGroup, userId } });
  return NextResponse.json(exercise, { status: 201 });
}
