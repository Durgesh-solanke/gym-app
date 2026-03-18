"use client";
import { useEffect, useState } from "react";

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
  PENDING:  "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
  APPROVED: "bg-green-500/10  text-green-400  border border-green-500/20",
  REJECTED: "bg-red-500/10   text-red-400    border border-red-500/20",
};

export default function AdminClient({
  currentUserId,
}: {
  currentUserId: string;
}) {
  const [users,    setUsers]    = useState<User[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [filter,   setFilter]   = useState<FilterKey>("ALL");
  const [updating, setUpdating] = useState<string | null>(null);

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
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Admin Portal</h1>
          <p className="text-gray-400 text-sm mt-1">
            Manage user access to the app
          </p>
        </div>

        {/* Stat / Filter Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {(["ALL", "PENDING", "APPROVED", "REJECTED"] as FilterKey[]).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`rounded-xl p-4 text-left border transition-all cursor-pointer ${
                filter === s
                  ? "bg-blue-600 border-blue-500 text-white"
                  : "bg-gray-900 border-gray-800 text-gray-400 hover:border-gray-600"
              }`}
            >
              <p className="text-2xl font-bold text-white">{counts[s]}</p>
              <p className="text-xs uppercase tracking-wider mt-1">{s}</p>
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-gray-500">
              Loading users…
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              No users found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800 text-gray-400 uppercase text-xs tracking-wider">
                    <th className="text-left p-4">User</th>
                    <th className="text-left p-4">Status</th>
                    <th className="text-left p-4">Role</th>
                    <th className="text-left p-4">Joined</th>
                    <th className="text-right p-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {filtered.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-800/50 transition-colors"
                    >
                      {/* User info */}
                      <td className="p-4">
                        <p className="text-white font-medium">
                          {user.name || "—"}
                        </p>
                        <p className="text-gray-400 text-xs">{user.email}</p>
                      </td>

                      {/* Status badge */}
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[user.status]}`}
                        >
                          {user.status}
                        </span>
                      </td>

                      {/* Role */}
                      <td className="p-4 text-gray-400">{user.role}</td>

                      {/* Date */}
                      <td className="p-4 text-gray-400">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right">
                        {user.id === currentUserId ? (
                          <span className="text-gray-600 text-xs italic">
                            You
                          </span>
                        ) : (
                          <div className="flex items-center justify-end gap-2">
                            {user.status !== "APPROVED" && (
                              <button
                                disabled={updating === user.id}
                                onClick={() =>
                                  updateStatus(user.id, "APPROVED")
                                }
                                className="px-3 py-1.5 rounded-lg bg-green-600 hover:bg-green-500 text-white text-xs font-medium transition-colors disabled:opacity-50 cursor-pointer"
                              >
                                Approve
                              </button>
                            )}
                            {user.status !== "REJECTED" && (
                              <button
                                disabled={updating === user.id}
                                onClick={() =>
                                  updateStatus(user.id, "REJECTED")
                                }
                                className="px-3 py-1.5 rounded-lg bg-red-700 hover:bg-red-600 text-white text-xs font-medium transition-colors disabled:opacity-50 cursor-pointer"
                              >
                                Reject
                              </button>
                            )}
                            {user.status === "APPROVED" && (
                              <button
                                disabled={updating === user.id}
                                onClick={() =>
                                  updateStatus(user.id, "PENDING")
                                }
                                className="px-3 py-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-white text-xs font-medium transition-colors disabled:opacity-50 cursor-pointer"
                              >
                                Revoke
                              </button>
                            )}
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
        <p className="text-gray-600 text-xs mt-4 text-center">
          To promote a user to Admin, update their role directly in the
          database via Prisma Studio or Neon SQL Editor.
        </p>
      </div>
    </div>
  );
}
