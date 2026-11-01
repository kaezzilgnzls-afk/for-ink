import React, { useEffect, useState } from 'react';
import { Calendar, Flower2, Clock, Sparkles } from 'lucide-react';
import { AppSettings, DailyLetter } from '../types';

interface BirthdayCountdownProps {
  settings: AppSettings;
  letters: DailyLetter[];
  onTriggerBloom: () => void;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

export const BirthdayCountdown: React.FC<BirthdayCountdownProps> = ({
  settings,
  letters,
  onTriggerBloom
}) => {
  const [timeLeft, setTimeLeft] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPast: false
  });

  useEffect(() => {
    const calculateTime = () => {
      // November 13, 2026 in Philippine Time (UTC+8)
      const target = new Date(settings.birthdayDate).getTime();
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isPast: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [settings.birthdayDate]);

  return (
    <div className="relative overflow-hidden rounded-3xl bg-[#263B2D] text-[#FAF7F2] p-6 sm:p-10 shadow-xl border border-[#46684F]/40">
      {/* Botanical ambient glow */}
      <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-[#E26887]/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-[#688D73]/20 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Kicker header showing Philippine Time */}
        <div className="flex flex-wrap items-center justify-center gap-2 px-3.5 py-1 rounded-full bg-[#344E3D] text-[#D0DDD1] text-xs tracking-wider uppercase font-medium mb-3">
          <Calendar className="w-3.5 h-3.5 text-[#F7ADC0]" />
          <span>Countdown Started Nov 1 · Birthday Nov 13 (Philippine Time)</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-serif text-[#FFF5F7] tracking-tight max-w-xl mx-auto leading-tight">
          Happy Birthday Countdown, {settings.recipientName}
        </h1>

        <p className="text-sm sm:text-base text-[#D0DDD1] max-w-lg mt-2 font-light">
          {settings.countdownSubtitle || 'A blooming garden of words counting down to your special day on November 13.'}
        </p>

        {/* Tabular Countdown Numerals */}
        <div className="grid grid-cols-4 gap-2 sm:gap-4 my-6 sm:my-8 w-full max-w-lg">
          {[
            { label: 'Days', value: timeLeft.days },
            { label: 'Hours', value: timeLeft.hours },
            { label: 'Minutes', value: timeLeft.minutes },
            { label: 'Seconds', value: timeLeft.seconds }
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-[#1C2C22]/80 border border-[#46684F]/30 backdrop-blur-sm shadow-inner"
            >
              <span className="text-2xl sm:text-4xl font-serif font-bold text-[#F7ADC0] tabular-nums">
                {String(item.value).padStart(2, '0')}
              </span>
              <span className="text-[11px] sm:text-xs text-[#D0DDD1] uppercase tracking-wider mt-1 font-medium">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* Action button */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={onTriggerBloom}
            className="px-5 py-2.5 rounded-full bg-[#E26887] hover:bg-[#D45575] text-white text-xs sm:text-sm font-medium transition-all shadow-md shadow-[#E26887]/20 flex items-center gap-2 hover:scale-[1.02]"
          >
            <Flower2 className="w-4 h-4" />
            <span>Bloom Chrysanthemum Again</span>
          </button>
        </div>
      </div>
    </div>
  );
};
