import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { prisma } from "@/lib/prisma";
import { MUSCLE_GROUPS, DAYS_OF_WEEK } from "@/lib/types";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const userId = (session.user as { id: string }).id;

    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: "array" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json<Record<string, string>>(sheet);

    if (rows.length === 0) return NextResponse.json({ error: "Excel file is empty" }, { status: 400 });

    const required = ["plan_name", "day", "is_rest_day"];
    for (const col of required) {
      if (!(col in rows[0])) {
        return NextResponse.json({ error: `Missing required column: ${col}` }, { status: 400 });
      }
    }

    const planName = String(rows[0].plan_name).trim();
    if (!planName) return NextResponse.json({ error: "plan_name is empty" }, { status: 400 });

    const validDays = DAYS_OF_WEEK as readonly string[];
    for (const row of rows) {
      const day = String(row.day || "").trim();
      if (!validDays.includes(day)) {
        return NextResponse.json({ error: `Invalid day: "${day}". Must be one of: ${DAYS_OF_WEEK.join(", ")}` }, { status: 400 });
      }
    }

    const validMuscles = MUSCLE_GROUPS as readonly string[];
    for (const row of rows) {
      const isRest = String(row.is_rest_day || "").toLowerCase().trim() === "yes";
      if (!isRest && row.exercise_name) {
        const mg = String(row.muscle_group || "").trim();
        if (!validMuscles.includes(mg)) {
          return NextResponse.json({ error: `Invalid muscle_group: "${mg}"` }, { status: 400 });
        }
      }
    }

    await prisma.plan.updateMany({ where: { userId }, data: { isActive: false } });

    const plan = await prisma.plan.create({
      data: { name: planName, isActive: true, userId },
    });

    const dayMap = new Map<string, {
      isRest: boolean;
      exercises: { name: string; muscleGroup: string; targetSets: number; targetReps: number; targetUnit: string }[];
    }>();

    for (const row of rows) {
      const day = String(row.day).trim();
      const isRest = String(row.is_rest_day || "").toLowerCase().trim() === "yes";
      const exerciseName = String(row.exercise_name || "").trim();
      const muscleGroup = String(row.muscle_group || "").trim();
      const targetSets = parseInt(String(row.sets || "3")) || 3;
      const targetReps = parseInt(String(row.reps || "10")) || 10;
      const targetUnit = String(row.unit || "reps").trim().toLowerCase() || "reps";

      if (!dayMap.has(day)) dayMap.set(day, { isRest, exercises: [] });
      if (!isRest && exerciseName) {
        dayMap.get(day)!.exercises.push({ name: exerciseName, muscleGroup, targetSets, targetReps, targetUnit });
      }
    }

    for (const [dayName, data] of Array.from(dayMap.entries())) {
      const planDay = await prisma.planDay.create({
        data: { planId: plan.id, dayName, isRestDay: data.isRest },
      });

      let order = 0;
      for (const ex of data.exercises) {
        let exercise = await prisma.exercise.findFirst({
          where: { name: { equals: ex.name, mode: "insensitive" }, userId },
        });
        if (!exercise) {
          exercise = await prisma.exercise.create({
            data: { name: ex.name, muscleGroup: ex.muscleGroup, userId },
          });
        }
        await prisma.planDayExercise.create({
          data: {
            planDayId: planDay.id,
            exerciseId: exercise.id,
            order,
            targetSets: ex.targetSets,
            targetReps: ex.targetReps,
            targetUnit: ex.targetUnit,
          },
        });
        order++;
      }
    }

    return NextResponse.json({ ok: true, planId: plan.id, planName, daysCreated: dayMap.size });
  } catch (err) {
    console.error("Import error:", err);
    return NextResponse.json({ error: "Failed to process file." }, { status: 500 });
  }
}
