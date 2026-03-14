import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
export const dynamic = "force-dynamic";
export async function GET(
  _: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const log = await prisma.workoutLog.findUnique({
    where: { id: params.id },
    include: { sets: { include: { exercise: true } } },
  });
  return log
    ? NextResponse.json(log)
    : NextResponse.json({ error: "Not found" }, { status: 404 });
}
