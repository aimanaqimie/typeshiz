"use client";

import { useState, useEffect, useCallback, useRef } from "react";

const wordList = [
  "mall", "security", "guard", "fire", "assault", "father", 
  "mistake", "career", "counselor", "offer", "job", 
  "night", "freddy", "fazbear", "pizza", "abandon", "pizzeria", 
  "accept", "social", "service", "custody", "sister", "abby", "pass", 
  "desire", "monthly", "payment", "fall", "asleep", 
  "nightmare", "kidnap", "young", "brother", "witness", "crime", 
  "hire", "gang", "vandal", "max", "hasten", "police",
  "child", "miss", "shift", "end", "leave", "break",  
  "mascot", "bonnie", "chica", "foxy", "cupcake", "kill", "entire", "group", 
  "third", "bring", "work", "fail", "discover", "possess", 
  "ghost", "mention", "yellow", "rabbit", "warn", "springlock", "suit", 
  "contain", "internal", "gear", "faulty", "design", "impale", "wearer", 
  "fourth", "injure", "bond", "allow", "sleep", "pill", "hope", 
  "induce", "dream", "learn", "happen", "stay", "forever",
  "change", "mind", "attack", "damage", "golden", "reveal", 
  "daughter", "serial", "killer", "murder", "hide", "body", 
  "soul", "control", "realize", "plan", "join", "rush", 
  "disable", "arrive", "unmask", "stab", "remind", "drawing", 
  "show", "truth", "picture", "free", "activate",
  "crush", "drag", "flee", "collapse", "coma",  
  "leader", "watch", "die", "fate",

  "the", "be", "to", "of", "and", "a", "in", "that", "have", "i", 
  "it", "for", "on", "with", "he", "you", "do", "at", "this", "but", 
  "his", "by", "from", "they", "we", "say", "her", "she", "or", "an", 
  "will", "my", "one", "all", "would", "their", "what", "if", "who", "get", 
  "which", "go", "me", "make", "can", "like", "time", "him", "know", "take",
  "year", "person", "good", "way", "day", "thing", "man", "world", "life", "hand"
]

type GameStatus = "waiting" | "playing" | "finished";

interface TypingAreaProps {
  username: string;
  onLogout: () => void;
  onGameEnd?: (stats: { wpm: number; accuracy: number; time: number; username: string }) => void;
}

export default function TypingArea({ username, onLogout, onGameEnd }: TypingAreaProps) {
  const [words, setWords] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentInput, setCurrentInput] = useState("");
  const [correctChars, setCorrectChars] = useState(0);
  const [incorrectChars, setIncorrectChars] = useState(0);
  const [gameStatus, setGameStatus] = useState<GameStatus>("waiting");
  const [timeLeft, setTimeLeft] = useState(15);
  const [selectedTime, setSelectedTime] = useState(15);
  const [startTime, setStartTime] = useState<number | null>(null);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const generateWords = useCallback((count: number = 50) => {
    const shuffled = [...wordList].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }, []);

  const resetGame = useCallback(() => {
    setWords(generateWords(50));
    setCurrentWordIndex(0);
    setCurrentInput("");
    setCorrectChars(0);
    setIncorrectChars(0);
    setGameStatus("waiting");
    setTimeLeft(selectedTime);
    setStartTime(null);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, [generateWords, selectedTime]);

  useEffect(() => {
    resetGame();
  }, [resetGame]);

  useEffect(() => {
    if (gameStatus !== "playing") return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameStatus("finished");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStatus]);

  const usernameRef = useRef(username);
  
  useEffect(() => {
    usernameRef.current = username;
  }, [username]);

  useEffect(() => {
    if (gameStatus === "finished" && startTime) {
      const elapsedMinutes = (Date.now() - startTime) / 60000;
      const wpm = Math.round(correctChars / 5 / elapsedMinutes);
      const totalChars = correctChars + incorrectChars;
      const accuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 0;
      
      onGameEnd?.({
        wpm,
        accuracy,
        time: selectedTime,
        username: usernameRef.current,
      });
    }
  }, [gameStatus, startTime, correctChars, incorrectChars, selectedTime, onGameEnd]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (gameStatus === "finished") return;

    if (gameStatus === "waiting" && e.key.length === 1) {
      setGameStatus("playing");
      setStartTime(Date.now());
    }

    if (e.key === " ") {
      e.preventDefault();
      if (currentInput.trim() === "") return;

      const currentWord = words[currentWordIndex];
      const isCorrect = currentInput === currentWord;

      if (isCorrect) {
        setCorrectChars((prev) => prev + currentWord.length + 1);
      } else {
        setIncorrectChars((prev) => prev + currentWord.length + 1);
      }

      setCurrentWordIndex((prev) => prev + 1);
      setCurrentInput("");

      if (currentWordIndex >= words.length - 10) {
        setWords((prev) => [...prev, ...generateWords(20)]);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (gameStatus === "finished") return;
    setCurrentInput(e.target.value);
  };

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  const calculateWPM = () => {
    if (!startTime || gameStatus === "waiting") return 0;
    const elapsedMinutes = (Date.now() - startTime) / 60000;
    if (elapsedMinutes === 0) return 0;
    return Math.round(correctChars / 5 / elapsedMinutes);
  };

  const calculateAccuracy = () => {
    const totalChars = correctChars + incorrectChars;
    if (totalChars === 0) return 100;
    return Math.round((correctChars / totalChars) * 100);
  };

  const renderWord = (word: string, wordIndex: number) => {
    const isCurrentWord = wordIndex === currentWordIndex;
    const isPastWord = wordIndex < currentWordIndex;

    return (
      <span key={wordIndex} className="mr-2">
        {word.split("").map((char, charIndex) => {
          let className = "text-zinc-500";

          if (isPastWord) {
            className = "text-zinc-400";
          } else if (isCurrentWord) {
            if (charIndex < currentInput.length) {
              className =
                currentInput[charIndex] === char
                  ? "text-emerald-400"
                  : "text-red-500 bg-red-500/20";
            } else if (charIndex === currentInput.length) {
              className = "text-zinc-300 border-l-2 border-yellow-400";
            }
          }

          return (
            <span key={charIndex} className={className}>
              {char}
            </span>
          );
        })}
        {isCurrentWord && currentInput.length > word.length && (
          <span className="text-red-500 bg-red-500/20">
            {currentInput.slice(word.length)}
          </span>
        )}
      </span>
    );
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto">
      {/* Stats Display / Start Prompt */}
      <div className="flex gap-8 mb-6 text-2xl font-mono">
        {gameStatus === "waiting" && (
          <div className="text-zinc-400">Start typing...</div>
        )}
        {gameStatus === "playing" && (
          <div className="text-yellow-400">{timeLeft}</div>
        )}
      </div>

      {/* Typing Area */}
      <div
        ref={containerRef}
        onClick={handleContainerClick}
        className="relative w-full p-8 rounded-xl cursor-text transition-all"
      >
        <input
          ref={inputRef}
          type="text"
          value={currentInput}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className="absolute opacity-0 pointer-events-none"
          autoFocus
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
        />

        <div className="leading-loose font-mono text-2xl flex flex-wrap">
          {words.slice(0, currentWordIndex + 30).map((word, index) =>
            renderWord(word, index)
          )}
        </div>
      </div>
    </div>
  );
}
