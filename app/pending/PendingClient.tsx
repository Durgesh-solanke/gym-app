"use client";
import { signOut } from "next-auth/react";

export default function PendingClient({ userName }: { userName: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-10 max-w-md w-full text-center shadow-xl">

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-yellow-500/10 rounded-full p-4">
            <svg
              className="w-12 h-12 text-yellow-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-white mb-2">Awaiting Approval</h1>
        <p className="text-gray-400 mb-2">
          Hey <span className="text-white font-medium">{userName}</span> 👋
        </p>
        <p className="text-gray-400 mb-8">
          Your account has been created and is pending admin approval. You'll
          have full access once an admin reviews your request.
        </p>

        <div className="bg-gray-800 rounded-xl p-4 mb-8 text-left">
          <p className="text-sm text-gray-400 font-medium mb-2">What happens next?</p>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="flex items-center gap-2">
              <span className="text-yellow-400">•</span> Admin reviews your signup
            </li>
            <li className="flex items-center gap-2">
              <span className="text-yellow-400">•</span> You get approved (or rejected)
            </li>
            <li className="flex items-center gap-2">
              <span className="text-yellow-400">•</span> Sign back in to access the app
            </li>
          </ul>
        </div>

        <button
          onClick={() => signOut({ callbackUrl: "/auth/signin" })}
          className="w-full py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-medium transition-colors cursor-pointer"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
