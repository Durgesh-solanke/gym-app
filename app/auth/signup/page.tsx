"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Dumbbell } from "lucide-react";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error);
      setLoading(false);
    } else {
      router.push("/auth/signin?registered=true");
    }
  };

  return (
  <div className="w-full">
    <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 space-y-6">

      <div className="flex flex-col items-center gap-2">
        <div className="bg-violet-100 p-3 rounded-2xl">
          <Dumbbell className="text-violet-600" size={28} />
        </div>
        <h1 className="text-xl font-semibold text-gray-800">Gym Buddy</h1>
        <p className="text-sm text-gray-400">Create your account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-600">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-violet-400 transition-colors"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-600">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-violet-400 transition-colors"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-600">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Min 6 characters"
            required
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-violet-400 transition-colors"
          />
        </div>

        {error && (
          <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-violet-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-violet-700 transition-colors disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p className="text-center text-sm text-gray-400">
        Already have an account?{" "}
        <Link href="/auth/signin" className="text-violet-600 font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  </div>
);
}