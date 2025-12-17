"use client";

import { useState } from "react";

interface LoginPageProps {
  onLogin: (username: string) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [username, setUsername] = useState("");

  const isUsernameValid = username.length >= 3 && username.length <= 10;

  const handleStart = () => {
    if (isUsernameValid) {
      onLogin(username);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && isUsernameValid) {
      handleStart();
    }
  };

  return (
    <div className="h-screen flex items-center justify-center overflow-hidden">
      <div className="flex flex-col items-center gap-16">
        <h1 className="text-6xl font-bold text-zinc-100 tracking-tight">
          typeshiz<span className="text-yellow-400">.</span>
        </h1>

        <div className="flex flex-col items-center gap-6 p-10 bg-zinc-800/50 backdrop-blur-sm rounded-3xl shadow-2xl border border-zinc-700/50 w-full max-w-md">
          <div className="flex flex-col items-center gap-3 w-full">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="enter username"
              className="w-full px-5 py-4 bg-zinc-900/80 border-2 border-zinc-700 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/20 transition-all duration-200 text-center text-lg"
              maxLength={10}
              autoFocus
            />

          </div>

          <button
            onClick={handleStart}
            disabled={!isUsernameValid}
            className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-200 ${
              isUsernameValid
                ? "bg-yellow-400 text-zinc-900 hover:bg-yellow-300 hover:shadow-lg hover:shadow-yellow-400/20 active:scale-95 cursor-pointer"
                : "bg-zinc-700/50 text-zinc-500 cursor-not-allowed"
            }`}
          >
            {isUsernameValid ? "start typing" : "start typing" }
          </button>

          <div className="flex items-center gap-2 text-zinc-400 text-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span>15 second challenge</span>
          </div>
        </div>
      </div>
    </div>
  );
}
