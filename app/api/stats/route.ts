import { NextResponse } from "next/server";
import { getWeeklyStats } from "@/lib/stats";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as { id: string }).id;
  const stats = await getWeeklyStats(userId);
  return NextResponse.json(stats);
}
