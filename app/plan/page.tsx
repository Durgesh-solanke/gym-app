"use client";
import { useEffect, useState } from "react";
import { PlanCard } from "@/components/plan/PlanCard";
import { ImportPlanButton } from "@/components/plan/ImportPlanButton";
import { Plus } from "lucide-react";
import type { Plan } from "@prisma/client";

export default function PlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");

  const loadPlans = async () => {
    const res = await fetch("/api/plans");
    if (res.ok) setPlans(await res.json());
  };

  useEffect(() => { loadPlans(); }, []);

  const handleCreate = async () => {
    if (!newName.trim()) return;
    await fetch("/api/plans", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName }),
    });
    setNewName("");
    setCreating(false);
    loadPlans();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div className="flex justify-between items-center gap-2 flex-wrap">
        <h2 className="font-semibold text-gray-700">Your plans</h2>
        <div className="flex items-center gap-2">
          <ImportPlanButton />
          <button
            onClick={() => setCreating(true)}
            className="flex items-center gap-1.5 bg-violet-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-violet-700 transition-colors"
          >
            <Plus size={16} /> New plan
          </button>
        </div>
      </div>

      {creating && (
        <div className="bg-white border border-gray-100 rounded-2xl p-4 flex gap-2">
          <input
            autoFocus
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            placeholder="Plan name e.g. Push Pull Legs"
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-400"
          />
          <button
            onClick={handleCreate}
            className="bg-violet-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-violet-700"
          >
            Create
          </button>
          <button
            onClick={() => setCreating(false)}
            className="text-sm px-3 py-2 rounded-lg text-gray-400 hover:bg-gray-100"
          >
            Cancel
          </button>
        </div>
      )}

      {plans.length === 0 && !creating && (
        <p className="text-gray-400 text-sm text-center py-16">
          No plans yet. Import from Excel or create manually!
        </p>
      )}

      <div className="space-y-3">
        {plans.map((plan) => (
          <PlanCard key={plan.id} plan={plan} onRefresh={loadPlans} />
        ))}
      </div>
    </div>
  );
}
