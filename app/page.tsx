"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { UserName, USERS } from "@/lib/types";

export default function LoginPage() {
  const { currentUser, setCurrentUser } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (currentUser) {
      router.push("/dashboard");
    }
  }, [currentUser, router]);

  const handleSelect = (user: UserName) => {
    setCurrentUser(user);
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 mb-4">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-1">AppTracker</h1>
          <p className="text-slate-400 text-sm">China Mastery &amp; RUYA Services</p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
          <h2 className="text-lg font-semibold text-white mb-2 text-center">Who are you?</h2>
          <p className="text-slate-400 text-sm text-center mb-6">Select your name to continue</p>

          <div className="space-y-3">
            {USERS.map((user) => (
              <button
                key={user}
                onClick={() => handleSelect(user)}
                className="w-full flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-blue-600 border border-white/10 hover:border-blue-500 transition-all group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  {user[0]}
                </div>
                <span className="text-white font-medium text-base">{user}</span>
                <svg className="ml-auto w-5 h-5 text-slate-500 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-slate-500 text-xs">
            Tracking expenses for 2 businesses across 4 currencies
          </p>
        </div>
      </div>
    </div>
  );
}
