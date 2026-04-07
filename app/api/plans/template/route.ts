import { NextResponse } from "next/server";
import * as XLSX from "xlsx";

export async function GET() {
  const templateRows = [
    { plan_name:"My Weekly Plan", day:"Monday",    is_rest_day:"no",  exercise_name:"Bench Press",           muscle_group:"Chest",     sets:3, reps:10, unit:"reps" },
    { plan_name:"My Weekly Plan", day:"Monday",    is_rest_day:"no",  exercise_name:"Incline Dumbbell Press", muscle_group:"Chest",     sets:3, reps:10, unit:"reps" },
    { plan_name:"My Weekly Plan", day:"Monday",    is_rest_day:"no",  exercise_name:"Tricep Pushdown",        muscle_group:"Triceps",   sets:3, reps:12, unit:"reps" },
    { plan_name:"My Weekly Plan", day:"Tuesday",   is_rest_day:"no",  exercise_name:"Deadlift",               muscle_group:"Back",      sets:3, reps:10, unit:"reps" },
    { plan_name:"My Weekly Plan", day:"Tuesday",   is_rest_day:"no",  exercise_name:"Pull Ups",               muscle_group:"Back",      sets:3, reps:10, unit:"reps" },
    { plan_name:"My Weekly Plan", day:"Tuesday",   is_rest_day:"no",  exercise_name:"Barbell Row",            muscle_group:"Back",      sets:3, reps:10, unit:"reps" },
    { plan_name:"My Weekly Plan", day:"Wednesday", is_rest_day:"yes", exercise_name:"",                       muscle_group:"",          sets:"", reps:"", unit:"" },
    { plan_name:"My Weekly Plan", day:"Thursday",  is_rest_day:"no",  exercise_name:"Shoulder Press",         muscle_group:"Shoulders", sets:3, reps:12, unit:"reps" },
    { plan_name:"My Weekly Plan", day:"Thursday",  is_rest_day:"no",  exercise_name:"Lateral Raise",          muscle_group:"Shoulders", sets:3, reps:12, unit:"reps" },
    { plan_name:"My Weekly Plan", day:"Friday",    is_rest_day:"no",  exercise_name:"Squat",                  muscle_group:"Legs",      sets:3, reps:15, unit:"reps" },
    { plan_name:"My Weekly Plan", day:"Friday",    is_rest_day:"no",  exercise_name:"Leg Press",              muscle_group:"Legs",      sets:3, reps:12, unit:"reps" },
    { plan_name:"My Weekly Plan", day:"Saturday",  is_rest_day:"yes", exercise_name:"",                       muscle_group:"",          sets:"", reps:"", unit:"" },
    { plan_name:"My Weekly Plan", day:"Sunday",    is_rest_day:"yes", exercise_name:"",                       muscle_group:"",          sets:"", reps:"", unit:"" },
  ];

  const ws = XLSX.utils.json_to_sheet(templateRows);
  ws["!cols"] = [
    { wch: 20 }, { wch: 12 }, { wch: 12 }, { wch: 25 },
    { wch: 15 }, { wch: 6  }, { wch: 6  }, { wch: 10 },
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Plan");

  const refRows = [
    { valid_days: "Monday",    valid_muscle_groups: "Chest",     valid_units: "reps"    },
    { valid_days: "Tuesday",   valid_muscle_groups: "Back",      valid_units: "seconds" },
    { valid_days: "Wednesday", valid_muscle_groups: "Shoulders", valid_units: "minutes" },
    { valid_days: "Thursday",  valid_muscle_groups: "Biceps",    valid_units: ""        },
    { valid_days: "Friday",    valid_muscle_groups: "Triceps",   valid_units: ""        },
    { valid_days: "Saturday",  valid_muscle_groups: "Legs",      valid_units: ""        },
    { valid_days: "Sunday",    valid_muscle_groups: "Core",      valid_units: ""        },
    { valid_days: "",          valid_muscle_groups: "Cardio",    valid_units: ""        },
    { valid_days: "",          valid_muscle_groups: "Full Body", valid_units: ""        },
  ];

  const refWs = XLSX.utils.json_to_sheet(refRows);
  refWs["!cols"] = [{ wch: 15 }, { wch: 20 }, { wch: 15 }];
  XLSX.utils.book_append_sheet(wb, refWs, "Reference");

  const buffer = XLSX.write(wb, { bookType: "xlsx", type: "buffer" });

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": "attachment; filename=gym-buddy-plan-template.xlsx",
    },
  });
}
