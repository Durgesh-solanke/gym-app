"use client";
import { useEffect, useState } from "react";
import { Users, CheckCircle, Clock, XCircle, Trash2, AlertTriangle } from "lucide-react";

type User = {
  id:        string;
  name:      string | null;
  email:     string;
  role:      string;
  status:    "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
};

type FilterKey = "ALL" | "PENDING" | "APPROVED" | "REJECTED";

const STATUS_STYLES: Record<User["status"], string> = {
  PENDING:  "bg-yellow-50 text-yellow-700 border border-yellow-200",
  APPROVED: "bg-green-50  text-green-700  border border-green-200",
  REJECTED: "bg-red-50    text-red-600    border border-red-200",
};

const FILTER_CARDS: {
  key:   FilterKey;
  label: string;
  icon:  React.ReactNode;
  color: string;
}[] = [
  { key: "ALL",      label: "Total Users", icon: <Users size={18} />,       color: "text-violet-600 bg-violet-50" },
  { key: "PENDING",  label: "Pending",     icon: <Clock size={18} />,        color: "text-yellow-600 bg-yellow-50" },
  { key: "APPROVED", label: "Approved",    icon: <CheckCircle size={18} />,  color: "text-green-600 bg-green-50" },
  { key: "REJECTED", label: "Rejected",    icon: <XCircle size={18} />,      color: "text-red-500 bg-red-50" },
];

export default function AdminClient({ currentUserId }: { currentUserId: string }) {
  const [users,         setUsers]         = useState<User[]>([]);
  const [loading,       setLoading]       = useState(true);
  const [filter,        setFilter]        = useState<FilterKey>("ALL");
  const [updating,      setUpdating]      = useState<string | null>(null);
  const [deleteTarget,  setDeleteTarget]  = useState<User | null>(null);
  const [deleting,      setDeleting]      = useState(false);

  async function fetchUsers() {
    const res  = await fetch("/api/admin/users");
    const data = await res.json();
    setUsers(data);
    setLoading(false);
  }

  useEffect(() => { fetchUsers(); }, []);

  async function updateStatus(userId: string, status: string) {
    setUpdating(userId);
    await fetch(`/api/admin/users/${userId}`, {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ status }),
    });
    await fetchUsers();
    setUpdating(null);
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    await fetch(`/api/admin/users/${deleteTarget.id}`, { method: "DELETE" });
    await fetchUsers();
    setDeleting(false);
    setDeleteTarget(null);
  }

  const filtered = filter === "ALL"
    ? users
    : users.filter((u) => u.status === filter);

  const counts: Record<FilterKey, number> = {
    ALL:      users.length,
    PENDING:  users.filter((u) => u.status === "PENDING").length,
    APPROVED: users.filter((u) => u.status === "APPROVED").length,
    REJECTED: users.filter((u) => u.status === "REJECTED").length,
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      {/* ── Stat / Filter Cards ─────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {FILTER_CARDS.map(({ key, label, icon, color }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`bg-white rounded-2xl border p-4 text-left transition-all cursor-pointer ${
              filter === key
                ? "border-violet-300 ring-2 ring-violet-100"
                : "border-gray-100 hover:border-gray-200"
            }`}
          >
            <div className={`inline-flex p-2 rounded-lg mb-3 ${color}`}>{icon}</div>
            <p className="text-2xl font-bold text-gray-800">{counts[key]}</p>
            <p className="text-xs text-gray-400 font-medium mt-0.5">{label}</p>
          </button>
        ))}
      </div>

      {/* ── Table Card ─────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">

        {/* Table header */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-700">
            {filter === "ALL"
              ? "All Users"
              : `${filter.charAt(0) + filter.slice(1).toLowerCase()} Users`}
            <span className="ml-2 text-xs font-normal text-gray-400">
              ({filtered.length})
            </span>
          </h2>
          {filter !== "ALL" && (
            <button
              onClick={() => setFilter("ALL")}
              className="text-xs text-violet-600 hover:text-violet-700 font-medium cursor-pointer"
            >
              Clear filter
            </button>
          )}
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-400 text-sm">Loading users…</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-400 text-sm">
            No {filter.toLowerCase()} users found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 uppercase text-xs tracking-wider">
                  <th className="text-left px-5 py-3">User</th>
                  <th className="text-left px-5 py-3">Status</th>
                  <th className="text-left px-5 py-3">Role</th>
                  <th className="text-left px-5 py-3">Joined</th>
                  <th className="text-right px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/60 transition-colors">

                    {/* User info */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center shrink-0">
                          <span className="text-xs font-semibold text-violet-600">
                            {(user.name || user.email).charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{user.name || "—"}</p>
                          <p className="text-gray-400 text-xs">{user.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Status badge */}
                    <td className="px-5 py-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[user.status]}`}>
                        {user.status.charAt(0) + user.status.slice(1).toLowerCase()}
                      </span>
                    </td>

                    {/* Role */}
                    <td className="px-5 py-3.5">
                      <span className={`text-xs font-medium ${
                        user.role === "ADMIN" ? "text-violet-600" : "text-gray-400"
                      }`}>
                        {user.role.charAt(0) + user.role.slice(1).toLowerCase()}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-5 py-3.5 text-gray-400 text-xs">
                      {new Date(user.createdAt).toLocaleDateString("en-US", {
                        month: "short", day: "numeric", year: "numeric",
                      })}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3.5 text-right">
                      {user.id === currentUserId ? (
                        <span className="text-gray-300 text-xs italic">You</span>
                      ) : (
                        <div className="flex items-center justify-end gap-2">
                          {user.status !== "APPROVED" && (
                            <button
                              disabled={updating === user.id}
                              onClick={() => updateStatus(user.id, "APPROVED")}
                              className="px-3 py-1.5 rounded-lg bg-green-50 hover:bg-green-100 text-green-700 text-xs font-medium border border-green-200 transition-colors disabled:opacity-50 cursor-pointer"
                            >
                              Approve
                            </button>
                          )}
                          {user.status !== "REJECTED" && (
                            <button
                              disabled={updating === user.id}
                              onClick={() => updateStatus(user.id, "REJECTED")}
                              className="px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-xs font-medium border border-red-200 transition-colors disabled:opacity-50 cursor-pointer"
                            >
                              Reject
                            </button>
                          )}
                          {user.status === "APPROVED" && (
                            <button
                              disabled={updating === user.id}
                              onClick={() => updateStatus(user.id, "PENDING")}
                              className="px-3 py-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-600 text-xs font-medium border border-gray-200 transition-colors disabled:opacity-50 cursor-pointer"
                            >
                              Revoke
                            </button>
                          )}
                          {/* Delete button */}
                          <button
                            disabled={updating === user.id}
                            onClick={() => setDeleteTarget(user)}
                            className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-400 hover:text-red-600 border border-red-100 transition-colors disabled:opacity-50 cursor-pointer"
                            title="Delete user"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Footer note */}
      <p className="text-gray-400 text-xs text-center pb-2">
        To promote a user to Admin, update their role via Neon SQL Editor.
      </p>

      {/* ── Delete Confirm Modal ────────────────────────────────── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => !deleting && setDeleteTarget(null)}
          />

          {/* Modal */}
          <div className="relative z-10 bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 max-w-sm w-full">

            {/* Warning icon */}
            <div className="flex justify-center mb-4">
              <div className="bg-red-50 rounded-full p-3 border border-red-100">
                <AlertTriangle size={24} className="text-red-500" />
              </div>
            </div>

            <h3 className="text-base font-bold text-gray-800 text-center mb-1">
              Delete User?
            </h3>
            <p className="text-sm text-gray-400 text-center mb-1">
              You are about to permanently delete:
            </p>

            {/* User card */}
            <div className="bg-gray-50 rounded-xl p-3 mb-5 flex items-center gap-3 border border-gray-100">
              <div className="w-9 h-9 rounded-full bg-violet-100 flex items-center justify-center shrink-0">
                <span className="text-sm font-semibold text-violet-600">
                  {(deleteTarget.name || deleteTarget.email).charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">
                  {deleteTarget.name || "—"}
                </p>
                <p className="text-xs text-gray-400">{deleteTarget.email}</p>
              </div>
            </div>

            <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2 mb-5 border border-red-100">
              ⚠️ This will delete all their plans, exercises, and workout logs. This action cannot be undone.
            </p>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="flex-1 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-medium transition-colors disabled:opacity-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-colors disabled:opacity-50 cursor-pointer"
              >
                {deleting ? "Deleting…" : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
