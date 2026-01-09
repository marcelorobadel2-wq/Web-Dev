import React, { useState, useEffect } from 'react';

export const CountDown: React.FC = () => {
  // Set target to 15 minutes from now for evergreen scarcity simulation
  const [timeLeft, setTimeLeft] = useState(15 * 60);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center gap-4 bg-red-500/10 border border-red-500/30 px-6 py-3 rounded-lg backdrop-blur-sm">
      <span className="text-red-400 font-bold uppercase tracking-wider text-sm hidden sm:block">
        A Oferta Expira Em:
      </span>
      <div className="font-mono text-2xl font-black text-red-500 tracking-widest">
        {formatTime(timeLeft)}
      </div>
    </div>
  );
};