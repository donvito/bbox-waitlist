"use client";

import { useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage(data.message);
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong. Please try again.");
      }
    } catch (error) {
      setStatus("error");
      setMessage("Failed to join waitlist. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950">
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center">
          {/* Hero Section */}
          <div className="w-full max-w-4xl text-center">
            <div className="mb-8 inline-block rounded-full bg-indigo-100 px-4 py-2 text-sm font-semibold text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
              Coming Soon
            </div>
            
            <h1 className="mb-6 text-5xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl md:text-7xl">
              Something Amazing
              <span className="block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Is On The Way
              </span>
            </h1>
            
            <p className="mb-12 text-lg text-gray-600 dark:text-gray-300 sm:text-xl md:text-2xl">
              Be the first to know when we launch. Join our exclusive waitlist
              and get early access to something extraordinary.
            </p>

            {/* Waitlist Form */}
            {status === "success" ? (
              <div className="mx-auto max-w-md animate-fade-in">
                <div className="rounded-2xl bg-green-50 p-8 shadow-lg dark:bg-green-900/20">
                  <div className="mb-4 flex justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/40">
                      <svg
                        className="h-8 w-8 text-green-600 dark:text-green-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  </div>
                  <h3 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
                    You're on the list!
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">{message}</p>
                  <button
                    onClick={() => setStatus("idle")}
                    className="mt-6 text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                  >
                    Join another email
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mx-auto max-w-md">
                <div className="flex flex-col gap-4 sm:flex-row">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    disabled={status === "loading"}
                    className="flex-1 rounded-full border border-gray-300 bg-white px-6 py-4 text-gray-900 placeholder-gray-500 shadow-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
                  />
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-4 font-semibold text-white shadow-lg transition-all hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {status === "loading" ? "Joining..." : "Join Waitlist"}
                  </button>
                </div>
                
                {status === "error" && (
                  <div className="mt-4 rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                    {message}
                  </div>
                )}
              </form>
            )}

            {/* Stats */}
            <div className="mt-16 grid grid-cols-3 gap-8 border-t border-gray-200 pt-12 dark:border-gray-700">
              <div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
                  10K+
                </div>
                <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Users Waiting
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
                  50+
                </div>
                <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Countries
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
                  Q1 2026
                </div>
                <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Launch Date
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 border-t border-gray-200 pt-8 text-center text-sm text-gray-600 dark:border-gray-700 dark:text-gray-400">
          <p>&copy; 2025 Your Company. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
