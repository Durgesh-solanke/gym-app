"use client";
import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Props {
  chartData: Record<string, { date: string; totalReps: number }[]>;
}

export function ExerciseProgressChart({ chartData }: Props) {
  const exercises = Object.keys(chartData);
  const [selected, setSelected] = useState(exercises[0]);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        <p className="text-sm font-medium text-gray-600 mr-2">
          Exercise history:
        </p>
        {exercises.map((name) => (
          <button
            key={name}
            onClick={() => setSelected(name)}
            className={`text-xs px-3 py-1 rounded-full border transition-colors
              ${selected === name
                ? "bg-violet-600 text-white border-violet-600"
                : "border-gray-200 text-gray-500 hover:border-violet-300"}`}
          >
            {name}
          </button>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart
          data={chartData[selected]}
          margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis dataKey="date" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="totalReps"
            stroke="#7c3aed"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
