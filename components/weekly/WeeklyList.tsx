"use client";

import { useState } from "react";
import { CheckCircle2, Circle, XCircle, ChevronDown, ChevronUp } from "lucide-react";

export type WeeklyDayData = {
  dayName: string;
  isToday: boolean;
  isPast: boolean;
  isRestDay: boolean;
  hasExercises: boolean;
  exercises: {
    id: string;
    name: string;
    isDone: boolean;
  }[];
};

interface Props {
  weekData: WeeklyDayData[];
}

export function WeeklyList({ weekData }: Props) {
  // Find which day is 'today' to open by default, or default to null
  const todayEntry = weekData.find((d) => d.isToday);
  const [openDay, setOpenDay] = useState<string | null>(todayEntry ? todayEntry.dayName : null);

  const toggleDay = (dayName: string) => {
    setOpenDay(openDay === dayName ? null : dayName);
  };

  return (
    <div className="space-y-3">
      {weekData.map((day) => {
        const isOpen = openDay === day.dayName;
        const totalEx = day.exercises.length;
        const doneEx = day.exercises.filter((ex) => ex.isDone).length;
        const progressPercent = totalEx === 0 ? 0 : Math.round((doneEx / totalEx) * 100);

        return (
          <div 
            key={day.dayName} 
            className={`bg-white rounded-xl border shadow-sm overflow-hidden transition-colors ${
              day.isToday ? 'border-purple-200 ring-1 ring-purple-100' : 'border-gray-100'
            } ${day.isRestDay ? 'opacity-70' : ''}`}
          >
            {/* Header (Clickable) */}
            <button
              onClick={() => toggleDay(day.dayName)}
              className="w-full flex items-center justify-between p-5 hover:bg-gray-50 focus:outline-none transition-colors"
            >
              <div className="flex items-center gap-3">
                <h2 className="font-semibold text-lg text-gray-900">
                  {day.dayName}
                  {day.isToday && (
                    <span className="text-[10px] uppercase font-bold tracking-wider bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full ml-2 relative -top-0.5">
                      Today
                    </span>
                  )}
                </h2>
              </div>
              
              <div className="flex items-center gap-4">
                {/* Progress Mini Info */}
                {!day.isRestDay && day.hasExercises && (
                  <div className="hidden sm:flex text-sm text-gray-500 items-center gap-2">
                    <span className="font-medium text-gray-700">{progressPercent}%</span>
                    <span>({doneEx}/{totalEx})</span>
                  </div>
                )}
                {day.isRestDay && (
                  <span className="text-sm text-gray-400 italic hidden sm:block">Rest Day</span>
                )}
                
                <div className="p-1 rounded-full bg-gray-100 text-gray-500">
                  {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </div>
            </button>

            {/* Expandable Content (Exercises) */}
            {isOpen && (
              <div className="p-5 border-t border-gray-100 bg-gray-50/50">
                {day.isRestDay ? (
                  <p className="text-sm text-gray-500 italic text-center py-4">Take a break! It's a nicely earned rest day.</p>
                ) : !day.hasExercises ? (
                  <p className="text-sm text-gray-400 italic text-center py-4">No exercises planned for this day.</p>
                ) : (
                  <ul className="space-y-3">
                    {day.exercises.map((plannedEx) => {
                      let statusIcon = <Circle className="w-5 h-5 text-gray-300" />;
                      let statusClass = "text-gray-500";
                      
                      if (plannedEx.isDone) {
                        statusIcon = <CheckCircle2 className="w-5 h-5 text-green-500" />;
                        statusClass = "text-gray-900 line-through opacity-70";
                      } else if (day.isPast && !plannedEx.isDone) {
                        statusIcon = <XCircle className="w-5 h-5 text-red-400" />;
                        statusClass = "text-gray-500";
                      } else if (day.isToday) {
                        statusIcon = <Circle className="w-5 h-5 text-purple-300" />;
                        statusClass = "text-gray-800 font-medium";
                      }

                      return (
                        <li key={plannedEx.id} className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                          {statusIcon}
                          <div className="flex-1">
                             <span className={`text-sm ${statusClass}`}>{plannedEx.name}</span>
                          </div>
                          {plannedEx.isDone && <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded border border-green-100">Done</span>}
                          {!plannedEx.isDone && day.isPast && <span className="text-xs font-semibold text-red-500 bg-red-50 px-2 py-1 rounded border border-red-100">Missed</span>}
                          {!plannedEx.isDone && !day.isPast && !day.isToday && <span className="text-xs font-medium text-gray-400">Upcoming</span>}
                          {!plannedEx.isDone && day.isToday && <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded border border-purple-100">Pending</span>}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
