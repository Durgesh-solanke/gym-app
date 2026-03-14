"use client";
import type { Plan } from "@prisma/client";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

interface Props {
  plan: Plan;
  onRefresh: () => void;
}

export function PlanCard({ plan, onRefresh }: Props) {
  const activate = async () => {
    await fetch(`/api/plans/${plan.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: true }),
    });
    onRefresh();
  };

  const handleDelete = async () => {
    if (!confirm(`Delete plan "${plan.name}"?`)) return;
    await fetch(`/api/plans/${plan.id}`, { method: "DELETE" });
    onRefresh();
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center justify-between">
      <div>
        <div className="flex items-center gap-2">
          <p className="font-medium text-gray-800">{plan.name}</p>
          {plan.isActive && (
            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full flex items-center gap-1">
              <CheckCircle2 size={10} /> Active
            </span>
          )}
        </div>
        <p className="text-xs text-gray-400 mt-0.5">
          Created {new Date(plan.createdAt).toLocaleDateString()}
        </p>
      </div>
      <div className="flex items-center gap-2">
        {!plan.isActive && (
          <button
            onClick={activate}
            className="text-xs text-violet-600 border border-violet-200 px-3 py-1.5 rounded-lg hover:bg-violet-50 transition-colors"
          >
            Activate
          </button>
        )}
        <Link
          href={`/plan/${plan.id}`}
          className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Edit
        </Link>
        <button
          onClick={handleDelete}
          className="text-xs text-red-400 border border-red-100 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
