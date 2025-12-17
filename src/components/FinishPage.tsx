"use client";

import { useEffect, useState } from "react";
import { getLeaderboard } from "@/lib/supabase";

interface FinishPageProps {
  stats: {
    wpm: number;
    accuracy: number;
    username: string;
    isNewBest?: boolean;
  };
  onRetry: () => void;
  onChangeUsername: () => void;
}

interface LeaderboardEntry {
  rank: number;
  username: string;
  wpm: number;
  accuracy: number;
}

export default function FinishPage({ stats, onRetry, onChangeUsername }: FinishPageProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaderboard() {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 300));
      const data = await getLeaderboard(10);
      setLeaderboard(data);
      setLoading(false);
    }
    fetchLeaderboard();
  }, [stats]);

  return (
    <div className="h-screen flex items-center justify-center overflow-hidden">
      <div className="flex flex-col items-center gap-8 w-full max-w-7xl px-8">
        <h1 className="text-3xl font-bold text-zinc-100">
          {stats.isNewBest ? "New Personal Best." : "finished."}
        </h1>

        <div className="flex gap-12 w-full">
          <div className="flex flex-col items-center gap-6 p-10 bg-zinc-800 rounded-2xl shadow-2xl border border-zinc-700 w-full max-w-sm">
            <div className="flex gap-10">
              <div className="flex flex-col items-center">
                <span className="text-zinc-400 text-xs uppercase tracking-wide">WPM</span>
                <span className="text-4xl font-bold text-yellow-400 mt-2">{stats.wpm}</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-zinc-400 text-xs uppercase tracking-wide">Accuracy</span>
                <span className="text-4xl font-bold text-emerald-400 mt-2">{stats.accuracy}%</span>
              </div>
            </div>
            
            <p className="text-zinc-400 text-xs">
              Playing as <span className="text-yellow-400 font-medium">{stats.username}</span>
            </p>

            <div className="flex flex-col gap-3 mt-2 w-full">
              <button
                onClick={onRetry}
                className="w-full px-5 py-2.5 bg-yellow-400 hover:bg-yellow-300 rounded-lg transition-colors text-zinc-900 font-semibold text-sm"
              >
                Try Again
              </button>
              <button
                onClick={onChangeUsername}
                className="w-full px-5 py-2.5 bg-zinc-700 hover:bg-zinc-600 rounded-lg transition-colors text-zinc-200 font-semibold text-sm"
              >
                Change Username
              </button>
            </div>
          </div>

          <div className="flex-1 bg-zinc-800 rounded-2xl shadow-2xl border border-zinc-700 p-8">
            <h2 className="text-xl font-bold text-zinc-100 mb-6 text-center">Leaderboard</h2>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-zinc-400">Loading leaderboard...</div>
              </div>
            ) : leaderboard.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-zinc-400">try again!</div>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-700">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-zinc-400 uppercase tracking-wide">Rank</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-zinc-400 uppercase tracking-wide">Username</th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-zinc-400 uppercase tracking-wide">WPM</th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-zinc-400 uppercase tracking-wide">Accuracy</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((entry) => (
                    <tr
                      key={entry.rank}
                      className={`transition-colors ${
                        entry.username === stats.username
                          ? "bg-yellow-400/10 border-l-4 border-yellow-400"
                          : ""
                      }`}
                    >
                      <td className="py-4 px-4">
                        <span
                          className={`text-xl font-bold ${
                            entry.rank === 1
                              ? "text-yellow-400"
                              : entry.rank === 2
                              ? "text-zinc-300"
                              : entry.rank === 3
                              ? "text-amber-600"
                              : "text-zinc-500"
                          }`}
                        >
                          #{entry.rank}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-base font-medium text-zinc-100">
                          {entry.username}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className="text-lg font-bold text-yellow-400">{entry.wpm}</span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className="text-lg font-bold text-emerald-400">{entry.accuracy}%</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
