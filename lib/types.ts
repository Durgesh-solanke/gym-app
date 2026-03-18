export const MUSCLE_GROUPS = [
  "Chest",
  "Back",
  "Shoulders",
  "Biceps",
  "Triceps",
  "Legs",
  "Core",
  "Cardio",
  "Full Body",
] as const;

export type MuscleGroup = (typeof MUSCLE_GROUPS)[number];

export const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

export type DayName = (typeof DAYS_OF_WEEK)[number];

export interface StatsData {
  weeklyPercent: number;
  streak: number;
  totalPlanned: number;
  totalDone: number;
}
