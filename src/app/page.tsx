"use client";

import { useState } from "react";
import TypingArea from "@/components/TypingArea";
import LoginPage from "@/components/LoginPage";
import FinishPage from "@/components/FinishPage";
import { saveScore } from "@/lib/supabase";

export default function Home() {
  const [username, setUsername] = useState<string | null>(null);
  const [gameStats, setGameStats] = useState<{ 
    wpm: number; 
    accuracy: number; 
    username: string;
    isNewBest?: boolean;
  } | null>(null);

  const handleLogin = (name: string) => {
    setUsername(name);
    setGameStats(null);
  };

  const handleLogout = () => {
    setUsername(null);
    setGameStats(null);
  };

  const handleGameEnd = async (stats: { wpm: number; accuracy: number; time: number; username: string }) => {
    const result = await saveScore(stats.username, stats.wpm, stats.accuracy);
    
    setGameStats({
      wpm: stats.wpm,
      accuracy: stats.accuracy,
      username: stats.username,
      isNewBest: result?.isNewBest || false,
    });
  };

  const handleRetry = () => {
    setGameStats(null);
  };

  return (
    <div className="h-screen bg-zinc-900 text-zinc-100 overflow-hidden">
      <main className="h-full flex flex-col items-center justify-center">
        {!username ? (
          <LoginPage onLogin={handleLogin} />
        ) : gameStats ? (
          <FinishPage
            stats={gameStats}
            onRetry={handleRetry}
            onChangeUsername={handleLogout}
          />
        ) : (
          <TypingArea username={username} onLogout={handleLogout} onGameEnd={handleGameEnd} />
        )}
      </main>

      <footer className="fixed bottom-0 right-0 px-8 py-4 text-sm text-zinc-600">
        <a href="https://github.com/aimanaqimie" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-400 transition-colors">github</a>
      </footer>
    </div>
  );
}
