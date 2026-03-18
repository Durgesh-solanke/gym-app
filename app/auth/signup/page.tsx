"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Dumbbell, Clock, CheckCircle } from "lucide-react";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">

      {!success ? (
        // ================= FORM STATE =================
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 space-y-6 w-full max-w-md">

          {/* Logo & Title */}
          <div className="flex flex-col items-center gap-2">
            <div className="bg-violet-100 p-3 rounded-2xl">
              <Dumbbell className="text-violet-600" size={28} />
            </div>
            <h1 className="text-xl font-semibold text-gray-800">
              Gym Buddy
            </h1>
            <p className="text-sm text-gray-400">
              Create your account
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Name */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-600">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-violet-400 transition-colors"
              />
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-600">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-violet-400 transition-colors"
              />
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-600">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 6 characters"
                required
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-violet-400 transition-colors"
              />
            </div>

            {/* Error */}
            {error && (
              <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">
                {error}
              </p>
            )}

            {/* Submit */}
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
            <Link
              href="/auth/signin"
              className="text-violet-600 font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>

      ) : (
        // ================= SUCCESS STATE =================
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 max-w-sm w-full text-center">

          {/* Icon */}
          <div className="flex justify-center mb-5">
            <div className="relative">
              <div className="bg-violet-100 rounded-full p-4">
                <Dumbbell className="text-violet-600" size={28} />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-yellow-400 rounded-full p-1">
                <Clock size={12} className="text-white" />
              </div>
            </div>
          </div>

          <h2 className="text-lg font-bold text-gray-800 mb-1">
            Account Created! 🎉
          </h2>

          <p className="text-sm text-gray-500 mb-6">
            Your account has been submitted for review. An admin will approve
            your access before you can sign in.
          </p>

          {/* Steps */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left border border-gray-100">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              What's next?
            </p>
            <ul className="space-y-2.5">
              {[
                { done: true, text: "Account created successfully" },
                { done: false, text: "Admin reviews your request" },
                { done: false, text: "You receive access to the app" },
              ].map((step, i) => (
                <li key={i} className="flex items-center gap-2.5 text-sm">
                  {step.done ? (
                    <CheckCircle
                      size={16}
                      className="text-green-500 shrink-0"
                    />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-gray-300 shrink-0" />
                  )}
                  <span
                    className={
                      step.done
                        ? "text-gray-700 font-medium"
                        : "text-gray-400"
                    }
                  >
                    {step.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={() => router.push("/auth/signin")}
            className="w-full bg-violet-600 hover:bg-violet-700 text-white py-2.5 rounded-xl text-sm font-medium transition-colors"
          >
            Go to Sign In
          </button>
        </div>
      )}

    </div>
  );
}